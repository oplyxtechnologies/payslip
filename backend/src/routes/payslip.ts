import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { PDFPayload, LineItem } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Utility functions
function calculateTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
}

function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0.00';
  return amount.toFixed(2);
}

function numberToWords(num: number): string {
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

function generateHTML(payload: PDFPayload): string {
  const { payslip, settings } = payload;
  const totalEarnings = calculateTotal(payslip.earnings);
  const totalDeductions = calculateTotal(payslip.deductions);
  const netPay = totalEarnings - totalDeductions;
  const netPayInWords = numberToWords(netPay);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      padding: 20px;
    }
    
    .payslip-container {
      border: 2px solid black;
      padding: 15px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid black;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .company-info {
      flex: 1;
      text-align: center;
    }
    
    .company-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .company-address {
      font-size: 10px;
      line-height: 1.4;
    }
    
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid black;
    }
    
    .employee-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 12px;
      font-size: 10px;
    }
    
    .info-row {
      margin-bottom: 4px;
    }
    
    .days-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid black;
      font-size: 10px;
    }
    
    .earnings-deductions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin-bottom: 12px;
    }
    
    .earnings {
      border-right: 1px solid black;
      padding-right: 10px;
    }
    
    .deductions {
      padding-left: 10px;
    }
    
    .section-title {
      font-weight: bold;
      text-align: center;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid black;
      font-size: 11px;
    }
    
    .line-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 10px;
    }
    
    .section-total {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-top: 8px;
      padding-top: 4px;
      border-top: 1px solid black;
      font-size: 10px;
    }
    
    .net-pay {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid black;
      font-size: 10px;
    }
    
    .rupees-words {
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid black;
      font-size: 10px;
    }
    
    .footer-note {
      text-align: center;
      font-weight: bold;
      font-size: 10px;
    }
    
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding-top: 30px;
      font-size: 10px;
    }
    
    .signature-block {
      text-align: left;
    }
    
    .signature-block.right {
      text-align: right;
    }
    
    .signature-line {
      border-bottom: 1px solid black;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    
    .stamp-text {
      font-size: 9px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="payslip-container">
    <!-- Header -->
    <div class="header">
      ${settings.logo ? `<img src="${settings.logo}" alt="Logo" class="logo" />` : '<div style="width: 80px;"></div>'}
      <div class="company-info">
        <div class="company-name">${settings.companyName}</div>
        <div class="company-address">
          ${settings.addressLine1}<br/>
          ${settings.addressLine2 ? settings.addressLine2 + '<br/>' : ''}
          ${settings.cityStateZip}
        </div>
      </div>
    </div>
    
    <!-- Title -->
    <div class="title">
      Salary Slip for the Month of ${payslip.month} ${payslip.year}
    </div>
    
    <!-- Employee Info -->
    <div class="employee-info">
      <div>
        <div class="info-row">Location: ${payslip.location}</div>
        <div class="info-row">Designation: ${payslip.designation}</div>
      </div>
      <div>
        <div class="info-row">Employee Name: ${payslip.employeeName}</div>
        <div class="info-row">Date of Joining: ${payslip.dateOfJoining}</div>
        <div class="info-row">Mode of Payment: ${payslip.modeOfPayment}</div>
      </div>
    </div>
    
    <!-- Days Info -->
    <div class="days-info">
      <div>Total Days: ${payslip.totalDays}</div>
      <div>PH/WEO: ${payslip.phWeo}</div>
      <div>LWP/Absent: ${payslip.lwpAbsent}</div>
    </div>
    
    <!-- Earnings and Deductions -->
    <div class="earnings-deductions">
      <div class="earnings">
        <div class="section-title">Earnings</div>
        ${payslip.earnings.map(e => `
          <div class="line-item">
            <span>${e.label}</span>
            <span>${formatCurrency(e.amount)}</span>
          </div>
        `).join('')}
        <div class="section-total">
          <span>Total Earnings:</span>
          <span>${formatCurrency(totalEarnings)}</span>
        </div>
      </div>
      
      <div class="deductions">
        <div class="section-title">Deductions</div>
        ${payslip.deductions.map(d => `
          <div class="line-item">
            <span>${d.label}</span>
            <span>${formatCurrency(d.amount)}</span>
          </div>
        `).join('')}
        <div class="section-total">
          <span>Total Deductions:</span>
          <span>${formatCurrency(totalDeductions)}</span>
        </div>
      </div>
    </div>
    
    <!-- Net Pay -->
    <div class="net-pay">
      <span>Net Pay:</span>
      <span>${formatCurrency(netPay)}</span>
    </div>
    
    <!-- Rupees in Words -->
    <div class="rupees-words">
      <strong>Rupees (in Words):</strong> ${netPayInWords}
    </div>
    
    <!-- Footer -->
    ${settings.footerMode === 'AUTO_NO_SIGNATURE' ? `
      <div class="footer-note">
        ${settings.footerNote}
      </div>
    ` : `
      <div class="signatures">
        <div class="signature-block">
          <div>${settings.employeeSignLabel}</div>
          <div class="signature-line"></div>
        </div>
        <div class="signature-block right">
          <div>${settings.authorizedSignatoryLabel}</div>
          <div class="signature-line"></div>
          ${settings.showStampBox ? '<div class="stamp-text">(Stamp/Seal)</div>' : ''}
        </div>
      </div>
    `}
  </div>
</body>
</html>
  `;
}

// POST /api/payslip/pdf - Generate PDF
router.post('/pdf', async (req: Request, res: Response) => {
  try {
    const payload: PDFPayload = req.body;

    if (!payload.payslip || !payload.settings) {
      return res.status(400).json({ error: 'Missing payslip or settings data' });
    }

    // Generate HTML
    const html = generateHTML(payload);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="payslip.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

export default router;
