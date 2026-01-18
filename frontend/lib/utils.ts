// Utility functions for the payslip generator

import { LineItem } from './types';

/**
 * Calculate the total of an array of line items
 */
export function calculateTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
}

/**
 * Format a number as currency with 2 decimal places
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0.00';
  return amount.toFixed(2);
}

/**
 * Convert a number to words (Indian English format)
 */
export function numberToWords(num: number): string {
  if (isNaN(num) || num < 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    return ones[hundred] + ' Hundred' + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
  }

  // Handle Indian numbering system: Crore, Lakh, Thousand, Hundred
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let result = '';

  if (crore > 0) {
    result += convertLessThanThousand(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertLessThanThousand(remainder);
  }

  return result.trim() + ' only.';
}

/**
 * Validate that a value is a valid number >= 0
 */
export function validateAmount(value: string | number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || num < 0) return 0;
  return num;
}
