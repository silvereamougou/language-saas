export interface Product {
    _id: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    promotionPrice?: number;
    category: string;
    thumbnail: string;
    image: string;
    gallery: string[];
    rating: number;
    reviews: number;
    totalSales: number;
    revenue: number;
    status: 'Draft' | 'Published' | 'Unpublished';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVersion {
    _id: string;
    productId: string; // Reference to Product
    version: string;
    fileUrl: string;
    changelog: string;
    isLatest: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    email: string;
    name?: string; // Optional per schema
    productId: string | Product; // Reference to Product
    amount: number;
    status: 'pending' | 'success' | 'failed';
    transactionId: string;
    hasAccess: boolean;
    createdAt: string;
    updatedAt: string;

    // Frontend fallback
    id?: string;
    productName?: string;
    productImage?: string;
    date?: string;
    price?: number;
    customerName?: string;
    quantity?: number;
}

export interface DownloadToken {
    _id: string;
    email: string;
    productId: string; // Reference to Product
    token: string;
    expiresAt: string; // Date stored as ISO string for frontend
    createdAt: string;
}
