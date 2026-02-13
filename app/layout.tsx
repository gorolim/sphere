import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { CreatorProvider } from "@/lib/context/CreatorContext";
import { UserProvider } from "@/lib/context/UserContext";
import GlobalSearch from "@/components/GlobalSearch";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Engine Sphere",
  description: "The Agent-Native Internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#00f0ff", // Neon Cyan
          colorBackground: "#050505", // Engine Black
          colorText: "#ffffff",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${inter.variable} ${orbitron.variable} antialiased bg-engine-black text-white overflow-x-hidden selection:bg-neon-cyan selection:text-engine-black`}
        >
          <div className="flex flex-col min-h-screen">
            <UserProvider>
              <CreatorProvider>
                <GlobalSearch />
                <main className="flex-grow">{children}</main>
              </CreatorProvider>
            </UserProvider>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
