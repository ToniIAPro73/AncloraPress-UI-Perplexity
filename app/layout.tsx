import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AncloraPress UI",
  description: "Interface for creating and exporting ebooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
