import mongoose from 'mongoose';

const productVersionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    version: { type: String, required: true }, // e.g., "1.0.0"
    fileUrl: { type: String, required: true },
    changelog: { type: String, required: true },
    isLatest: { type: Boolean, default: false },
}, { timestamps: true });

export const ProductVersion = mongoose.model('ProductVersion', productVersionSchema);
