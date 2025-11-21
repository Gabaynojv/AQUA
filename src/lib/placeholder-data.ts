import type { Product, HowItWorksStep, Delivery } from '@/lib/types';
import { Droplet, ShoppingCart, Truck } from 'lucide-react';

export const howItWorksSteps: HowItWorksStep[] = [
    {
        id: 1,
        icon: ShoppingCart,
        title: 'Place Your Order',
        description: 'Select your favorite water products and choose a delivery or pickup option that works for you.',
    },
    {
        id: 2,
        icon: Truck,
        title: 'We Deliver',
        description: 'Our team delivers your order right to your doorstep during your chosen time slot, using optimized routes.',
    },
    {
        id: 3,
        icon: Droplet,
        title: 'Enjoy & Repeat',
        description: 'Stay hydrated with pure, refreshing water. Reordering is just a few clicks away in your dashboard.',
    },
];

export const featuredProducts: Product[] = [
    {
        id: '1',
        name: 'Mineral bottle',
        description: 'Perfect for families or offices. Clean and refreshing taste.',
        price: 35.00,
        imageId: 'product-5-gallon'
    },
    {
        id: '2',
        name: '1-Gallon Purified Water',
        description: 'A convenient size for personal use or smaller households.',
        price: 12.00,
        imageId: 'product-1-gallon'
    },
    {
        id: '3',
        name: 'Case of Bottled Water',
        description: '24-pack of 500ml bottles. Ideal for on-the-go hydration.',
        price: 25.00,
        imageId: 'product-case'
    },
    {
        id: '4',
        name: 'Water Jug',
        description: 'Large capacity water jug with convenient tap. Perfect for home or office use.',
        price: 45.00,
        imageId: 'product-sparkling'
    }
];

export const initialDeliveries: Delivery[] = [];
