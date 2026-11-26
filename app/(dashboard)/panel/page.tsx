import type { Metadata } from "next";
import { PanelView } from "@/features/panel";

export const metadata: Metadata = {
  title: "Panel de Control",
};

export default function PanelPage() {
  return <PanelView />;
}
