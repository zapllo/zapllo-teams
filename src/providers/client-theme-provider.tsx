"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { usePathname } from "next/navigation";
import React from "react";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Special case for the wallet offer page - force light theme
  if (pathname.startsWith("/special-wallet-offer")) {
    return (
      <ThemeProvider
        forcedTheme="light"
        attribute="class"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    );
  }
  
  // For dashboard and other specified paths, don't force a theme, otherwise force dark
  const forcedTheme = pathname.startsWith("/dashboard") || pathname.startsWith("/attendance") || pathname.startsWith("/help") || pathname.startsWith("/intranet") ? undefined : "dark";

  return (
    <ThemeProvider
      forcedTheme={forcedTheme}
      attribute="class"
      enableSystem={false} // This disables system toggling when a forced theme is applied.
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}