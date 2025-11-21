'use client';

import { useEffect, useState } from 'react';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';

export function OrderCountBadge() {
  const firestore = useFirestore();
  const { isAdmin } = useAdminStatus();
  const [processingCount, setProcessingCount] = useState(0);

  useEffect(() => {
    if (!firestore || !isAdmin) return;

    // Listen for orders with "Processing" status
    const processingOrdersQuery = query(
      collectionGroup(firestore, 'orders'),
      where('status', '==', 'Processing')
    );

    const unsubscribe = onSnapshot(
      processingOrdersQuery,
      (snapshot) => {
        setProcessingCount(snapshot.size);
      },
      (error) => {
        // Silently handle index building errors
        if (error.code === 'failed-precondition') {
          console.log('Index for status field is building, badge will be available soon...');
          setProcessingCount(0);
        } else {
          console.error('Error in order count badge:', error);
        }
      }
    );

    return () => unsubscribe();
  }, [firestore, isAdmin]);

  if (!isAdmin || processingCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-bold text-white shadow-lg animate-pulse">
      {processingCount > 9 ? '9+' : processingCount}
    </span>
  );
}
