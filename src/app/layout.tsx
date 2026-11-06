import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clínica Dermatológica Isela Méndez",
  description:
    "Tu piel en manos de expertos. Dermatología clínica y estética en Polanco, CDMX con la Dra. Isela Méndez Baca.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
