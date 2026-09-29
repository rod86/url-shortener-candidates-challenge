import { Outlet } from "react-router";
import Header from "@app/components/layout/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <Outlet />
    </div>
  );
}
