# 🚀 Quick Admin Setup - AquaFlow

## Easiest Method: Use Signup Page

### Step 1: Open Signup Page
```
http://localhost:9002/signup
```

### Step 2: Fill in the Form
- **Email**: `admin@aquaflow.com`
- **Password**: Your secure password (min 6 characters)
- **First Name**: Admin
- **Last Name**: AquaFlow

### Step 3: Click "Create an account"

### Step 4: Done! ✅
- You'll be automatically redirected to `/admin`
- The system creates the admin role automatically
- You can now manage orders and users

---

## Verify Admin Access

After signup, you should see:
- ✅ "Admin" button in the header
- ✅ Access to `/admin` dashboard
- ✅ Access to `/admin/orders` page
- ✅ Access to `/admin/users` page

---

## Default Admin Credentials

**Email**: `admin@aquaflow.com`  
**Password**: Set during signup

---

## Change Admin Email (Optional)

If you want to use a different email:

1. Edit `src/firebase/provider.tsx` (line 52):
```typescript
const ADMIN_EMAIL = 'your-email@domain.com';
```

2. Edit `src/app/signup/page.tsx` (line 25):
```typescript
const ADMIN_EMAIL = 'your-email@domain.com';
```

3. Restart the dev server

---

## Troubleshooting

### Can't see Admin button?
1. Make sure you signed up with `admin@aquaflow.com`
2. Logout and login again
3. Check browser console for errors

### Access Denied on admin pages?
1. Check Firestore for `roles_admin` collection
2. Verify document exists with your user UID
3. Clear browser cache

---

## Need More Help?

See `ADMIN_SETUP_GUIDE.md` for detailed instructions and alternative methods.
