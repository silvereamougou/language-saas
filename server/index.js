import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { ProductVersion } from './models/ProductVersion.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';
import { DownloadToken } from './models/DownloadToken.js';
import { upload } from './config/cloudinary.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import https from 'https';
import { requireAdmin, requireUser } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/language-saas';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// --- API Routes ---

// 1. Health Check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 1.5 Admin Authentication
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    // Verify against environment variable password (fallback for local dev)
    const validPassword = process.env.ADMIN_PASSWORD || 'password123';

    if (password === validPassword) {
        const token = jwt.sign(
            { role: 'admin' },
            process.env.JWT_SECRET || 'fallback_secret_for_development',
            { expiresIn: '24h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// 1.8 Customer OTP Auth
app.post('/api/auth/request-otp', async (req, res) => {
    try {
        const { email, name } = req.body;
        // Generate a 6 digit dummy OTP for development
        // Real app: send via SendGrid, Resend, etc.
        const otp = '123456';

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            user = new User({ email: email.toLowerCase(), name });
        } else if (name && !user.name) {
            // Update name if they didn't have one
            user.name = name;
        }

        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();

        console.log(`\n\n[DEV ONLY] OTP for ${user.email} is: ${otp}\n\n`);

        res.json({ message: 'OTP sent successfully (Check server console for now)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email: email.toLowerCase(),
            otp: otp,
            otpExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: 'customer' },
            process.env.JWT_SECRET || 'fallback_secret_for_development',
            { expiresIn: '30d' }
        );
        res.json({ token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Fetch Products (with optional status filter)
app.get('/api/products', async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Create Product (Protected)
app.post('/api/products', requireAdmin, async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Get Single Product Detailed
app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid Product ID format' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        const versions = await ProductVersion.find({ productId: req.params.id }).sort({ createdAt: -1 });
        res.json({ ...product._doc, versions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4.1 Update Product (Protected)
app.put('/api/products/:id', requireAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid Product ID format' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4.2 Delete Product (Protected)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid Product ID format' });
        }
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Orders (Protected by requireUser, except Admin can fetch all)
app.get('/api/orders', requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/my-orders', requireUser, async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.user.email }).populate('productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', requireUser, async (req, res) => {
    try {
        // Simple order creation (in a real app, this would involve payment verification)
        const newOrder = await Order.create({
            ...req.body,
            status: 'success' // Assume success for now
        });

        // Update product analytics
        await Product.findByIdAndUpdate(req.body.productId, {
            $inc: { totalSales: 1, revenue: req.body.amount || 0 }
        });

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/admin/orders', requireAdmin, async (req, res) => {
    try {
        const { userEmail, productId, amount, status } = req.body;
        const newOrder = await Order.create({
            userEmail,
            productId,
            amount: Number(amount),
            status: status || 'success',
            transactionId: `MANUAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            hasAccess: true
        });

        // Update product analytics
        await Product.findByIdAndUpdate(productId, {
            $inc: { totalSales: 1, revenue: Number(amount) || 0 }
        });

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 6. Product Versions
app.post('/api/products/:id/versions', requireAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Set all previous versions to isLatest: false
        await ProductVersion.updateMany({ productId: req.params.id }, { isLatest: false });

        const newVersion = await ProductVersion.create({
            productId: req.params.id,
            ...req.body,
            isLatest: true
        });

        res.status(201).json(newVersion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 7. Image Upload Utility (Cloudinary, Protected)
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) throw new Error('No file uploaded');
        res.json({
            url: req.file.path,
            public_id: req.file.filename
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 8. Secure Digital Downloads
app.post('/api/downloads/generate-token', requireUser, async (req, res) => {
    try {
        const { productId } = req.body;
        const userEmail = req.user.email;

        // Verify purchase
        const order = await Order.findOne({ userEmail, productId, status: 'success' });
        if (!order) {
            return res.status(403).json({ error: 'You have not purchased this product.' });
        }

        // Verify product version exists
        const version = await ProductVersion.findOne({ productId, isLatest: true });
        if (!version || !version.fileUrl) {
            return res.status(404).json({ error: 'Source file not available yet.' });
        }

        // Generate strong secure token 
        const tokenStr = crypto.randomBytes(32).toString('hex');

        // Token expires in 5 minutes (extremely anti-piracy)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const downloadToken = await DownloadToken.create({
            email: userEmail,
            productId,
            token: tokenStr,
            expiresAt
        });

        res.json({ token: downloadToken.token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/downloads/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const downloadToken = await DownloadToken.findOne({ token, expiresAt: { $gt: new Date() } });
        if (!downloadToken) {
            return res.status(403).send('Download link is invalid or has expired.');
        }

        const version = await ProductVersion.findOne({ productId: downloadToken.productId, isLatest: true });
        if (!version || !version.fileUrl) {
            return res.status(404).send('Source file missing.');
        }

        // Token is one-time use (Optional, but maximum security)
        await DownloadToken.findByIdAndDelete(downloadToken._id);

        // Proxy the stream so user never sees the real Cloudinary/S3 URL
        // Content-Disposition forces a download prompt
        res.setHeader('Content-Disposition', `attachment; filename="product-${downloadToken.productId}.zip"`);

        https.get(version.fileUrl, (stream) => {
            stream.pipe(res);
        }).on('error', (err) => {
            res.status(500).send('Streaming error occurred.');
        });

    } catch (err) {
        res.status(500).send('Internal server error.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
