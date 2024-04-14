import type { Metadata } from "next";
import { Nav, Footer} from "../components/index"
import {Providers} from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Podiumetrics",
  description: "Your one stop destination for Formula 1 legacy statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative flex flex-col min-h-screen pb-20">
        <Providers>
        <Nav />
        {children}
        <div className="mt-auto">
         <div className="absolute bottom-0 w-full footer">
        <Footer />
        </div>
        </div>
        </Providers>
        </div>
        </body>
    </html>
  );
}
