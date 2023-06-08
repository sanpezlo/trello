import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div className="fixed left-0 top-0 -z-10 h-full w-full rounded-md bg-gradient-to-br from-pink-400 to-[#0055D1] opacity-50 blur-3xl filter" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
