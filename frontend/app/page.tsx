'use client';

import { useState, useEffect } from 'react';
import { Payslip, OrganizationSettings } from '@/lib/types';
import { loadSettings } from '@/lib/storage';
import PayslipForm from '@/components/PayslipForm';
import PayslipPreview from '@/components/PayslipPreview';

export default function HomePage() {
  const [payslip, setPayslip] = useState<Payslip>({
    month: 'January',
    year: new Date().getFullYear(),
    location: '',
    employeeName: '',
    designation: '',
    dateOfJoining: '',
    modeOfPayment: 'Cash',
    totalDays: 31,
    phWeo: 0,
    lwpAbsent: 0,
    earnings: [
      { label: 'Basic', amount: 0 },
      { label: 'DA', amount: 0 },
      { label: 'HRA', amount: 0 },
    ],
    deductions: [
      { label: 'Provident Fund', amount: 0 },
      { label: 'PT', amount: 0 },
    ],
  });

  const [settings, setSettings] = useState<OrganizationSettings | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const loaded = loadSettings();
      console.log('Loaded settings:', loaded); // Debug log
      setSettings(loaded);
    }
  }, []);

  // Auto-update total days when month or year changes
  useEffect(() => {
    const getDaysInMonth = (month: string, year: number): number => {
      const monthIndex = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ].indexOf(month);

      if (monthIndex === -1) return 31; // Default

      // Create date for the first day of next month, then subtract 1 day
      const date = new Date(year, monthIndex + 1, 0);
      return date.getDate();
    };

    const days = getDaysInMonth(payslip.month, payslip.year);
    if (payslip.totalDays !== days) {
      setPayslip({ ...payslip, totalDays: days });
    }
  }, [payslip.month, payslip.year]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Generate Payslip</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <PayslipForm payslip={payslip} setPayslip={setPayslip} settings={settings} />
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <PayslipPreview payslip={payslip} settings={settings} />
        </div>
      </div>
    </div>
  );
}
