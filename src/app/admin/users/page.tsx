"use client";

import { useMemo, useState } from 'react';
import { collection, doc, query, orderBy } from 'firebase/firestore';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader, Users } from 'lucide-react';
import { useCollection as useCollectionHook } from '@/firebase';

function UserOrders({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const ordersQuery = useMemo(() => {
    if (!firestore || !userId) return null;
    return query(collection(firestore, `users/${userId}/orders`), orderBy('orderDate', 'desc'));
  }, [firestore, userId]);

  const { data: orders, isLoading } = useCollection(ordersQuery) as any;

  if (isLoading) return <div className="p-4"><Loader className="h-5 w-5 animate-spin" /></div>;
  if (!orders) return <p className="p-4 text-sm text-muted-foreground">No orders for this user.</p>;

  return (
    <div className="space-y-2 p-2">
      {orders.map((order: any) => (
        <div key={order.id} className="flex justify-between text-sm">
          <div>
            <div className="font-medium">#{order.id.substring(0,7)}</div>
            <div className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleString()}</div>
          </div>
          <div className="text-right font-medium">₱{order.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const firestore = useFirestore();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const usersQuery = useMemo(() => {
    if (!firestore || isAdminLoading || !isAdmin) return null;
    return query(collection(firestore, 'users'), orderBy('dateJoined', 'desc'));
  }, [firestore, isAdmin, isAdminLoading]);

  const { data: users, isLoading } = useCollection(usersQuery) as any;

  // Calculate stats before any returns
  const totalCustomers = users?.length || 0;

  if (isAdminLoading) return (
    <div className="flex items-center justify-center h-40">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  
  if (!isAdmin) return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-destructive/5 to-red-500/5">
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>Admin privileges required to view users.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Ensure your account has a roles_admin document in Firestore.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
          Customers Management
        </h1>
        <p className="text-muted-foreground">View and manage customer accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="border-2 shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
              {isLoading ? '...' : totalCustomers}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardTitle className="text-2xl">All Customers</CardTitle>
          <CardDescription>View customer profiles and order history</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && (!users || users.length === 0) && (
            <div className="text-center py-10 text-sm text-muted-foreground">No users found.</div>
          )}
          {!isLoading && users && users.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{u.firstName} {u.lastName}</TableCell>
                    <TableCell className="font-mono text-xs">{u.email}</TableCell>
                    <TableCell>{new Date(u.dateJoined).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedUser(u)} className="hover:bg-primary hover:text-white transition-colors">
                        View Orders
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Orders for {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
            <DialogDescription className="text-sm">User ID: {selectedUser?.id}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && <UserOrders userId={selectedUser.id} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
