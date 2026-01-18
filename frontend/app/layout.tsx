import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payslip Generator",
  description: "Generate professional payslips with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Payslip Generator</h1>
              <div className="flex gap-6">
                <Link 
                  href="/" 
                  className="hover:text-blue-300 transition-colors"
                >
                  Generate Payslip
                </Link>
                <Link 
                  href="/settings" 
                  className="hover:text-blue-300 transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
