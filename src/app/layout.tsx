import type { Metadata } from "next";
import "./globals.css";
import { ibmPlexSans } from "./fonts";

export const metadata: Metadata = {
  title: "Åke Amcoff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={ibmPlexSans.className}>{children}</body>
    </html>
  );
}
