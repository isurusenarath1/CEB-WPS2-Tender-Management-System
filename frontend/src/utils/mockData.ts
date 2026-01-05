import { Record, Staff, Bidder, CategoryItem, Department, SystemUser, AuditLog, BidOpeningCommittee } from './types';
export const mockRecords: Record[] = [{
  id: '1',
  tenderNumber: 'TEC-2023-001',
  relevantTo: 'IT Department',
  category: 'Goods',
  description: 'Procurement of 50 High-Performance Laptops for Development Team',
  other: 'Mr. S. Silva',
  bidStartDate: '2023-09-25',
  bidOpenDate: '2023-10-01',
  bidClosingDate: '2023-10-15',
  fileSentToTecDate: '2023-10-16',
  bidBondNumber: 'BB-2023-001',
  bidBondBank: 'Bank of Ceylon',
  bidValidityPeriod: '2024-01-15',
  remark: 'Under Evacuation',
  status: 'Under Evacuation',
  tecChairman: 'Dr. A. Perera',
  tecMember1: 'Mr. S. Silva',
  tecMember2: 'Ms. K. Fernando'
}, {
  id: '2',
  tenderNumber: 'TEC-2023-002',
  relevantTo: 'Infrastructure',
  category: 'Works',
  description: 'Renovation of 3rd Floor Conference Room',
  bidStartDate: '2023-09-01',
  bidOpenDate: '2023-09-10',
  bidClosingDate: '2023-09-30',
  approvedDate: '2023-10-25',
  fileSentToTecDate: '2023-10-01',
  fileSentToTecSecondTime: '2023-10-15',
  bidBondNumber: 'BB-2023-002',
  bidBondBank: 'Commercial Bank',
  bidValidityPeriod: '2024-02-28',
  remark: 'Awarded',
  status: 'Awarded',
  tecChairman: 'Eng. M. Gunawardena',
  tecMember1: 'Mr. R. Bandara',
  tecMember2: 'Ms. L. Jayasinghe',
  awardedTo: 'BuildCorp Pvt Ltd',
  serviceAgreementStartDate: '2023-11-01',
  serviceAgreementEndDate: '2024-01-31',
  performanceBondNumber: 'PB-2023-002',
  performanceBondBank: 'Sampath Bank',
  performanceBondRemark: 'Valid until project completion',
  delay: 5
}, {
  id: '3',
  tenderNumber: 'TEC-2023-003',
  relevantTo: 'HR Department',
  category: 'Services',
  description: 'Employee Training Program for Q4',
  bidStartDate: '2023-10-10',
  bidOpenDate: '2023-10-15',
  bidClosingDate: '2023-11-01',
  fileSentToTecDate: '2023-11-02',
  bidBondNumber: 'BB-2023-003',
  bidBondBank: 'Peoples Bank',
  bidValidityPeriod: '2024-01-01',
  remark: 'Reject',
  status: 'Reject',
  tecChairman: 'Mrs. D. Ekanayake',
  tecMember1: 'Mr. P. Weerasinghe',
  tecMember2: 'Ms. T. Gamage'
}];
export const mockStaff: Staff[] = [{
  id: '1',
  name: 'Dr. A. Perera',
  email: 'a.perera@tec.gov',
  area: 'Engineering',
  designation: 'Chief Engineer'
}, {
  id: '2',
  name: 'Mr. S. Silva',
  email: 's.silva@tec.gov',
  area: 'IT',
  designation: 'Senior Manager'
}, {
  id: '3',
  name: 'Ms. K. Fernando',
  email: 'k.fernando@tec.gov',
  area: 'Finance',
  designation: 'Accountant'
}, {
  id: '4',
  name: 'Eng. M. Gunawardena',
  email: 'm.gunawardena@tec.gov',
  area: 'Infrastructure',
  designation: 'Director'
}, {
  id: '5',
  name: 'Mr. R. Bandara',
  email: 'r.bandara@tec.gov',
  area: 'Operations',
  designation: 'Manager'
}, {
  id: '6',
  name: 'Ms. L. Jayasinghe',
  email: 'l.jayasinghe@tec.gov',
  area: 'Finance',
  designation: 'Accountant'
}, {
  id: '7',
  name: 'Mrs. D. Ekanayake',
  email: 'd.ekanayake@tec.gov',
  area: 'HR',
  designation: 'HR Director'
}, {
  id: '8',
  name: 'Mr. P. Weerasinghe',
  email: 'p.weerasinghe@tec.gov',
  area: 'Legal',
  designation: 'Legal Advisor'
}, {
  id: '9',
  name: 'Ms. T. Gamage',
  email: 't.gamage@tec.gov',
  area: 'Finance',
  designation: 'Accountant'
}];
export const mockBidders: Bidder[] = [{
  id: '1',
  name: 'TechSolutions Pvt Ltd',
  email: 'info@techsolutions.lk',
  address: '123 Main St, Colombo',
  contact: '011-2345678'
}, {
  id: '2',
  name: 'BuildCorp Pvt Ltd',
  email: 'sales@buildcorp.lk',
  address: '45 Industrial Zone, Gampaha',
  contact: '033-2233445'
}, {
  id: '3',
  name: 'OfficeSupplies.lk',
  email: 'orders@officesupplies.lk',
  address: '88 Union Place, Colombo 02',
  contact: '011-4455667'
}];
export const mockCategories: CategoryItem[] = [{
  id: '1',
  name: 'Goods',
  description: 'Physical products and equipment procurement',
  status: 'Active',
  createdDate: '2023-01-15'
}, {
  id: '2',
  name: 'Services',
  description: 'Professional and consulting services',
  status: 'Active',
  createdDate: '2023-01-15'
}, {
  id: '3',
  name: 'Works',
  description: 'Construction and infrastructure projects',
  status: 'Active',
  createdDate: '2023-01-15'
}, {
  id: '4',
  name: 'Consultancy',
  description: 'Expert advisory and consulting services',
  status: 'Active',
  createdDate: '2023-01-15'
}, {
  id: '5',
  name: 'Maintenance',
  description: 'Ongoing maintenance and support services',
  status: 'Inactive',
  createdDate: '2023-03-20'
}];
export const mockDepartments: Department[] = [{
  id: '1',
  name: 'IT Department',
  code: 'IT',
  description: 'Information Technology and Systems',
  headOfDepartment: 'Mr. S. Silva',
  status: 'Active',
  createdDate: '2023-01-10'
}, {
  id: '2',
  name: 'Finance',
  code: 'FIN',
  description: 'Financial Management and Accounting',
  headOfDepartment: 'Ms. K. Fernando',
  status: 'Active',
  createdDate: '2023-01-10'
}, {
  id: '3',
  name: 'HR Department',
  code: 'HR',
  description: 'Human Resources and Personnel Management',
  headOfDepartment: 'Mrs. D. Ekanayake',
  status: 'Active',
  createdDate: '2023-01-10'
}, {
  id: '4',
  name: 'Infrastructure',
  code: 'INFRA',
  description: 'Infrastructure Development and Maintenance',
  headOfDepartment: 'Eng. M. Gunawardena',
  status: 'Active',
  createdDate: '2023-01-10'
}, {
  id: '5',
  name: 'Operations',
  code: 'OPS',
  description: 'Daily Operations and Logistics',
  headOfDepartment: 'Mr. R. Bandara',
  status: 'Active',
  createdDate: '2023-01-10'
}, {
  id: '6',
  name: 'Legal',
  code: 'LEG',
  description: 'Legal Affairs and Compliance',
  headOfDepartment: 'Ms. P. Jayawardena',
  status: 'Inactive',
  createdDate: '2023-02-15'
}];
export const mockBidOpeningCommittees: BidOpeningCommittee[] = [{
  id: '1',
  committeeNumber: 'BOC-2023-001',
  member1: 'Dr. A. Perera',
  member2: 'Mr. S. Silva',
  member3: 'Ms. K. Fernando',
  additionalMembers: ['Eng. M. Gunawardena'],
  appointedDate: '2023-01-15',
  status: 'Active'
}, {
  id: '2',
  committeeNumber: 'BOC-2023-002',
  member1: 'Eng. M. Gunawardena',
  member2: 'Mr. R. Bandara',
  member3: 'Ms. L. Jayasinghe',
  appointedDate: '2023-03-20',
  status: 'Active'
}, {
  id: '3',
  committeeNumber: 'BOC-2023-003',
  member1: 'Mrs. D. Ekanayake',
  member2: 'Mr. P. Weerasinghe',
  member3: 'Ms. T. Gamage',
  additionalMembers: ['Mr. S. Silva', 'Ms. K. Fernando'],
  appointedDate: '2023-06-10',
  status: 'Active'
}, {
  id: '4',
  committeeNumber: 'BOC-2022-015',
  member1: 'Dr. A. Perera',
  member2: 'Eng. M. Gunawardena',
  member3: 'Mr. R. Bandara',
  appointedDate: '2022-11-05',
  status: 'Inactive'
}];
export const mockSystemUsers: SystemUser[] = [{
  id: '1',
  name: 'Admin User',
  role: 'Super Admin',
  email: 'admin@tec.gov',
  status: 'Active',
  createdDate: '2023-01-01',
  lastLogin: '2024-01-15 09:30:00'
}, {
  id: '2',
  name: 'John Doe',
  role: 'Admin',
  email: 'john.doe@tec.gov',
  status: 'Active',
  createdDate: '2023-02-15',
  lastLogin: '2024-01-14 14:20:00'
}, {
  id: '3',
  name: 'Jane Smith',
  role: 'Clerk 1',
  email: 'jane.smith@tec.gov',
  status: 'Active',
  createdDate: '2023-03-10',
  lastLogin: '2024-01-15 08:15:00'
}, {
  id: '4',
  name: 'Bob Wilson',
  role: 'Clerk 2',
  email: 'bob.wilson@tec.gov',
  status: 'Active',
  createdDate: '2023-04-05',
  lastLogin: '2024-01-13 16:45:00'
}, {
  id: '5',
  name: 'Alice Brown',
  role: 'Clerk 3',
  email: 'alice.brown@tec.gov',
  status: 'Inactive',
  createdDate: '2023-05-20',
  lastLogin: '2023-12-20 10:30:00'
}];
export const mockAuditLogs: AuditLog[] = [{
  id: '1',
  user: 'admin@tec.gov',
  type: 'Login',
  message: 'User logged in successfully',
  timestamp: '2024-01-15 09:30:15',
  ipAddress: '192.168.1.100'
}, {
  id: '2',
  user: 'john.doe@tec.gov',
  type: 'Create',
  message: 'Created new tender record TEC-2023-001',
  timestamp: '2024-01-15 10:15:30',
  ipAddress: '192.168.1.105'
}, {
  id: '3',
  user: 'jane.smith@tec.gov',
  type: 'Update',
  message: 'Updated tender record TEC-2023-002 status to Awarded',
  timestamp: '2024-01-15 11:20:45',
  ipAddress: '192.168.1.110'
}, {
  id: '4',
  user: 'admin@tec.gov',
  type: 'Delete',
  message: 'Deleted category Maintenance',
  timestamp: '2024-01-15 13:45:00',
  ipAddress: '192.168.1.100'
}, {
  id: '5',
  user: 'bob.wilson@tec.gov',
  type: 'Export',
  message: 'Exported records data to Excel',
  timestamp: '2024-01-15 14:30:20',
  ipAddress: '192.168.1.115'
}, {
  id: '6',
  user: 'john.doe@tec.gov',
  type: 'Create',
  message: 'Added new staff member Ms. T. Gamage',
  timestamp: '2024-01-14 15:10:00',
  ipAddress: '192.168.1.105'
}, {
  id: '7',
  user: 'admin@tec.gov',
  type: 'Update',
  message: 'Updated user role for Jane Smith to Clerk 1',
  timestamp: '2024-01-14 16:25:30',
  ipAddress: '192.168.1.100'
}, {
  id: '8',
  user: 'jane.smith@tec.gov',
  type: 'Login',
  message: 'User logged in successfully',
  timestamp: '2024-01-15 08:15:00',
  ipAddress: '192.168.1.110'
}];