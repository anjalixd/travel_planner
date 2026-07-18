import './globals.css';

export const metadata = {
  title: 'AI Travel Planner',
  description: 'Premium AI Itinerary Compiler',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
