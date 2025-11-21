/**
 * Admin Account Creation Script for AquaFlow
 * 
 * This script creates an admin account with proper Firestore documents.
 * Requires Firebase Admin SDK.
 * 
 * Usage:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Save as scripts/serviceAccountKey.json
 * 4. Run: node scripts/create-admin.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdminAccount() {
  console.log('\n🔧 AquaFlow Admin Account Creator\n');
  console.log('This script will create an admin account in Firebase.\n');

  try {
    // Check if service account key exists
    let serviceAccount;
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (error) {
      console.error('❌ Error: serviceAccountKey.json not found!');
      console.log('\nPlease follow these steps:');
      console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('2. Click "Generate New Private Key"');
      console.log('3. Save the file as scripts/serviceAccountKey.json');
      console.log('4. Run this script again\n');
      process.exit(1);
    }

    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    const auth = admin.auth();

    // Get admin details from user
    const email = await prompt('Enter admin email (default: admin@aquaflow.com): ') || 'admin@aquaflow.com';
    const password = await prompt('Enter admin password (min 6 characters): ');
    
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      rl.close();
      process.exit(1);
    }

    const firstName = await prompt('Enter first name (default: Admin): ') || 'Admin';
    const lastName = await prompt('Enter last name (default: AquaFlow): ') || 'AquaFlow';

    console.log('\n⏳ Creating admin account...\n');

    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`ℹ️  User with email ${email} already exists (UID: ${userRecord.uid})`);
      const proceed = await prompt('Do you want to update this user to admin? (yes/no): ');
      if (proceed.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        rl.close();
        process.exit(0);
      }
    } catch (error) {
      // User doesn't exist, create new one
      userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`
      });
      console.log('✅ User created in Firebase Authentication');
      console.log(`   UID: ${userRecord.uid}`);
    }

    // Create/update user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      dateJoined: new Date().toISOString()
    }, { merge: true });

    console.log('✅ User document created/updated in Firestore');

    // Create admin role document
    await db.collection('roles_admin').doc(userRecord.uid).set({
      uid: userRecord.uid,
      createdAt: new Date().toISOString()
    }, { merge: true });

    console.log('✅ Admin role assigned in Firestore');

    console.log('\n🎉 Admin account created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('Admin Account Details:');
    console.log('═══════════════════════════════════════');
    console.log(`Email:      ${email}`);
    console.log(`Name:       ${firstName} ${lastName}`);
    console.log(`UID:        ${userRecord.uid}`);
    console.log('═══════════════════════════════════════\n');
    console.log('You can now login at: http://localhost:9002/login\n');

  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Run the script
createAdminAccount();
