'use client';

import { useFirestore, useUser, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import React from 'react';

interface AdminStatusResult {
  isAdmin: boolean;
  isAdminLoading: boolean;
}

/**
 * Custom hook to check if the currently authenticated user is an admin.
 * @returns {AdminStatusResult} An object containing the admin status and loading state.
 */
export function useAdminStatus(): AdminStatusResult {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const adminRoleRef = React.useMemo(() => {
    if (isUserLoading || !user) {
      return null;
    }
    return doc(firestore, 'roles_admin', user.uid);
  }, [user, firestore, isUserLoading]);

  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminRoleRef);
  
  const isAdminLoading = isUserLoading || isAdminDocLoading;
  const isAdmin = !isAdminLoading && !!user && !!adminDoc;

  return { isAdmin, isAdminLoading };
}
