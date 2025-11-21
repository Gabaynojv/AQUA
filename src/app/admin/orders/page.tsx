"use client";

import { useMemo, useState, useEffect } from "react";
import { collectionGroup, query, orderBy, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useFirestore, useCollection } from "@/firebase";
import { useAdminStatus } from '@/hooks/useAdminStatus';
import type { Order, OrderItem } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Loader, Package } from 'lucide-react';
import { collection as firestoreCollection } from 'firebase/firestore';

function OrderItemsList({ userId, orderId }: { userId: string; orderId: string }) {
  const firestore = useFirestore();

  const orderItemsQuery = useMemo(() => {
    if (!firestore || !userId || !orderId) return null;
    return query(firestoreCollection(firestore, `users/${userId}/orders/${orderId}/orderItems`));
  }, [firestore, userId, orderId]);

  const { data: items, isLoading } = useCollection<OrderItem>(orderItemsQuery);

  if (isLoading) return <div className="flex items-center justify-center p-4"><Loader className="h-5 w-5 animate-spin" /></div>;
  if (!items) return <p className="text-sm text-muted-foreground p-4">No items found.</p>;

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center text-sm">
          <p>{item.productName} (x{item.quantity})</p>
          <p className="font-mono">₱{(item.unitPrice * item.quantity).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

function OrderDetailsDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Details for order #{order.id.substring(0, 7)} • placed on {new Date(order.orderDate).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <h4 className="font-semibold text-sm mb-3">Items</h4>
            <OrderItemsList userId={order.userId} orderId={order.id} />
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold text-sm">
              <p>Total</p>
              <p>₱{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Customer</h4>
              <div className="text-muted-foreground space-y-1">
                <p>{order.firstName} {order.lastName}</p>
                <p className="font-mono text-xs">User ID: {order.userId.substring(0, 8)}...</p>
                <p className="text-xs">{order.address}</p>
                <p className="text-xs">{order.city}, {order.state} {order.zipCode}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Delivery & Payment</h4>
              <div className="text-muted-foreground space-y-1">
                <p>Method: {order.deliveryMethod}</p>
                <p>Payment: {order.paymentMethod}</p>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge className={order.status === 'Delivered' ? 'bg-green-500/20 text-green-700' : 'bg-blue-500/20 text-blue-700'}>{order.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [indexError, setIndexError] = useState(false);

  // Fetch orders manually to handle index building
  useEffect(() => {
    if (!firestore || isAdminLoading || !isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIndexError(false);

    const ordersQuery = query(collectionGroup(firestore, 'orders'), orderBy('orderDate', 'desc'));
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({ ...doc.data(), id: doc.id } as Order);
        });
        setOrders(ordersData);
        setIsLoading(false);
        setIndexError(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        if (error.code === 'failed-precondition') {
          setIndexError(true);
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, isAdmin, isAdminLoading]);

  const changeStatus = async (order: Order, status: Order['status']) => {
    if (!firestore || !isAdmin) return;
    try {
      const orderRef = doc(firestore, `users/${order.userId}/orders/${order.id}`);
      await updateDoc(orderRef, { status });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status. See console for details.');
    }
  };

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-destructive/5 to-red-500/5">
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You must be an admin to view orders.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Ensure your account has a `roles_admin/{'{uid}'}` document in Firestore.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
          All Orders
        </h1>
        <p className="text-muted-foreground">View and manage all customer orders</p>
      </div>
      
      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardTitle className="text-2xl">Orders Management</CardTitle>
          <CardDescription>View and update order statuses</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {indexError && (
            <div className="text-center py-10">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Index Building...</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Firestore is building the required index. This usually takes 1-2 minutes.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Please refresh the page in a minute.
              </p>
              <Button onClick={() => window.location.reload()} className="premium-gradient text-white border-0">
                Refresh Page
              </Button>
            </div>
          )}

          {!isLoading && !indexError && (!orders || orders.length === 0) && (
            <div className="text-center py-10">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          )}

          {!isLoading && !indexError && orders && orders.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: Order) => (
                    <TableRow key={`${order.userId}_${order.id}`} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">#{order.id.substring(0, 7)}</TableCell>
                      <TableCell className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{order.firstName} {order.lastName}</p>
                          <p className="text-xs text-muted-foreground">{order.city}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            order.status === 'Delivered' 
                              ? 'bg-green-500/20 text-green-700' 
                              : order.status === 'Cancelled'
                              ? 'bg-red-500/20 text-red-700'
                              : order.status === 'Out for Delivery'
                              ? 'bg-yellow-500/20 text-yellow-700'
                              : 'bg-blue-500/20 text-blue-700'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₱{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            View
                          </Button>
                          {order.status === 'Processing' && (
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700 text-white" 
                              onClick={() => changeStatus(order, 'Out for Delivery')}
                            >
                              Ship
                            </Button>
                          )}
                          {order.status === 'Out for Delivery' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white" 
                              onClick={() => changeStatus(order, 'Delivered')}
                            >
                              Deliver
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => changeStatus(order, 'Cancelled')} 
                            disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <OrderDetailsDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
