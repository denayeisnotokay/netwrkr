import { Lilita_One, Signika_Negative } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Hdr from "@/app/_components/header";
import Ftr from "@/app/_components/footer";
import { NextUIProvider } from '@nextui-org/react';
import Prtctr from "@/app/_components/auth/protector";

const lilitaOne = Lilita_One({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-lilita',
});

const signikaNegative = Signika_Negative({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-signika',
});

const parkinsans = localFont({
  src: '../fonts/Parkinsans-VariableFont_wght.ttf',
  variable: '--font-parkinsans',
});

export const metadata = {
  title: "Netwrkr",
  description: "teehee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${parkinsans.variable} ${signikaNegative.variable} ${lilitaOne.variable} font-body text-medium h-screen max-h-screen flex flex-col items-center bg-default-950`}>
        <NextUIProvider className="h-screen bg-default-50 max-h-screen max-w-md flex flex-col w-full">
          <Hdr />
          <Prtctr fallback={<main className={'grow shrink'}>...</main>}>
            {children}
          </Prtctr>
          <Ftr />
        </NextUIProvider>
      </body>
    </html>
  );
}
