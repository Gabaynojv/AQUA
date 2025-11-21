'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (user) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Your Shopping Cart
          </h1>
          <p className="text-muted-foreground mt-2">Review your items and proceed to checkout</p>
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button asChild className="premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start animate-fade-in">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, index) => {
                const productImage = placeholderImages.find(p => p.id === item.product.imageId);
                return (
                  <Card 
                    key={item.product.id} 
                    className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/30 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 shrink-0 shadow-md">
                        {productImage && (
                          <Image
                            src={productImage.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-contain p-3"
                          />
                        )}
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.product.description}</p>
                        <p className="text-lg font-semibold text-primary">₱{item.product.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value, 10))}
                            className="w-20 h-10 text-center font-semibold"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFromCart(item.product.id)}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                        <div className="font-bold text-xl text-primary">
                          ₱{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="md:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Card className="sticky top-20 border-2 shadow-xl">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes</span>
                      <span className="font-medium">₱0.00</span>
                    </div>
                  </div>
                  <div className="border-t-2 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-3xl font-bold text-primary">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full premium-gradient text-white border-0 hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg py-6" 
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout • Free delivery on all orders
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
