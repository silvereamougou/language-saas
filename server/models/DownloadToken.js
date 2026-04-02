import mongoose from 'mongoose';

const downloadTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

export const DownloadToken = mongoose.model('DownloadToken', downloadTokenSchema);
