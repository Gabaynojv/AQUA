# Admin Account Setup Guide for AquaFlow

## 📋 Overview

Your AquaFlow project is configured to use **admin@aquaflow.com** as the admin account. This guide will help you create and configure the admin account.

## 🔐 Current Admin Configuration

**Admin Email**: `admin@aquaflow.com`

This email is hardcoded in:
- `src/firebase/provider.tsx` (line 52)
- `src/app/signup/page.tsx` (line 25)

## 🚀 Method 1: Create Admin Account via Signup Page (Recommended)

### Step 1: Access Signup Page
1. Open your browser and go to: `http://localhost:9002/signup`

### Step 2: Create Admin Account
Fill in the signup form with:
- **First Name**: Admin
- **Last Name**: AquaFlow
- **Email**: `admin@aquaflow.com`
- **Password**: Choose a strong password (minimum 6 characters)

### Step 3: Sign Up
Click "Create an account" button

### Step 4: Automatic Admin Role Assignment
The system will automatically:
- Create the user account in Firebase Authentication
- Create a user document in Firestore `users` collection
- Create an admin role document in Firestore `roles_admin` collection
- Redirect you to `/admin` dashboard

### Step 5: Verify Admin Access
- You should see the "Admin" button in the header
- You can access `/admin` and `/admin/orders` pages
- You can manage all customer orders

---

## 🛠️ Method 2: Create Admin Account via Firebase Console

If you prefer to create the admin account directly in Firebase:

### Step 1: Create User in Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your AquaFlow project
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Enter:
   - Email: `admin@aquaflow.com`
   - Password: Your chosen password
6. Click **Add User**
7. Copy the **User UID** (you'll need this)

### Step 2: Create User Document in Firestore
1. In Firebase Console, go to **Firestore Database**
2. Navigate to the `users` collection
3. Click **Add Document**
4. Set Document ID to the **User UID** from Step 1
5. Add fields:
   ```
   id: [User UID]
   email: admin@aquaflow.com
   firstName: Admin
   lastName: AquaFlow
   dateJoined: [Current timestamp]
   ```
6. Click **Save**

### Step 3: Create Admin Role Document
1. In Firestore Database, create/navigate to `roles_admin` collection
2. Click **Add Document**
3. Set Document ID to the **User UID**
4. Add field:
   ```
   uid: [User UID]
   ```
5. Click **Save**

### Step 4: Login
1. Go to `http://localhost:9002/login`
2. Login with `admin@aquaflow.com` and your password
3. You should be redirected to `/admin` dashboard

---

## 🔧 Method 3: Using Firebase Admin SDK (For Production)

If you want to create admin accounts programmatically:

### Create a Script: `scripts/create-admin.js`

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdmin(email, password, firstName, lastName) {
  try {
    // Create user in Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: `${firstName} ${lastName}`
    });

    console.log('✅ User created:', userRecord.uid);

    // Create user document
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      dateJoined: new Date().toISOString()
    });

    console.log('✅ User document created');

    // Create admin role document
    await db.collection('roles_admin').doc(userRecord.uid).set({
      uid: userRecord.uid
    });

    console.log('✅ Admin role assigned');
    console.log('🎉 Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`UID: ${userRecord.uid}`);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

// Create admin account
createAdmin(
  'admin@aquaflow.com',
  'YourSecurePassword123!',
  'Admin',
  'AquaFlow'
);
```

### Run the Script:
```bash
node scripts/create-admin.js
```

---

## 🔒 Security Best Practices

### 1. Change Default Admin Email (Optional)
If you want to use a different email:

**Update in `src/firebase/provider.tsx`:**
```typescript
const ADMIN_EMAIL = 'your-admin@yourdomain.com';
```

**Update in `src/app/signup/page.tsx`:**
```typescript
const ADMIN_EMAIL = 'your-admin@yourdomain.com';
```

### 2. Use Strong Password
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Don't use common words or patterns

### 3. Enable Two-Factor Authentication
In Firebase Console:
1. Go to Authentication → Sign-in method
2. Enable Multi-factor authentication
3. Configure for your admin account

### 4. Firestore Security Rules
Ensure your `firestore.rules` includes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin role check function
    function isAdmin() {
      return exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
    }
    
    // Only admins can read/write roles_admin collection
    match /roles_admin/{uid} {
      allow read, write: if isAdmin();
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || isAdmin();
    }
    
    // Orders - users can read their own, admins can read all
    match /users/{userId}/orders/{orderId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if request.auth.uid == userId;
      allow update: if isAdmin(); // Admins can update order status
      
      match /orderItems/{itemId} {
        allow read: if request.auth.uid == userId || isAdmin();
        allow write: if request.auth.uid == userId;
      }
    }
  }
}
```

---

## ✅ Verification Checklist

After creating the admin account, verify:

- [ ] Can login with admin credentials
- [ ] "Admin" button appears in header after login
- [ ] Can access `/admin` dashboard
- [ ] Can access `/admin/orders` page
- [ ] Can view all customer orders
- [ ] Can update order statuses (Ship, Deliver, Cancel)
- [ ] Can access `/admin/users` page
- [ ] Regular users don't see "Admin" button

---

## 🐛 Troubleshooting

### Issue: "Access Denied" on Admin Pages

**Solution:**
1. Check if `roles_admin/{uid}` document exists in Firestore
2. Verify the document ID matches your user UID
3. Logout and login again

### Issue: Admin Button Not Showing

**Solution:**
1. Check browser console for errors
2. Verify you're logged in with `admin@aquaflow.com`
3. Clear browser cache and reload
4. Check `useAdminStatus` hook is working

### Issue: Can't Create Admin Account

**Solution:**
1. Check Firebase Authentication is enabled
2. Verify Email/Password sign-in method is enabled
3. Check Firebase project configuration
4. Review browser console for errors

---

## 📞 Quick Reference

### Admin Credentials (Default)
- **Email**: `admin@aquaflow.com`
- **Password**: Set during signup

### Admin Pages
- Dashboard: `/admin`
- Orders Management: `/admin/orders`
- Users Management: `/admin/users`

### Firestore Collections
- Users: `users/{uid}`
- Admin Roles: `roles_admin/{uid}`
- Orders: `users/{uid}/orders/{orderId}`

---

## 🎯 Next Steps

1. Create your admin account using Method 1 (Signup Page)
2. Login and verify admin access
3. Test order management features
4. Set up Firestore security rules
5. Configure production environment variables

---

**Need Help?** Check the troubleshooting section or review the Firebase Console for any errors.
