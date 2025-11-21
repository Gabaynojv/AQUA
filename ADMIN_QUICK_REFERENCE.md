# 🎯 Admin Quick Reference - AquaFlow

## 📋 Admin Account Info

**Default Admin Email**: `admin@aquaflow.com`  
**Password**: Set during signup

---

## 🚀 Create Admin Account (3 Steps)

### Step 1: Navigate to Signup
```
http://localhost:9002/signup
```

### Step 2: Fill Form
```
Email:      admin@aquaflow.com
Password:   [Your secure password]
First Name: Admin
Last Name:  AquaFlow
```

### Step 3: Click "Create an account"
✅ Done! You're now an admin.

---

## 🎛️ Admin Dashboard Access

After login, you can access:

| Page | URL | Description |
|------|-----|-------------|
| **Admin Dashboard** | `/admin` | Overview and quick actions |
| **Orders Management** | `/admin/orders` | View and manage all orders |
| **Users Management** | `/admin/users` | View all customers |

---

## 📦 Order Management

### Order Statuses
1. **Processing** (Blue) - Order received
2. **Out for Delivery** (Yellow) - Order shipped
3. **Delivered** (Green) - Order completed
4. **Cancelled** (Red) - Order cancelled

### Admin Actions
- **View** - See order details
- **Ship** - Mark as "Out for Delivery"
- **Deliver** - Mark as "Delivered"
- **Cancel** - Cancel the order

---

## 🔍 What Admins Can Do

✅ View all customer orders  
✅ Update order statuses  
✅ View customer information  
✅ Track order analytics  
✅ Cancel orders  
✅ View order details and items  
✅ See delivery information  

---

## 🔐 Admin Verification

After creating admin account, verify:

- [ ] "Admin" button appears in header
- [ ] Can access `/admin` page
- [ ] Can access `/admin/orders` page
- [ ] Can see all customer orders
- [ ] Can update order statuses
- [ ] Can view order details

---

## 🛠️ Firestore Structure

### Collections Created for Admin:

```
roles_admin/
  └── {uid}
      └── uid: string

users/
  └── {uid}
      ├── id: string
      ├── email: string
      ├── firstName: string
      ├── lastName: string
      └── dateJoined: string

users/{uid}/orders/
  └── {orderId}
      ├── id: string
      ├── userId: string
      ├── status: string
      ├── totalAmount: number
      ├── trackingNumber: string
      └── ... (other order fields)
```

---

## 🔄 Change Admin Email

To use a different admin email:

1. **Edit** `src/firebase/provider.tsx` (line 52):
```typescript
const ADMIN_EMAIL = 'your-email@domain.com';
```

2. **Edit** `src/app/signup/page.tsx` (line 25):
```typescript
const ADMIN_EMAIL = 'your-email@domain.com';
```

3. **Restart** dev server:
```bash
npm run dev
```

---

## ⚠️ Troubleshooting

### Problem: Can't see Admin button
**Solution**: 
- Verify you signed up with `admin@aquaflow.com`
- Logout and login again
- Check browser console for errors

### Problem: Access Denied on admin pages
**Solution**:
- Check Firestore `roles_admin` collection exists
- Verify document with your UID exists
- Clear browser cache and cookies

### Problem: Orders not showing
**Solution**:
- Ensure customers have placed orders
- Check Firestore security rules
- Verify admin role document exists

---

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Kill port 9002 (if in use)
taskkill /F /IM node.exe
```

---

## 🎯 Testing Checklist

- [ ] Create admin account via signup
- [ ] Login with admin credentials
- [ ] Verify "Admin" button in header
- [ ] Access admin dashboard
- [ ] View orders page
- [ ] Update an order status
- [ ] View order details
- [ ] Check users page
- [ ] Logout and login again

---

## 📚 More Information

- **Detailed Guide**: `ADMIN_SETUP_GUIDE.md`
- **Quick Setup**: `QUICK_ADMIN_SETUP.md`
- **Project README**: `README.md`
- **Improvements**: `IMPROVEMENTS.md`

---

**Need Help?** Check the documentation files or Firebase Console for errors.
