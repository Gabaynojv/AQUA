'use client';

import { collection, addDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Product } from '@/lib/types';

/**
 * Creates a new product document in Firestore using a non-blocking approach.
 *
 * @param firestore The Firestore instance.
 * @param productData The product data to add. This should not include the 'id'.
 */
export function createProduct(firestore: Firestore, productData: Omit<Product, 'id'>) {
  const productsCollection = collection(firestore, 'products');

  // Use the non-blocking .catch() pattern for error handling.
  // This emits a detailed error for debugging without crashing the app.
  addDoc(productsCollection, productData)
    .catch((error) => {
      console.error("Error creating product: ", error);
      const permissionError = new FirestorePermissionError({
        path: productsCollection.path,
        operation: 'create',
        requestResourceData: productData,
      });
      // Emit the standardized error for the global listener to catch.
      errorEmitter.emit('permission-error', permissionError);
    });
}
