import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="./assets/images/apple-touch-icon.png"
        />
        <link rel="manifest" href="./manifest.json" />
        <meta name="theme-color" content="#FFFFFF" />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
