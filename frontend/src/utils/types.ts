export type Status = 'Under Evaluation' | 'Doc Review' | 'Negotiate or Clarification' | 'Re-evaluation' | 'Reject' | 'Awarded' | 'Cancel' | 'Close' | 'Retender' | 'In PPC';
export type Category = 'Goods' | 'Services' | 'Works' | 'Consultancy';
export type CategoryStatus = 'Active' | 'Inactive';
export type DepartmentStatus = 'Active' | 'Inactive';
export type RemarkType = 'Under Evaluation' | 'Doc Review' | 'Negotiate or Clarification' | 'Re-evaluation' | 'Reject' | 'Awarded' | 'Cancel' | 'Close' | 'Retender' | 'In PPC';
export type UserRole = 'Super Admin' | 'Admin' | 'Clerk 1' | 'Clerk 2' | 'Clerk 3';
export type UserStatus = 'Active' | 'Inactive';
export type CommitteeStatus = 'Active' | 'Inactive';
export interface Record {
  id: string;

  // Tender Information
  tenderNumber: string;
  relevantTo: string; // Department (from dropdown)
  category: string; // Category (from dropdown)
  description: string;
  other?: string; // Staff member (from dropdown)

  // Important Dates
  bidStartDate: string;
  bidOpenDate: string;
  bidClosingDate: string;
  approvedDate?: string;
  fileSentToTecDate: string;
  fileSentToTecSecondTime?: string;

  // Bid Bond
  bidBondNumber?: string;
  bidBondBank?: string;
  bidValidityPeriod?: string; // Expire Period
  remark?: RemarkType;
  status: Status;

  // TEC Committee
  tecCommitteeNumber?: string;
  tecChairman: string; // Staff (from dropdown)
  tecMember1: string; // Staff (from dropdown)
  tecMember2: string; // Acc Assistant (from dropdown)
  delay?: number; // Auto-generated after status = Awarded

  // Selected Bidder Details
  awardedTo?: string; // Bidder (from dropdown)
  serviceAgreementStartDate?: string;
  serviceAgreementEndDate?: string;

  // Performance Bond
  performanceBondNumber?: string;
  performanceBondBank?: string;
  performanceBondRemark?: string;
}
export interface Staff {
  id: string;
  name: string;
  email: string;
  area: string;
  designation: string;
}
export interface Bidder {
  id: string;
  name: string;
  email: string;
  address: string;
  contact: string;
}
export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  createdDate: string;
}
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment: string;
  status: DepartmentStatus;
  createdDate: string;
}
export interface BidOpeningCommittee {
  id: string;
  committeeNumber: string;
  member1: string;
  member2: string;
  member3: string;
  additionalMembers?: string[];
  appointedDate: string;
  status: CommitteeStatus;
}
export interface SystemUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  status: UserStatus;
  createdDate: string;
  lastLogin?: string;
}
export interface AuditLog {
  id: string;
  user: string;
  type: string;
  message: string;
  timestamp: string;
  ipAddress: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}
export interface KpiData {
  total: number;
  pending: number;
  approved: number;
  returned: number;
}