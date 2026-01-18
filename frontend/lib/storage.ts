// localStorage utilities for persisting settings

import { OrganizationSettings } from './types';

const SETTINGS_KEY = 'payslip_org_settings';

const defaultSettings: OrganizationSettings = {
  companyName: '',
  addressLine1: '',
  addressLine2: '',
  cityStateZip: '',
  logo: undefined,
  footerMode: 'AUTO_NO_SIGNATURE',
  footerNote: 'This is computer generated statement hence does not require any signature.',
  employeeSignLabel: 'Employee Signature',
  authorizedSignatoryLabel: 'Authorized Signatory',
  showStampBox: true,
};

/**
 * Load organization settings from localStorage
 */
export function loadSettings(): OrganizationSettings {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return defaultSettings;
    
    const parsed = JSON.parse(stored);
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
}

/**
 * Save organization settings to localStorage
 */
export function saveSettings(settings: OrganizationSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

/**
 * Clear all settings from localStorage
 */
export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing settings:', error);
  }
}
