import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Unfold",
  icons: {
    icon: "/logo.ico",
  },
  description: "Journal app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* can change text and backgroud here */}
          <Header />
          <main>
            <Toaster richColors />
            {children}
          </main>
          <footer>
            <div>
              {/* <h4 className=" text-amber-600">My Journal App</h4> */}
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>

  );
}
