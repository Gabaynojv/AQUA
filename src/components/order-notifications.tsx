'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { Bell, Package, CheckCircle2 } from 'lucide-react';

export function OrderNotifications() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [previousOrders, setPreviousOrders] = useState<Map<string, Order>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  const ordersQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/orders`),
      orderBy('orderDate', 'desc'),
      limit(20)
    );
  }, [firestore, user]);

  useEffect(() => {
    if (!ordersQuery) return;

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const currentOrders = new Map<string, Order>();
      
      snapshot.forEach((doc) => {
        const order = { ...doc.data(), id: doc.id } as Order;
        currentOrders.set(doc.id, order);
      });

      // Only check for changes after initialization
      if (isInitialized) {
        currentOrders.forEach((currentOrder, orderId) => {
          const previousOrder = previousOrders.get(orderId);
          
          // Check if order status changed
          if (previousOrder && previousOrder.status !== currentOrder.status) {
            // Show notification for status changes
            if (currentOrder.status === 'Out for Delivery') {
              toast({
                title: (
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-600" />
                    <span>Order Shipped!</span>
                  </div>
                ),
                description: `Your order #${orderId.substring(0, 7)} is now out for delivery.`,
                duration: 5000,
              });
            } else if (currentOrder.status === 'Delivered') {
              toast({
                title: (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span>Order Delivered!</span>
                  </div>
                ),
                description: `Your order #${orderId.substring(0, 7)} has been delivered successfully.`,
                duration: 6000,
              });
            } else if (currentOrder.status === 'Processing') {
              toast({
                title: (
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <span>Order Approved!</span>
                  </div>
                ),
                description: `Your order #${orderId.substring(0, 7)} has been approved by admin and is being processed.`,
                duration: 5000,
              });
            }
          }
        });
      }

      setPreviousOrders(currentOrders);
      
      // Mark as initialized after first load
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [ordersQuery, previousOrders, isInitialized, toast]);

  return null; // This is a background component
}
