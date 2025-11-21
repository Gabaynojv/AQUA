
'use client';

import { useMemo, useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUser, useFirestore, useCollection } from "@/firebase";
import type { Order, OrderItem } from '@/lib/types';
import { CreditCard, Loader, Package, Receipt, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

function StatCard({ title, value, icon, isLoading }: { title: string; value: string | number; icon: React.ReactNode; isLoading: boolean; }) {
    return (
        <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-primary/30 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {icon}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted" />
                ) : (
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

function OrderItemsList({ userId, orderId }: { userId: string, orderId: string }) {
  const firestore = useFirestore();

  const orderItemsQuery = useMemo(() => {
    if (!firestore || !userId || !orderId) return null;
    return query(collection(firestore, `users/${userId}/orders/${orderId}/orderItems`));
  }, [firestore, userId, orderId]);

  const { data: orderItems, isLoading } = useCollection<OrderItem>(orderItemsQuery);

  if (isLoading) {
    return <div className="flex items-center justify-center p-4"><Loader className="h-5 w-5 animate-spin" /></div>;
  }
  
  if (!orderItems) {
    return <p className="text-muted-foreground text-sm p-4">Could not load items for this order.</p>;
  }

  return (
    <div className="space-y-3">
        {orderItems.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
                <p>{item.productName} (x{item.quantity})</p>
                <p className="font-mono">₱{(item.unitPrice * item.quantity).toFixed(2)}</p>
            </div>
        ))}
    </div>
  );
}

function OrderDetailsDialog({ order, onClose }: { order: Order | null; onClose: () => void; }) {
    if (!order) return null;

    return (
        <Dialog open={!!order} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Details for order #{order.id.substring(0, 7)}... placed on {new Date(order.orderDate).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Items</h4>
                         <OrderItemsList userId={order.userId} orderId={order.id} />
                        <Separator />
                        <div className="flex justify-between font-semibold text-sm">
                            <p>Total</p>
                            <p>₱{order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                     <Separator />
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-semibold">Shipping Address</h4>
                            <div className="text-muted-foreground">
                                <p>{order.firstName} {order.lastName}</p>
                                <p>{order.address}</p>
                                <p>{order.city}, {order.state} {order.zipCode}</p>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <h4 className="font-semibold">Delivery & Payment</h4>
                            <div className="text-muted-foreground">
                                <p>Method: {order.deliveryMethod}</p>
                                <p>Payment: {order.paymentMethod}</p>
                                {order.trackingNumber && (
                                    <p className="font-mono text-xs mt-2">
                                        Tracking: <span className="font-semibold">{order.trackingNumber}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const ordersQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
    }, [firestore, user]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    // Check for recent status updates (within last 24 hours)
    const recentUpdates = useMemo(() => {
        if (!orders) return [];
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return orders.filter(order => {
            const orderDate = new Date(order.orderDate).getTime();
            return orderDate > oneDayAgo && (order.status === 'Out for Delivery' || order.status === 'Delivered');
        });
    }, [orders]);

    const stats = useMemo(() => {
        if (!orders) return { totalOrders: 0, totalSpent: 0, lastOrderDate: 'N/A' };
        const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const lastOrderDate = orders.length > 0 ? new Date(orders[0].orderDate).toLocaleDateString() : 'N/A';
        return {
            totalOrders: orders.length,
            totalSpent,
            lastOrderDate
        };
    }, [orders]);


    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
                    Welcome back, {user?.displayName || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-muted-foreground text-lg">Here's a summary of your activity with AquaFlow.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
                <StatCard title="Total Spent" value={`₱${stats.totalSpent.toFixed(2)}`} icon={<Receipt className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
                <StatCard title="Last Order" value={stats.lastOrderDate} icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} isLoading={isLoading} />
            </div>

            {recentUpdates.length > 0 && (
                <Card className="border-2 border-green-500/30 shadow-xl bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-950/20 dark:to-cyan-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-green-700 dark:text-green-400">Recent Updates</CardTitle>
                                <CardDescription>You have {recentUpdates.length} order update{recentUpdates.length > 1 ? 's' : ''} in the last 24 hours</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {recentUpdates.map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                                        <div>
                                            <p className="font-semibold text-sm">Order #{order.id.substring(0, 7)}</p>
                                            <p className="text-xs text-muted-foreground">{order.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6">
                <Card className="border-2 shadow-xl">
                    <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                        <CardTitle className="text-2xl">My Orders</CardTitle>
                        <CardDescription>View your order history and track current deliveries.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                       {isLoading && (
                            <div className="flex items-center justify-center h-40">
                                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!isLoading && (!orders || orders.length === 0) && (
                             <div className="text-center py-10">
                                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Orders Yet</h3>
                                <p className="mt-2 text-sm text-muted-foreground">You haven't placed any orders. Start shopping to see them here.</p>
                             </div>
                        )}
                        {!isLoading && orders && orders.length > 0 && (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-[100px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map(order => (
                                            <TableRow key={order.id} className="hover:bg-muted/50">
                                                <TableCell className="font-mono text-xs font-semibold">#{order.id.substring(0, 7)}</TableCell>
                                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                                                        className={
                                                            order.status === 'Delivered' 
                                                                ? 'bg-green-500/20 text-green-700' 
                                                                : order.status === 'Cancelled'
                                                                ? 'bg-red-500/20 text-red-700'
                                                                : 'bg-blue-500/20 text-blue-700'
                                                        }
                                                    >
                                                    {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-primary">₱{order.totalAmount.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)} className="hover:bg-primary hover:text-white transition-colors">
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
             <OrderDetailsDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
}
