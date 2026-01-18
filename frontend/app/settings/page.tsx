'use client';

import { useState, useEffect } from 'react';
import { OrganizationSettings } from '@/lib/types';
import { loadSettings, saveSettings } from '@/lib/storage';

export default function SettingsPage() {
  const [settings, setSettings] = useState<OrganizationSettings>({
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
  });

  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setLogoPreview(loaded.logo);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG or JPG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setSettings({ ...settings, logo: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    setSettings({ ...settings, logo: undefined });
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Organization Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                PNG or JPG, max 2MB
              </p>
            </div>
            {logoPreview && (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 w-20 object-contain border border-gray-300 rounded"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Crop Life Science Ltd."
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            value={settings.addressLine1}
            onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Plot No: 5165,5166 & 5155, G.I.D.C Estate"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2
          </label>
          <input
            type="text"
            value={settings.addressLine2}
            onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional"
          />
        </div>

        {/* City/State/Zip */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City, State - ZIP *
          </label>
          <input
            type="text"
            value={settings.cityStateZip}
            onChange={(e) => setSettings({ ...settings, cityStateZip: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Ankleshwar, Gujarat - 393002"
          />
        </div>

        {/* Footer Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Signature Mode
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="footerMode"
                value="AUTO_NO_SIGNATURE"
                checked={settings.footerMode === 'AUTO_NO_SIGNATURE'}
                onChange={(e) => setSettings({ ...settings, footerMode: e.target.value as any })}
                className="mt-1"
              />
              <div>
                <div className="font-medium">✅ Auto-generated (No signature required)</div>
                <div className="text-sm text-gray-600">
                  Shows footer note: "This is computer generated statement hence does not require any signature."
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="footerMode"
                value="SIGNATURE_REQUIRED"
                checked={settings.footerMode === 'SIGNATURE_REQUIRED'}
                onChange={(e) => setSettings({ ...settings, footerMode: e.target.value as any })}
                className="mt-1"
              />
              <div>
                <div className="font-medium">✍️ Signature required</div>
                <div className="text-sm text-gray-600">
                  Shows signature lines for Employee and Authorized Signatory
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Signature Options (only shown when SIGNATURE_REQUIRED) */}
        {settings.footerMode === 'SIGNATURE_REQUIRED' && (
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <h3 className="font-medium text-gray-700">Signature Options</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Signature Label
              </label>
              <input
                type="text"
                value={settings.employeeSignLabel}
                onChange={(e) => setSettings({ ...settings, employeeSignLabel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authorized Signatory Label
              </label>
              <input
                type="text"
                value={settings.authorizedSignatoryLabel}
                onChange={(e) => setSettings({ ...settings, authorizedSignatoryLabel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showStampBox}
                  onChange={(e) => setSettings({ ...settings, showStampBox: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show "(Stamp/Seal)" text below Authorized Signatory
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Note (only shown when AUTO_NO_SIGNATURE) */}
        {settings.footerMode === 'AUTO_NO_SIGNATURE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Note
            </label>
            <textarea
              value={settings.footerNote}
              onChange={(e) => setSettings({ ...settings, footerNote: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Save Settings
          </button>
          {saved && (
            <span className="text-green-600 font-medium">✓ Settings saved successfully!</span>
          )}
        </div>
      </div>
    </div>
  );
}
