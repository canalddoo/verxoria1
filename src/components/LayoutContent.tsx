"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Masque Navbar et Footer sur les pages admin / login
  const isDashboardOrLogin =
    pathname.startsWith("/dashboard") || pathname === "/login";

  if (isDashboardOrLogin) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}