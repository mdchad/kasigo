import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Play, X } from "lucide-react";

interface AnchorSession {
  id: string;
  live_view_url: string;
  session_url: string;
}

export function AnchorBrowser() {
  const [session, setSession] = useState<AnchorSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://api.anchorbrowser.io/v1/sessions", {
        method: "POST",
        headers: {
          "anchor-api-key": import.meta.env.VITE_ANCHOR_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            initial_url: "https://google.com",
          },
          browser: {
            headless: {
              active: false
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSession(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    try {
      const response = await fetch("https://api.anchorbrowser.io/v1/sessions/" + session?.id, {
        method: "DELETE",
        headers: {
          "anchor-api-key": import.meta.env.VITE_ANCHOR_API_KEY,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSession(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Anchor Browser Live View
        </CardTitle>
        <CardDescription>
          Create an interactive browser session with live view
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!session ? (
          <Button
            onClick={createSession}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-spin" />
                Creating Session...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Create Browser Session
              </>
            )}
          </Button>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Description and Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Session Information</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Session ID:</strong> {session.id}</p>
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Initial URL:</strong> https://google.com</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Controls</h3>
                <Button
                  variant="outline"
                  onClick={closeSession}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Session
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interactive browser session</li>
                  <li>• Real-time live view</li>
                  <li>• Full browser functionality</li>
                  <li>• Session management</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Browser */}
            <div className="border rounded-lg overflow-hidden" style={{ height: "600px", position: "relative" }}>
              <iframe
                src={session.live_view_url}
                sandbox="allow-same-origin allow-scripts"
                allow="clipboard-read; clipboard-write"
                style={{
                  border: "0px",
                  display: "block",
                  width: "100%",
                  height: "100%"
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mt-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 