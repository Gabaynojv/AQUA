'use client';

import { LayoutDashboard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Manage your AquaFlow business</p>
      </div>
      
      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            Welcome, Admin!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            This is your command center. Manage orders, products, and customers from the sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Quick Actions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View and manage customer orders</li>
                <li>• Update order statuses</li>
                <li>• Monitor business metrics</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Getting Started</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Select "Orders" to view all orders</li>
                <li>• Use the sidebar to navigate</li>
                <li>• Check user management section</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
