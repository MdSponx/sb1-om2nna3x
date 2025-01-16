import type { MembershipStatus } from './membership';

export type PaymentStatus = 'not paid' | 'pending' | 'paid';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface DirectorApplication {
  id: string;
  fullname_th: string;
  fullname_en?: string;
  email?: string;
  phone?: string;
  occupation: 'director';
  verification_status: VerificationStatus;
  member_status: MembershipStatus;
  payment_status: PaymentStatus;
  profile_image_url?: string;
  id_card_image_url?: string;
  payment_slip_url?: string;
  created_at?: string;
  updated_at?: string;
}