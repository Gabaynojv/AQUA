# 🔥 Deploy Firestore Rules - Fix Permission Error

## 🔴 The Problem

Your Firestore Security Rules need to be deployed/updated in Firebase Console.

---

## ✅ Solution: Deploy Rules via Firebase Console

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Select your **AquaFlow** project

### Step 2: Navigate to Firestore Rules
1. Click **Firestore Database** in left sidebar
2. Click the **Rules** tab at the top
3. You should see the rules editor

### Step 3: Copy and Paste These Rules

**Delete everything** in the rules editor and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/roles_admin/$(request.auth.uid));
    }

    // Users collection
    match /users/{userId} {
      allow get: if isOwner(userId) || isAdmin();
      allow list: if isAdmin();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }

    // User addresses
    match /users/{userId}/addresses/{addressId} {
      allow get, list: if isOwner(userId) || isAdmin();
      allow create, update, delete: if isOwner(userId);
    }

    // Products collection
    match /products/{productId} {
      allow get, list: if true;
      allow create, update, delete: if isAdmin();
    }

    // Orders collection
    match /users/{userId}/orders/{orderId} {
      allow get: if isOwner(userId) || isAdmin();
      allow list: if isOwner(userId);
      allow create: if isOwner(userId) && request.resource.data.userId == userId;
      allow update, delete: if isOwner(userId) || isAdmin();

      // Order items subcollection
      match /orderItems/{orderItemId} {
        allow get, list: if isOwner(userId) || isAdmin();
        allow create, update, delete: if isOwner(userId);
      }
    }
    
    // Allow admins to query all orders (collection group query)
    match /{path=**}/orders/{orderId} {
      allow list: if isAdmin();
    }

    // Delivery routes
    match /deliveryRoutes/{deliveryRouteId} {
      allow get, list, create, update, delete: if isAdmin();
    }

    // Admin roles collection
    match /roles_admin/{userId} {
      allow get: if isSignedIn();
      allow list, delete: if isAdmin();
      allow create, update: if request.auth.uid == userId;
    }
  }
}
```

### Step 4: Publish the Rules
1. Click the **"Publish"** button (top right)
2. Wait for confirmation message
3. You should see a green checkmark ✅

### Step 5: Verify Admin Role Document Exists

Before testing, make sure:

1. Click the **"Data"** tab (next to Rules)
2. Look for `roles_admin` collection
3. Verify document exists with ID: `jcpsrpoWYgOGFrHcqtTZTpejzKs1`
4. Verify it has field: `uid` = `jcpsrpoWYgOGFrHcqtTZTpejzKs1`

**If the document doesn't exist**, create it:
- Collection: `roles_admin`
- Document ID: `jcpsrpoWYgOGFrHcqtTZTpejzKs1`
- Field: `uid` (string) = `jcpsrpoWYgOGFrHcqtTZTpejzKs1`

### Step 6: Test Your App
1. Go back to your app: `http://localhost:9002`
2. **Hard refresh**: Press `Ctrl + Shift + R`
3. **Logout** if logged in
4. **Login** again with `admin@aquaflow.com`
5. You should now see the **"Admin"** button!

---

## 🎯 Alternative: Temporary Open Rules (Testing Only)

If you want to test quickly while debugging:

### ⚠️ WARNING: Only for local development!

Replace rules with these **TEMPORARY** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Remember to revert to secure rules after testing!**

---

## 🔧 Install Firebase CLI (Optional - For Future)

To deploy rules from command line in the future:

### Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Login to Firebase:
```bash
firebase login
```

### Initialize Firebase (if needed):
```bash
firebase init firestore
```

### Deploy Rules:
```bash
firebase deploy --only firestore:rules
```

---

## ✅ Verification Checklist

After deploying rules:

- [ ] Rules published in Firebase Console (green checkmark)
- [ ] `roles_admin` collection exists
- [ ] Admin document exists with your UID
- [ ] Hard refreshed browser
- [ ] Logged out and logged in again
- [ ] "Admin" button appears in header
- [ ] Can access `/admin` page
- [ ] Can access `/admin/orders` page
- [ ] No permission errors in console

---

## 🐛 Still Getting Errors?

### Check Rules Syntax
1. Firebase Console → Firestore → Rules
2. Look for any red error indicators
3. Make sure rules are published (green checkmark)

### Check Admin Document
1. Firestore → Data tab
2. Navigate to `roles_admin` collection
3. Verify document ID matches your user UID exactly
4. Verify field `uid` has correct value

### Clear Everything and Retry
1. Clear browser cache (Ctrl + Shift + Delete)
2. Logout from app
3. Close browser completely
4. Reopen browser
5. Go to app and login again

---

## 📞 Quick Summary

1. ✅ Go to Firebase Console
2. ✅ Firestore Database → Rules tab
3. ✅ Copy and paste the rules above
4. ✅ Click "Publish"
5. ✅ Verify admin document exists in Data tab
6. ✅ Refresh app and login again
7. ✅ Admin access should work!

---

**This should fix your permission errors!** 🚀
