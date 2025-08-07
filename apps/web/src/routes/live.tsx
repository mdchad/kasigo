import { createFileRoute } from "@tanstack/react-router";
import { AnchorBrowser } from "@/components/anchor-browser";
import { Monitor } from "lucide-react";

export const Route = createFileRoute("/live")({
  component: AnchorBrowserPage,
});

function AnchorBrowserPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Monitor className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Anchor Browser Live View</h1>
      </div>

      <AnchorBrowser />
    </div>
  );
} 