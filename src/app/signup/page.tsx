'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUserWithEmailAndPassword, User, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, useFirestore } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

const ADMIN_EMAIL = 'admin@aquaflow.com';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!firstName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "First name is required.",
      });
      return;
    }
    
    if (!lastName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Last name is required.",
      });
      return;
    }
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Email is required.",
      });
      return;
    }
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password is required.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }
    
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Firebase services are not initialized. Please refresh the page and try again.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore from the client
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: user.email!,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateJoined: new Date().toISOString(),
      };
      await setDoc(userRef, userData, { merge: true });

      // If the user is the admin, create the admin role document
      if (user.email === ADMIN_EMAIL) {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        await setDoc(adminRoleRef, { uid: user.uid }, { merge: true });
        router.push('/admin/orders');
      } else {
        router.push('/');
      }
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = "Could not create account. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email and password sign up is currently disabled.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Firebase authentication is not initialized. Please refresh the page and try again.",
      });
      return;
    }
    setIsGoogleSubmitting(true);
    try {
      // We don't await here because redirection is handled by the onAuthStateChanged listener
      // in the main provider, which will also handle the admin check.
      initiateGoogleSignIn(auth);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Could not sign in with Google. Please try again.",
      });
      setIsGoogleSubmitting(false);
    }
  };

  const resetAdminPassword = async () => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, ADMIN_EMAIL);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-cyan-500/5 p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="hover:scale-105 transition-transform inline-block">
          <Logo />
        </Link>
      </div>
      
      <Card className="mx-auto max-w-md w-full border-2 shadow-2xl backdrop-blur-sm bg-background/95 animate-scale-in relative z-10">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Enter your information to get started with AquaFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting || !auth || !firestore}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting || !auth || !firestore}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || !auth || !firestore}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting || !auth || !firestore}
                  minLength={6}
                  title="Password must be at least 6 characters"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full premium-gradient text-white border-0 hover:shadow-lg transition-all duration-300 hover:scale-105" 
                disabled={isSubmitting || !auth || !firestore}
              >
                {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating account..." : "Create an account"}
              </Button>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-2 hover:bg-primary/5 hover:border-primary transition-all" 
            onClick={handleGoogleSignIn} 
            disabled={isGoogleSubmitting || !auth}
          >
            {isGoogleSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleSubmitting ? "Signing in..." : "Sign up with Google"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
