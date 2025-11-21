'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { featuredProducts } from '@/lib/placeholder-data';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, ShoppingCart, Truck, Droplet } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';


export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] md:h-[80vh] text-white overflow-hidden">
          {heroImage &&
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          }
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-blue-600/80 to-cyan-500/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold font-headline drop-shadow-2xl leading-tight">
                Pure Water, Delivered to Your Door
              </h1>
              <p className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-lg font-light">
                Stay refreshed and hydrated with AquaFlow's convenient water delivery service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button asChild size="lg" className="premium-gradient hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white border-0 px-8 py-6 text-lg">
                  <Link href="#products">Order Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/20 backdrop-blur-md hover:bg-white/30 border-white/40 text-white hover:text-white px-8 py-6 text-lg transition-all duration-300">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
            </svg>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Get fresh water delivered in 3 simple steps. It's that easy!
              </p>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { id: 1, icon: ShoppingCart, title: 'Place Your Order', description: 'Select your favorite water products and add them to your cart.', color: 'from-blue-500 to-cyan-500' },
                { id: 2, icon: Truck, title: 'We Deliver', description: 'Checkout and our team will deliver your order right to your doorstep.', color: 'from-cyan-500 to-teal-500' },
                { id: 3, icon: Droplet, title: 'Enjoy & Repeat', description: 'Stay hydrated with pure, refreshing water. Reordering is easy.', color: 'from-teal-500 to-green-500' },
              ].map((step, index) => (
                <div 
                  key={step.id} 
                  className="text-center group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`relative flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br ${step.color} text-white mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <step.icon className="h-10 w-10" />
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold text-primary">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="products" className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                Our Most Popular Products
              </h2>
              <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Choose the perfect size for your home or office. Premium quality, delivered fresh.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => {
                 const productImage = placeholderImages.find(p => p.id === product.imageId);
                 return (
                  <Card 
                    key={product.id} 
                    className="flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-4">
                      {productImage &&
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                          <Image
                            src={productImage.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                            data-ai-hint={productImage.imageHint}
                          />
                        </div>
                      }
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-primary">₱{product.price.toFixed(2)}</p>
                        <span className="text-sm text-muted-foreground">per unit</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full premium-gradient hover:shadow-lg transition-all duration-300 text-white border-0 group-hover:scale-105" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                 )
                })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                What Our Customers Say
              </h2>
              <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Join thousands of happy customers who trust AquaFlow
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: 'Maria Santos',
                  role: 'Home Customer',
                  content: 'AquaFlow has been a lifesaver! The water quality is excellent and delivery is always on time. Highly recommend!',
                  rating: 5,
                },
                {
                  name: 'Juan Dela Cruz',
                  role: 'Office Manager',
                  content: 'We switched to AquaFlow for our office and couldn\'t be happier. The ordering process is so easy and the service is top-notch.',
                  rating: 5,
                },
                {
                  name: 'Lisa Chen',
                  role: 'Restaurant Owner',
                  content: 'Reliable, affordable, and great customer service. AquaFlow is our go-to for all our water needs.',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-blue-500 to-cyan-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6">
                Ready to Stay Hydrated?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of satisfied customers who trust AquaFlow for their daily water needs. Order now and get your first delivery free!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6">
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/40 text-white hover:text-white px-8 py-6 text-lg transition-all duration-300">
                  <Link href="/track">Track Your Order</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                Why Choose AquaFlow?
              </h2>
              <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                We're committed to delivering excellence in every drop
              </p>
            </div>
            <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {[
                  { icon: CheckCircle, title: 'Reliable Delivery', description: 'Get your water on time, every time with our smart scheduling.', gradient: 'from-blue-500 to-cyan-500' },
                  { icon: CheckCircle, title: 'Pure Quality', description: 'We source only the highest quality purified and spring water.', gradient: 'from-cyan-500 to-teal-500' },
                  { icon: CheckCircle, title: 'Flexible Plans', description: 'Order on-demand or subscribe and save. The choice is yours.', gradient: 'from-teal-500 to-green-500' },
                  { icon: CheckCircle, title: 'Eco-Friendly', description: 'We encourage bottle recycling and use optimized routes to reduce our footprint.', gradient: 'from-green-500 to-emerald-500' },
                ].map((feature, index) => (
                  <div 
                    key={feature.title}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50 group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
