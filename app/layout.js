import "./globals.css";

export const metadata = {
  title: "Leetcode javascript solution by nishant singh chandel",
  description: "Leetcode javascript solution by nishant singh chandel",
};

export default function RootLayout({ children }) {
  return (
    <html className="dark text-foreground bg-background " lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>LeetCode javascript solutions</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="dark text-foreground bg-background ">
        <section className="max-w-[900px] mx-auto">{children}</section>
      </body>
    </html>
  );
}
