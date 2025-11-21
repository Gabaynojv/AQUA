'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Loader } from 'lucide-react';

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const firestore = useFirestore();

  const handleTrack = async () => {
    if (!trackingNumber.trim() || !firestore) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const ordersQuery = query(
        collectionGroup(firestore, 'orders'),
        where('trackingNumber', '==', trackingNumber.trim())
      );
      
      const snapshot = await getDocs(ordersQuery);
      
      if (snapshot.empty) {
        setError('Order not found. Please check your tracking number.');
      } else {
        const orderData = snapshot.docs[0].data() as Order;
        setOrder(orderData);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return <Clock className="h-6 w-6" />;
      case 'Out for Delivery':
        return <Truck className="h-6 w-6" />;
      case 'Delivered':
        return <CheckCircle className="h-6 w-6" />;
      case 'Cancelled':
        return <XCircle className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'from-blue-500 to-cyan-500';
      case 'Out for Delivery':
        return 'from-yellow-500 to-orange-500';
      case 'Delivered':
        return 'from-green-500 to-emerald-500';
      case 'Cancelled':
        return 'from-red-500 to-rose-500';
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-500/20 text-blue-700';
      case 'Out for Delivery':
        return 'bg-yellow-500/20 text-yellow-700';
      case 'Delivered':
        return 'bg-green-500/20 text-green-700';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-4">
                Track Your Order
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Enter your tracking number to see the status of your delivery
              </p>

              {/* Search Box */}
              <Card className="max-w-2xl mx-auto border-2 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter tracking number (e.g., AQ12345678)"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                        className="pl-10 h-12 border-2 focus:border-primary"
                      />
                    </div>
                    <Button
                      onClick={handleTrack}
                      disabled={isLoading}
                      className="premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300 h-12 px-8"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Tracking...
                        </>
                      ) : (
                        'Track Order'
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-destructive text-sm mt-3 text-left">{error}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Order Details Section */}
        {order && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                {/* Status Card */}
                <Card className="border-2 shadow-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getStatusColor(order.status)}`} />
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">Order Status</CardTitle>
                        <CardDescription className="text-base">
                          Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                        </CardDescription>
                      </div>
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${getStatusColor(order.status)} flex items-center justify-center text-white shadow-lg`}>
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <Badge className={`${getStatusBadgeClass(order.status)} text-lg px-4 py-2`}>
                        {order.status}
                      </Badge>
                      {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <p className="text-sm text-muted-foreground">
                          Estimated Delivery: <span className="font-semibold">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>

                    {/* Progress Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                      <div className="space-y-6">
                        {[
                          { status: 'Processing', label: 'Order Placed', active: true },
                          { status: 'Out for Delivery', label: 'Out for Delivery', active: order.status === 'Out for Delivery' || order.status === 'Delivered' },
                          { status: 'Delivered', label: 'Delivered', active: order.status === 'Delivered' },
                        ].map((step, index) => (
                          <div key={index} className="relative flex items-center gap-4">
                            <div className={`relative z-10 h-8 w-8 rounded-full flex items-center justify-center ${
                              step.active 
                                ? 'bg-gradient-to-br from-primary to-cyan-500 text-white shadow-lg' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {step.active ? <CheckCircle className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                            </div>
                            <div>
                              <p className={`font-semibold ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.label}
                              </p>
                              {step.active && index === 0 && (
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.orderDate).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Details */}
                <Card className="border-2 shadow-xl">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                    <CardTitle className="text-xl">Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Shipping Address
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="font-medium text-foreground">{order.firstName} {order.lastName}</p>
                          <p>{order.address}</p>
                          <p>{order.city}, {order.state} {order.zipCode}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          Order Information
                        </h3>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-mono">#{order.id.substring(0, 8)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Delivery Method:</span>
                            <span className="font-medium">{order.deliveryMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment:</span>
                            <span className="font-medium">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="font-bold text-primary text-lg">₱{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
