import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    promotionPrice: { type: Number },
    thumbnail: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    gallery: [{ type: String }],
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Unpublished'],
        default: 'Draft'
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
