import { Logo } from '@/components/logo';

import Link from 'next/link';
import { Droplet, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-muted/30 mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pure water, delivered fresh to your doorstep. Stay hydrated with AquaFlow.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Facebook className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Twitter className="h-4 w-4 text-primary" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Instagram className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#products" className="hover:text-primary transition-colors">Water Bottles</Link></li>
              <li><Link href="/#products" className="hover:text-primary transition-colors">Gallon Jugs</Link></li>
              <li><Link href="/#products" className="hover:text-primary transition-colors">Bulk Orders</Link></li>
              <li><Link href="/#products" className="hover:text-primary transition-colors">Subscriptions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AquaFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href="mailto:support@aquaflow.com" className="hover:text-primary transition-colors">
              support@aquaflow.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
