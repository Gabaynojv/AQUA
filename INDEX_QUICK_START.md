# ⚡ Create Indexes - 5 Minutes

## 📍 Where to Go

**Website**: https://console.firebase.google.com/

**Path**: Your Project → Firestore Database → Indexes tab

---

## 📝 What to Create

### Index #1
```
Collection ID:    orders
Query scope:      Collection group
Field path:       orderDate
Query scope:      Descending
```
**Click "Create"**

---

### Index #2
```
Collection ID:    orders
Query scope:      Collection group
Field path:       status
Query scope:      Ascending
```
**Click "Create"**

---

## ⏱️ Wait

Both will show "Building..." → Wait 1-2 minutes → Will show "Enabled ✅"

---

## ✅ Done!

Refresh your app (Ctrl + Shift + R) and everything works!

---

## 🎯 Visual Guide

```
Step 1: Go to Firebase Console
        ↓
Step 2: Click "Firestore Database"
        ↓
Step 3: Click "Indexes" tab
        ↓
Step 4: Click "Create Index" button
        ↓
Step 5: Fill form for Index #1 (orderDate)
        ↓
Step 6: Click "Create"
        ↓
Step 7: Click "Create Index" button again
        ↓
Step 8: Fill form for Index #2 (status)
        ↓
Step 9: Click "Create"
        ↓
Step 10: Wait for both to show "Enabled"
        ↓
Step 11: Refresh your app
        ↓
        🎉 DONE!
```

---

## ⚠️ Remember

- Select **"Collection group"** (not "Collection")
- Type field names exactly: `orderDate` and `status`
- Wait for BOTH to finish building
- Then refresh your app

---

**That's all you need to do!** 🚀
