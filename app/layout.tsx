import type { Metadata } from "next";
import "./globals.css";  // <--- THIS LINE IS CRITICAL!

export const metadata: Metadata = {
  title: "Meme-ify My Day",
  description: "AI that roasts your schedule",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}