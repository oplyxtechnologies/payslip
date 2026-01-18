'use client';

import { Payslip, OrganizationSettings } from '@/lib/types';
import { calculateTotal, formatCurrency, numberToWords } from '@/lib/utils';

interface PayslipPreviewProps {
  payslip: Payslip;
  settings: OrganizationSettings | null;
}

export default function PayslipPreview({ payslip, settings }: PayslipPreviewProps) {
  const totalEarnings = calculateTotal(payslip.earnings);
  const totalDeductions = calculateTotal(payslip.deductions);
  const netPay = totalEarnings - totalDeductions;
  const netPayInWords = numberToWords(netPay);

  // Check if settings have actual data (companyName is required)
  if (!settings || !settings.companyName) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h2>
        <p className="text-gray-500 text-center">
          Please configure organization settings first
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h2>
      
      <div className="border-2 border-black p-4 bg-white text-black" style={{ fontSize: '13px' }}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pb-3 border-b-2 border-black">
          {settings.logo && (
            <img
              src={settings.logo}
              alt="Company Logo"
              className="h-16 w-16 object-contain"
            />
          )}
          <div className="flex-1 text-center text-black">
            <div className="font-bold text-lg text-black">{settings.companyName}</div>
            <div className="text-sm text-black">{settings.addressLine1}</div>
            {settings.addressLine2 && <div className="text-sm text-black">{settings.addressLine2}</div>}
            <div className="text-sm text-black">{settings.cityStateZip}</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center font-bold mb-3 border-b border-black pb-2 text-black text-sm">
          Salary Slip for the Month of {payslip.month} {payslip.year}
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-black">
          <div>
            <div className="mb-1 text-black">Location: {payslip.location}</div>
            <div className="mb-1 text-black">Designation: {payslip.designation}</div>
          </div>
          <div>
            <div className="mb-1 text-black">Employee Name: {payslip.employeeName}</div>
            <div className="mb-1 text-black">Date of Joining: {payslip.dateOfJoining}</div>
            <div className="mb-1 text-black">Mode of Payment: {payslip.modeOfPayment}</div>
          </div>
        </div>

        {/* Days Info */}
        <div className="flex justify-between text-sm mb-3 pb-2 border-b border-black text-black">
          <div className="text-black">Total Days: {payslip.totalDays}</div>
          <div className="text-black">PH/WEO: {payslip.phWeo}</div>
          <div className="text-black">LWP/Absent: {payslip.lwpAbsent}</div>
        </div>

        {/* Earnings and Deductions Table */}
        <div className="grid grid-cols-2 gap-0 mb-3">
          {/* Earnings */}
          <div className="border-r border-black pr-2">
            <div className="font-bold text-center mb-2 pb-1 border-b border-black text-sm text-black">Earnings</div>
            {payslip.earnings.map((earning, index) => (
              <div key={index} className="flex justify-between mb-1 text-sm text-black">
                <span className="text-black">{earning.label}</span>
                <span className="text-black">{formatCurrency(earning.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-1 border-t border-black text-sm text-black">
              <span className="text-black">Total Earnings:</span>
              <span className="text-black">{formatCurrency(totalEarnings)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="pl-2">
            <div className="font-bold text-center mb-2 pb-1 border-b border-black text-sm text-black">Deductions</div>
            {payslip.deductions.map((deduction, index) => (
              <div key={index} className="flex justify-between mb-1 text-sm text-black">
                <span className="text-black">{deduction.label}</span>
                <span className="text-black">{formatCurrency(deduction.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-1 border-t border-black text-sm text-black">
              <span className="text-black">Total Deductions:</span>
              <span className="text-black">{formatCurrency(totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="flex justify-between font-bold mb-3 pb-2 border-b border-black text-sm text-black">
          <span className="text-black">Net Pay:</span>
          <span className="text-black">{formatCurrency(netPay)}</span>
        </div>

        {/* Rupees in Words */}
        <div className="mb-3 pb-2 border-b border-black text-sm text-black">
          <span className="font-bold text-black">Rupees (in Words): </span>
          <span className="text-black">{netPayInWords}</span>
        </div>

        {/* Footer - Signature or Note */}
        {settings.footerMode === 'AUTO_NO_SIGNATURE' ? (
          <div className="text-sm text-center font-bold text-black">
            {settings.footerNote}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="text-sm text-black">
              <div className="mb-1 text-black">{settings.employeeSignLabel}</div>
              <div className="border-b border-black w-full mb-1"></div>
            </div>
            <div className="text-sm text-right text-black">
              <div className="mb-1 text-black">{settings.authorizedSignatoryLabel}</div>
              <div className="border-b border-black w-full mb-1"></div>
              {settings.showStampBox && (
                <div className="text-sm text-gray-600">(Stamp/Seal)</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
