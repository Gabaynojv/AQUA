'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, Timestamp, collectionGroup } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Bell, Package, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Order } from '@/lib/types';

export function NewOrderNotification() {
  const firestore = useFirestore();
  const { isAdmin } = useAdminStatus();
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    if (!firestore || !isAdmin) return;

    // For collection group query - query all orders across all users
    const allOrdersQuery = query(
      collectionGroup(firestore, 'orders'),
      orderBy('orderDate', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(
      allOrdersQuery, 
      (snapshot) => {
      const orders: Order[] = [];
      
      snapshot.forEach((doc) => {
        const orderData = doc.data() as Order;
        const orderDate = new Date(orderData.orderDate);
        
        // Only show orders placed after component mounted
        if (orderDate > lastChecked) {
          orders.push(orderData);
        }
      });

      if (orders.length > 0) {
        setNewOrders(orders);
        setShowNotification(true);
        
        // Play notification sound
        playNotificationSound();
        
        // Show browser notification if permitted
        showBrowserNotification(orders.length);
      }
    },
    (error) => {
      // Silently handle index building errors
      if (error.code === 'failed-precondition') {
        console.log('Index is building, notifications will be available soon...');
      } else {
        console.error('Error in order notifications:', error);
      }
    });

    return () => unsubscribe();
  }, [firestore, isAdmin, lastChecked]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore if audio play fails (browser restrictions)
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const showBrowserNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Order Received!', {
        body: `You have ${count} new order${count > 1 ? 's' : ''} to process.`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
    setLastChecked(new Date());
    setNewOrders([]);
  };

  if (!showNotification || newOrders.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-up">
      <Card className="w-96 border-2 border-primary shadow-2xl bg-white dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center animate-pulse">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">New Order{newOrders.length > 1 ? 's' : ''}!</h3>
                <p className="text-sm text-muted-foreground">
                  {newOrders.length} new order{newOrders.length > 1 ? 's' : ''} received
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {newOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">
                      {order.firstName} {order.lastName}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    #{order.id.substring(0, 7)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {order.city}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ₱{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 premium-gradient text-white border-0"
            >
              <Link href="/admin/orders">View Orders</Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
