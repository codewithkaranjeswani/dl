import "@/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import Menubar from "@/components/menu-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "QuizApp",
  description: "quizzing courses for learning your favourite language",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div className="container mx-auto">
          <TRPCReactProvider cookies={cookies().toString()}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Menubar />
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
