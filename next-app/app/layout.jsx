import { Inter } from "next/font/google";
import "./globals.css";
import { BotConnector } from "@/components/bot";
import { Script } from "next/script";
import { Render } from "./Render";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Tribuni: Find Your Tribe Now",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script src="https://telegram.org/js/telegram-web-app.js"></script>
            </head>
            <body className={clsx(inter.className)}>
                <BotConnector />
                <div className="flex flex-col items-center w-full h-screen">
                    {children}
                </div>

                <GoogleAnalytics
                    gaId={process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID}
                />
                {/* <Toaster position="top-center" richColors /> */}

                <Toaster />
            </body>
        </html>
    );
}
