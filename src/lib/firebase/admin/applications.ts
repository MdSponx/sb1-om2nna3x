import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { verifyAdminPermissions } from '../permissions/admin';
import type { ApplicationStatus, PaymentStatus } from '../../../types/application';

export async function updateApplicationStatus(
  db: Firestore,
  userId: string,
  applicationId: string,
  updates: Partial<{
    member_status: string;
    payment_status: PaymentStatus;
    verification_status: ApplicationStatus;
  }>
) {
  // Verify admin permissions before proceeding
  const isAdmin = await verifyAdminPermissions(userId);
  if (!isAdmin) {
    throw new Error('permission-denied');
  }

  return updateDoc(doc(db, 'users', applicationId), {
    ...updates,
    updated_at: serverTimestamp(),
    updated_by: userId
  });
}