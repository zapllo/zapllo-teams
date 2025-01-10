import type { Metadata } from "next";
import { Lato, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import Script from "next/script";
import { Toaster } from "sonner";

const inter = Lato({ weight: "400", subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Zapllo - Automate and Upgrade your Business to 10X",
  description: "Supercharge your Workflow with Zapllo and unleash the power of AI and Automation. Book your free demo now.",
  openGraph: {
    title: "Zapllo - Automate and Upgrade your Business to 10X",
    description: "India's No.1 SaaS for MSMEs 🚀",
    url: "https://zapllo.com",
    type: "website",
    images: [
      {
        url: "https://zapllo.com/og.png",
        width: 1200, // recommended width
        height: 630, // recommended height
        alt: "Image for India's No.1 SaaS for MSMEs - ZAPLLO 🚀 ",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive" // Ensures the script loads before your app's JavaScript
          async
        />
      </head>
      <Toaster
        toastOptions={{
          duration: 2500, // Sets default duration to 2 seconds for all toasts
          classNames: {
            toast: 'bg-white text-black ',
          },
        }}
        position="bottom-center" />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {/* <FloatingNavbar /> */}
        <body className={inter.className}>
          <NextTopLoader />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
