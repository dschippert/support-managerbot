import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manager Bot Support",
  description: "Business management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-cash-sans">{children}</body>
    </html>
  );
}

