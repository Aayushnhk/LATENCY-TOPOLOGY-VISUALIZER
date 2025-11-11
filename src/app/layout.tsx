// src/app/layout.tsx 

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { LatencyProvider } from "@/context/LatencyContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Latency Topology Visualizer",
  description: "Real-time crypto infrastructure latency map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dark theme for scrolling elements and background color
    <html lang="en" className="dark bg-gray-950"> 
      <body className={`${inter.className} dark:bg-gray-950`}> 
        {/* Wrapping the children with the LatencyProvider */}
        <LatencyProvider>
          {children}
        </LatencyProvider>
      </body>
    </html>
  );
}