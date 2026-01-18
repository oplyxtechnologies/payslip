'use client';

import { Payslip, OrganizationSettings, LineItem } from '@/lib/types';
import { calculateTotal, formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface PayslipFormProps {
  payslip: Payslip;
  setPayslip: (payslip: Payslip) => void;
  settings: OrganizationSettings | null;
}

export default function PayslipForm({ payslip, setPayslip, settings }: PayslipFormProps) {
  const [isExporting, setIsExporting] = useState(false);

  const updateField = (field: keyof Payslip, value: any) => {
    setPayslip({ ...payslip, [field]: value });
  };

  const addEarning = () => {
    setPayslip({
      ...payslip,
      earnings: [...payslip.earnings, { label: '', amount: 0 }],
    });
  };

  const removeEarning = (index: number) => {
    setPayslip({
      ...payslip,
      earnings: payslip.earnings.filter((_, i) => i !== index),
    });
  };

  const updateEarning = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...payslip.earnings];
    updated[index] = { ...updated[index], [field]: value };
    setPayslip({ ...payslip, earnings: updated });
  };

  const addDeduction = () => {
    setPayslip({
      ...payslip,
      deductions: [...payslip.deductions, { label: '', amount: 0 }],
    });
  };

  const removeDeduction = (index: number) => {
    setPayslip({
      ...payslip,
      deductions: payslip.deductions.filter((_, i) => i !== index),
    });
  };

  const updateDeduction = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...payslip.deductions];
    updated[index] = { ...updated[index], [field]: value };
    setPayslip({ ...payslip, deductions: updated });
  };

  const handleExportPDF = async () => {
    if (!settings?.companyName) {
      alert('Please configure organization settings first!');
      return;
    }

    setIsExporting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/api/payslip/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payslip,
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${payslip.employeeName.replace(/\s+/g, '_')}_${payslip.month}_${payslip.year}_payslip.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Make sure the backend server is running.');
    } finally {
      setIsExporting(false);
    }
  };

  const totalEarnings = calculateTotal(payslip.earnings);
  const totalDeductions = calculateTotal(payslip.deductions);
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Payslip Details</h2>

      {/* Month and Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month *
          </label>
          <select
            value={payslip.month}
            onChange={(e) => updateField('month', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            value={payslip.year}
            onChange={(e) => updateField('year', parseInt(e.target.value) || new Date().getFullYear())}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Employee Details */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Employee Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            value={payslip.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Ankleshwar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Name *
          </label>
          <input
            type="text"
            value={payslip.employeeName}
            onChange={(e) => updateField('employeeName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Mr. DISHANT HARESHBHAI LUNAGARIYA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Designation *
          </label>
          <input
            type="text"
            value={payslip.designation}
            onChange={(e) => updateField('designation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Agriculture Assistant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Joining *
          </label>
          <input
            type="text"
            value={payslip.dateOfJoining}
            onChange={(e) => updateField('dateOfJoining', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 15/06/2022"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode of Payment *
          </label>
          <select
            value={payslip.modeOfPayment}
            onChange={(e) => updateField('modeOfPayment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Days
            </label>
            <input
              type="number"
              value={payslip.totalDays}
              onChange={(e) => updateField('totalDays', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PH/WEO
            </label>
            <input
              type="number"
              value={payslip.phWeo}
              onChange={(e) => updateField('phWeo', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LWP/Absent
            </label>
            <input
              type="number"
              value={payslip.lwpAbsent}
              onChange={(e) => updateField('lwpAbsent', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Earnings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Earnings</h3>
          <button
            onClick={addEarning}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Row
          </button>
        </div>
        
        {payslip.earnings.map((earning, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={earning.label}
              onChange={(e) => updateEarning(index, 'label', e.target.value)}
              placeholder="Label"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={earning.amount}
              onChange={(e) => updateEarning(index, 'amount', parseFloat(e.target.value) || 0)}
              placeholder="Amount"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeEarning(index)}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
        
        <div className="text-right font-semibold text-gray-700">
          Total Earnings: ₹{formatCurrency(totalEarnings)}
        </div>
      </div>

      {/* Deductions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700">Deductions</h3>
          <button
            onClick={addDeduction}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Row
          </button>
        </div>
        
        {payslip.deductions.map((deduction, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={deduction.label}
              onChange={(e) => updateDeduction(index, 'label', e.target.value)}
              placeholder="Label"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={deduction.amount}
              onChange={(e) => updateDeduction(index, 'amount', parseFloat(e.target.value) || 0)}
              placeholder="Amount"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeDeduction(index)}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
        
        <div className="text-right font-semibold text-gray-700">
          Total Deductions: ₹{formatCurrency(totalDeductions)}
        </div>
      </div>

      {/* Net Pay */}
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="text-right text-xl font-bold text-blue-900">
          Net Pay: ₹{formatCurrency(netPay)}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isExporting ? 'Generating PDF...' : 'Export PDF'}
      </button>
    </div>
  );
}
