import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
});

export const metadata = {
  title: "Team X - 夢を実現するプラットフォーム",
  description: "みらいちゃんと一緒に学び、成長し、夢を実現するプラットフォーム",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased relative`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
