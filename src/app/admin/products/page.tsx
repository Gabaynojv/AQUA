'use client';

import { useState, useMemo } from 'react';
import { collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Loader, Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  stock?: number;
  category?: string;
}

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageId: '',
    stock: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productsQuery = useMemo(() => {
    if (!firestore || isAdminLoading || !isAdmin) return null;
    return query(collection(firestore, 'products'), orderBy('name', 'asc'));
  }, [firestore, isAdmin, isAdminLoading]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        imageId: product.imageId || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        imageId: '',
        stock: '',
        category: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageId: '',
      stock: '',
      category: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    setIsSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageId: formData.imageId || 'product-1',
        stock: formData.stock ? parseInt(formData.stock) : 100,
        category: formData.category || 'Water',
      };

      if (editingProduct) {
        // Update existing product
        await updateDoc(doc(firestore, 'products', editingProduct.id), productData);
        toast({
          title: 'Product Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create new product
        await addDoc(collection(firestore, 'products'), {
          ...productData,
          createdAt: new Date().toISOString(),
        });
        toast({
          title: 'Product Created',
          description: `${formData.name} has been added successfully.`,
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!firestore) return;
    
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await deleteDoc(doc(firestore, 'products', product.id));
      toast({
        title: 'Product Deleted',
        description: `${product.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
      });
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
          <CardDescription>You must be an admin to manage products.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
            Products Management
          </h1>
          <p className="text-muted-foreground">Manage your water products catalog</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardTitle className="text-2xl">All Products</CardTitle>
          <CardDescription>View and manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && (!products || products.length === 0) && (
            <div className="text-center py-10">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first product</p>
              <Button onClick={() => handleOpenDialog()} className="premium-gradient text-white border-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          )}

          {!isLoading && products && products.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{product.category || 'Water'}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ₱{product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock && product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                          {product.stock || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 5 Gallon Water Jug"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Water, Dispenser"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageId">Image ID</Label>
                <Input
                  id="imageId"
                  value={formData.imageId}
                  onChange={(e) => setFormData({ ...formData, imageId: e.target.value })}
                  placeholder="product-1"
                />
                <p className="text-xs text-muted-foreground">
                  Use: product-1, product-2, product-3, or product-4
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="premium-gradient text-white border-0"
              >
                {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
