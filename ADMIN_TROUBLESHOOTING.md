# Admin Account Troubleshooting

## ✅ Your Current Situation

**Error**: `Firebase: Error (auth/email-already-in-use)`

**What this means**: The admin account `admin@aquaflow.com` already exists in Firebase Authentication!

**Good news**: Your admin account is already created. You just need to login.

---

## 🔐 Solution: Login with Existing Account

### Step 1: Go to Login Page
```
http://localhost:9002/login
```

### Step 2: Enter Credentials
- **Email**: `admin@aquaflow.com`
- **Password**: [The password you used when creating the account]

### Step 3: Click "Login"

You should be redirected to the admin dashboard!

---

## ❓ Don't Remember the Password?

### Option A: Password Reset via Email

1. Go to `http://localhost:9002/login`
2. Click **"Forgot your password?"** link
3. Enter `admin@aquaflow.com`
4. Check your email for reset link
5. Set new password
6. Login

### Option B: Reset via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find `admin@aquaflow.com`
5. Click the three dots (⋮) → **Reset password**
6. Check email for reset link

### Option C: Delete and Recreate

If you want to start fresh:

**Step 1: Delete from Firebase Console**
1. Firebase Console → Authentication → Users
2. Find `admin@aquaflow.com`
3. Click three dots (⋮) → Delete user

**Step 2: Delete Firestore Documents**
1. Firebase Console → Firestore Database
2. Find and delete in `users` collection (search by email)
3. Find and delete in `roles_admin` collection

**Step 3: Create New Account**
1. Go to `http://localhost:9002/signup`
2. Sign up with `admin@aquaflow.com` and new password

---

## 🔍 Verify Admin Role is Set

After logging in, check if you have admin access:

### What You Should See:
- ✅ "Admin" button in the header (top right)
- ✅ Can access `/admin` page
- ✅ Can access `/admin/orders` page
- ✅ Can see all customer orders

### If You DON'T See Admin Button:

The admin role might not be set in Firestore. Here's how to fix it:

**Method 1: Via Firebase Console**

1. Go to Firebase Console → Firestore Database
2. Check if `roles_admin` collection exists
3. Look for a document with your user UID
4. If missing, create it:
   - Collection: `roles_admin`
   - Document ID: [Your User UID]
   - Field: `uid` (string) = [Your User UID]

**Method 2: Automatic (Login Again)**

The system should automatically create the admin role when you login with `admin@aquaflow.com`. Try:
1. Logout
2. Login again
3. Check if admin button appears

---

## 🔧 Find Your User UID

Need to find your user UID for Firestore?

1. Go to Firebase Console → Authentication → Users
2. Find `admin@aquaflow.com`
3. Click on the email
4. Copy the **User UID** (long string like: `abc123def456...`)

---

## 📋 Complete Verification Checklist

- [ ] Admin account exists in Firebase Authentication
- [ ] Can login with `admin@aquaflow.com`
- [ ] User document exists in Firestore `users` collection
- [ ] Admin role document exists in Firestore `roles_admin` collection
- [ ] "Admin" button appears in header after login
- [ ] Can access `/admin` dashboard
- [ ] Can access `/admin/orders` page
- [ ] Can view and manage orders

---

## 🐛 Common Issues & Solutions

### Issue 1: Can Login but No Admin Button

**Cause**: Admin role not set in Firestore

**Solution**:
1. Check Firestore `roles_admin` collection
2. Create document with your user UID if missing
3. Logout and login again

### Issue 2: "Access Denied" on Admin Pages

**Cause**: Admin role document missing or incorrect

**Solution**:
1. Verify `roles_admin/{uid}` document exists
2. Check document ID matches your user UID
3. Ensure field `uid` contains your user UID

### Issue 3: Can't Login at All

**Cause**: Wrong password or account issue

**Solution**:
1. Use password reset feature
2. Check Firebase Console for account status
3. Verify email is correct: `admin@aquaflow.com`

---

## 🆘 Still Having Issues?

### Check Firebase Console Logs
1. Firebase Console → Authentication → Users
2. Verify `admin@aquaflow.com` exists
3. Check user status (enabled/disabled)

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any error messages
4. Share errors for troubleshooting

### Check Firestore Data
1. Firebase Console → Firestore Database
2. Verify these collections exist:
   - `users`
   - `roles_admin`
3. Check documents are properly structured

---

## 📞 Quick Commands

```bash
# Restart dev server
npm run dev

# Check for TypeScript errors
npm run typecheck

# Clear browser cache
Ctrl + Shift + Delete (Chrome/Edge)
Cmd + Shift + Delete (Mac)
```

---

## ✅ Success Indicators

You'll know everything is working when:
1. ✅ You can login with `admin@aquaflow.com`
2. ✅ "Admin" button appears in header
3. ✅ You can access admin pages
4. ✅ You can see and manage orders
5. ✅ No console errors

---

**Next Step**: Try logging in at `http://localhost:9002/login` with your existing credentials!
