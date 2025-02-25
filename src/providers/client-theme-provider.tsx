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
  // For pages in the (main) group (assuming they have a URL starting with "/main"),
  // do not force a theme (i.e. allow light if the user wants it). Otherwise, force dark.
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
