'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { Loader, ShoppingCart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { collection, writeBatch, doc } from 'firebase/firestore';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const shippingSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    address: z.string().min(1, 'Address is required.'),
    city: z.string().min(1, 'City is required.'),
    state: z.string().min(1, 'State is required.'),
    zipCode: z.string().min(1, 'Zip code is required.'),
    deliveryMethod: z.enum(['Deliver', 'Walk-in'], {
        required_error: "Please select a delivery method."
    }),
    paymentMethod: z.enum(['Cash on Delivery', 'GCash', 'Maya'], {
        required_error: "Please select a payment method."
    }),
    deliveryDate: z.string().optional(),
    deliveryTimeSlot: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
    }
  });

  const { isSubmitting } = form.formState;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const onSubmit = async (data: ShippingFormValues) => {
    if (!firestore || !user || cart.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Cannot place order. Please try again.',
        });
        return;
    }

    const batch = writeBatch(firestore);

    // 1. Create the Order document
    const ordersCollection = collection(firestore, `users/${user.uid}/orders`);
    const orderRef = doc(ordersCollection);
    
    // Generate tracking number
    const trackingNumber = `AQ${Date.now().toString().slice(-8)}`;
    
    // Calculate estimated delivery
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);
    
    const newOrder = {
        id: orderRef.id,
        userId: user.uid,
        orderDate: new Date().toISOString(),
        ...data, // Shipping, delivery, and payment info
        totalAmount: subtotal,
        status: 'Processing' as const,
        trackingNumber,
        estimatedDelivery: estimatedDelivery.toISOString(),
    };
    batch.set(orderRef, newOrder);

    // 2. Create OrderItem documents
    cart.forEach(item => {
        const orderItemsCollection = collection(firestore, `users/${user.uid}/orders/${orderRef.id}/orderItems`);
        const orderItemRef = doc(orderItemsCollection);
        const newOrderItem = {
            id: orderItemRef.id,
            orderId: orderRef.id,
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
            productName: item.product.name, // Denormalize for easier display
        };
        batch.set(orderItemRef, newOrderItem);
    });

    try {
        await batch.commit();
        toast({
            title: 'Order Placed!',
            description: 'Your order has been successfully placed.',
        });
        clearCart();
        router.push('/dashboard');
    } catch (error) {
        console.error("Error placing order: ", error);
        toast({
            variant: 'destructive',
            title: 'Failed to place order',
            description: 'There was a problem placing your order. Please try again.',
        });
    }
  };


  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">You can't proceed to checkout with an empty cart.</p>
        <Button asChild className="premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
          Checkout
        </h1>
        <p className="text-muted-foreground">Complete your order and get fresh water delivered</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
            <Card className="mb-6 border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                <CardTitle className="text-xl">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Water St" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Anytown" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="CA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </CardContent>
            </Card>

            {/* Delivery Time Slot Selection */}
            <Card className="mb-6 border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                <CardTitle className="text-xl">Delivery Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="deliveryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Delivery Date</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a date" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                        <SelectItem value="2-days">In 2 Days</SelectItem>
                                        <SelectItem value="3-days">In 3 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deliveryTimeSlot"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Time Slot</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a time" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                                        <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                                        <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    * Delivery times are estimates and may vary based on traffic and weather conditions
                </p>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                        <CardTitle>Delivery Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                        control={form.control}
                        name="deliveryMethod"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Deliver" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Deliver
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Walk-in" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Walk-in
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>
                 <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Cash on Delivery" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Cash on Delivery
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="GCash" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    GCash
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="Maya" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Maya
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                </Card>
            </div>
            </div>
            <div>
            <Card className="sticky top-20 border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                    {cart.map(item => {
                    const productImage = placeholderImages.find(p => p.id === item.product.imageId);
                    return (
                        <div key={item.product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                            {productImage && <Image src={productImage.imageUrl} alt={item.product.name} fill className="object-contain" />}
                            </div>
                            <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-medium">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    )
                    })}
                </div>
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Taxes</span>
                        <span>₱0.00</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                </div>
                <Button type="submit" size="lg" className="w-full premium-gradient text-white border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg py-6" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="mr-2 h-5 w-5 animate-spin" />}
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  🔒 Secure checkout • Your information is protected
                </p>
                </CardContent>
            </Card>
            </div>
        </form>
      </Form>
    </div>
  );
}
