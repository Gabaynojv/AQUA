import type { LucideIcon } from 'lucide-react';

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageId: string;
};

export type CartItem = {
    product: Product;
    quantity: number;
};

export type HowItWorksStep = {
    id: number;
    icon: LucideIcon;
    title: string;
    description: string;
};

export type Delivery = {
    orderId: string;
    address: string;
    timeWindowStart: string;
    timeWindowEnd: string;
};

export type Order = {
    id: string;
    userId: string;
    orderDate: string;
    totalAmount: number;
    status: 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    // shipping info
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryMethod: 'Deliver' | 'Walk-in';
    paymentMethod: 'Cash on Delivery' | 'GCash' | 'Maya';
    // delivery time slot (optional)
    deliveryDate?: string;
    deliveryTimeSlot?: string;
    // tracking
    trackingNumber?: string;
    estimatedDelivery?: string;
};

export type OrderItem = {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
};
