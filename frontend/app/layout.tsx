import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProvider } from "@/lib/AppContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-ui",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "ArchiveX — DDNet Clients Archive",
  description: "The best and only DDNet / TeeWorlds clients archive.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f0" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}