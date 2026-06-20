import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atom - Social Media",
  description: "Atom is a social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
