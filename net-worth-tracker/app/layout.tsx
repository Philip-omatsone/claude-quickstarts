import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Net Worth Tracker",
  description: "Track your assets, liabilities, and net worth over time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
