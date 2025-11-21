'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { featuredProducts } from '@/lib/placeholder-data';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = featuredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-4">
                Our Products
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Premium quality water delivered fresh to your doorstep. Choose from our wide selection.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 border-b bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48 h-12 border-2">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3">No products found</h2>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search or filters
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-8">
                  Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSortedProducts.map((product, index) => {
                    const productImage = placeholderImages.find(p => p.id === product.imageId);
                    return (
                      <Card
                        key={product.id}
                        className="flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 overflow-hidden animate-scale-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CardHeader className="pb-4">
                          {productImage && (
                            <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                              <Image
                                src={productImage.imageUrl}
                                alt={product.name}
                                fill
                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                data-ai-hint={productImage.imageHint}
                              />
                            </div>
                          )}
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {product.description}
                          </CardDescription>
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
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
