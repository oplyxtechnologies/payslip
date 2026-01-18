// Shared TypeScript types for backend

export interface LineItem {
  label: string;
  amount: number;
}

export interface OrganizationSettings {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  logo?: string;
  footerMode: "AUTO_NO_SIGNATURE" | "SIGNATURE_REQUIRED";
  footerNote?: string;
  employeeSignLabel: string;
  authorizedSignatoryLabel: string;
  showStampBox: boolean;
}

export interface Payslip {
  month: string;
  year: number;
  location: string;
  employeeName: string;
  designation: string;
  dateOfJoining: string;
  modeOfPayment: string;
  totalDays: number;
  phWeo: number;
  lwpAbsent: number;
  earnings: LineItem[];
  deductions: LineItem[];
}

export interface PDFPayload {
  payslip: Payslip;
  settings: OrganizationSettings;
}
