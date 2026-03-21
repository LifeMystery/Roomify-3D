import './globals.css';

export const metadata = {
  title: 'Roomify 3D',
  description: 'Turn Photos Into 3D Models. See how objects fit in your space in real-time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
