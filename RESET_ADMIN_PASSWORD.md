# Reset Admin Password

## Method 1: Via Firebase Console (Easiest)

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your AquaFlow project

### Step 2: Find the Admin User
1. Click on **Authentication** in the left sidebar
2. Click on **Users** tab
3. Find the user with email `admin@aquaflow.com`

### Step 3: Reset Password
1. Click on the three dots (⋮) next to the admin user
2. Select **Reset password**
3. Firebase will send a password reset email to `admin@aquaflow.com`
4. Check your email and follow the reset link

### Step 4: Set New Password
1. Click the link in the email
2. Enter your new password
3. Confirm the password

### Step 5: Login
1. Go to `http://localhost:9002/login`
2. Login with `admin@aquaflow.com` and your new password

---

## Method 2: Delete and Recreate (Alternative)

If you want to start fresh:

### Step 1: Delete Existing Admin User
1. Go to Firebase Console → Authentication → Users
2. Find `admin@aquaflow.com`
3. Click the three dots (⋮) and select **Delete user**
4. Confirm deletion

### Step 2: Delete Firestore Documents
1. Go to Firebase Console → Firestore Database
2. Delete the user document in `users` collection (find by email)
3. Delete the admin role document in `roles_admin` collection

### Step 3: Create New Admin Account
1. Go to `http://localhost:9002/signup`
2. Sign up with `admin@aquaflow.com` and new password
3. Done!

---

## Method 3: Change Password via Firebase Console

### Step 1: Open Firebase Console
1. Go to Firebase Console → Authentication → Users
2. Find `admin@aquaflow.com`

### Step 2: Edit User
1. Click on the user email to open details
2. Look for password section
3. Click **Reset password** or use the action menu

### Step 3: Set New Password Manually
Some Firebase projects allow you to set a password directly:
1. Click on the user
2. Look for "Set password" option
3. Enter new password
4. Save

---

## Quick Fix: Use Password Reset in App

If you have access to the email `admin@aquaflow.com`:

1. Go to `http://localhost:9002/login`
2. Click "Forgot your password?" link
3. Enter `admin@aquaflow.com`
4. Check email for reset link
5. Set new password
6. Login

---

## Verify Admin Access After Login

After logging in, verify:
- [ ] "Admin" button appears in header
- [ ] Can access `/admin` dashboard
- [ ] Can access `/admin/orders` page
- [ ] Can manage orders

---

## Need Help?

If you're still having issues:
1. Check Firebase Console for any errors
2. Verify the user exists in Authentication
3. Check Firestore for `roles_admin` document
4. Clear browser cache and try again
