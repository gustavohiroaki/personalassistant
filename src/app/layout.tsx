import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/molecules/Header";

export const metadata: Metadata = {
  title: "Personal Assistant",
  description: "An app to manage your daily tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
