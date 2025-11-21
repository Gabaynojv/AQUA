'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { useCart } from '@/context/cart-context';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { OrderCountBadge } from '@/components/admin/order-count-badge';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { cart } = useCart();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();

  const onSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isUserLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
           <div className="flex flex-1 items-center justify-end space-x-4">
              <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
              <div className="h-8 w-20 bg-muted rounded-md animate-pulse"></div>
           </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium flex-1">
          <Button variant="ghost" asChild className="hover:text-primary transition-colors">
            <Link href="/products">Products</Link>
          </Button>
          <Button variant="ghost" asChild className="hover:text-primary transition-colors">
            <Link href="/#how-it-works">How It Works</Link>
          </Button>
        </nav>
        <div className="flex flex-1 md:flex-initial items-center justify-end space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild className="relative hover:bg-primary/10 transition-colors">
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500 text-xs font-bold text-white shadow-lg animate-scale-in">
                        {cartItemCount}
                    </span>
                )}
                <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          {user ? (
            <>
              {!isAdminLoading && isAdmin && (
                <Button variant="ghost" asChild className="hover:text-primary transition-colors relative">
                  <Link href="/admin">
                    Admin
                    <OrderCountBadge />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" onClick={onSignOut} className="hover:text-destructive transition-colors">Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hover:text-primary transition-colors">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
