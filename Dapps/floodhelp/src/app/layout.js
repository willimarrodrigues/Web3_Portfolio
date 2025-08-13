import "./globals.css";

export const metadata = {
  title: "FloodHelp",
  description: "Ajude os desabrigados pela enchente",
  charset: "UTF-8"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width:device-width, initial-scale:1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
