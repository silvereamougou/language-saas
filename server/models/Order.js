import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String }, // Optional
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String, required: true },
    hasAccess: { type: Boolean, default: false },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
