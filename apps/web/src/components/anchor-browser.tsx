import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Play, X, Globe, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OnKernelBrowser {
  id: string;
  browser_live_view_url: string;
  status: string;
  created_at: string;
  persistence_id?: string;
}

export function AnchorBrowser() {
  const [browser, setBrowser] = useState<OnKernelBrowser | null>(null);
  const [persistenceId, setPersistenceId] = useState("my-awesome-browser-for-user-1234");
  const [isHeadless, setIsHeadless] = useState(false);
  const [isStealth, setIsStealth] = useState(false);

  const createBrowserMutation = useMutation(
    trpc.onkernel.createBrowser.mutationOptions({
      onSuccess: (data: OnKernelBrowser) => {
        setBrowser(data);
      },
      onError: (error: any) => {
        console.error("Failed to create browser:", error);
      },
    }),
  );

  const deleteBrowserMutation = useMutation(
    trpc.onkernel.deleteBrowser.mutationOptions({
      onSuccess: () => {
        setBrowser(null);
      },
      onError: (error: any) => {
        console.error("Failed to delete browser:", error);
      },
    }),
  );

  // const getBrowserQuery = useQuery(
  //   trpc.onkernel.getBrowser.queryOptions({ id: browser?.id || "" }),
  // );

  const listBrowsersQuery = useQuery(
    trpc.onkernel.listBrowsers.queryOptions(),
  );

  const createBrowser = () => {
    createBrowserMutation.mutate({
      headless: isHeadless,
      stealth: isStealth,
      persistence_id: persistenceId || undefined,
    });
  };

  const deleteBrowser = () => {
    if (!browser) return;
    deleteBrowserMutation.mutate({ persistence_id: persistenceId });
  };

  const getBrowserStatus = () => {
    if (browser?.id) {
      // getBrowserQuery.refetch();
    }
  };

  console.log("browser", listBrowsersQuery.data);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          OnKernel Live Browser
        </CardTitle>
        <CardDescription>
          Create an interactive browser session with OnKernel's cloud-based browser automation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!browser ? (
          <div className="space-y-6">
            {/* Configuration Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="persistence-id">Persistence ID (Optional)</Label>
                <Input
                  id="persistence-id"
                  value={persistenceId}
                  onChange={(e) => setPersistenceId(e.target.value)}
                  placeholder="my-session-123"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for temporary session, or set a unique ID to persist browser state
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="headless"
                    checked={isHeadless}
                    onChange={(e) => setIsHeadless(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="headless">Headless Mode</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="stealth"
                    checked={isStealth}
                    onChange={(e) => setIsStealth(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="stealth">Stealth Mode</Label>
                </div>
              </div>
            </div>

            <Button
              onClick={createBrowser}
              disabled={createBrowserMutation.isPending}
              className="w-full"
            >
              {createBrowserMutation.isPending ? (
                <>
                  <Play className="h-4 w-4 mr-2 animate-spin" />
                  Creating Browser Session...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Create Browser Session
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Information and Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Browser Information
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Session ID:</strong> {browser.id}</p>
                  <p><strong>Status:</strong> {browser.status}</p>
                  <p><strong>Created:</strong> {new Date(browser.created_at).toLocaleString()}</p>
                  {browser.persistence_id && (
                    <p><strong>Persistence ID:</strong> {browser.persistence_id}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Controls
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={getBrowserStatus}
                    className="w-full"
                  >
                    Refresh Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={deleteBrowser}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close Session
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cloud-based browser automation</li>
                  <li>• Real-time live view</li>
                  <li>• Session persistence</li>
                  <li>• Stealth mode for anti-detection</li>
                  <li>• Headless mode support</li>
                  <li>• Sub-millisecond cold starts</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Browser Live View */}
            <div className="border rounded-lg overflow-hidden" style={{ height: "600px", position: "relative" }}>
              {browser.browser_live_view_url ? (
                <iframe
                  src={browser.browser_live_view_url}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  allow="clipboard-read; clipboard-write; camera; microphone; geolocation"
                  style={{
                    border: "0px",
                    display: "block",
                    width: "100%",
                    height: "100%"
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Live view not available</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {isHeadless ? "Headless mode doesn't support live view" : "Browser session may be starting up"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


      </CardContent>
    </Card>
  );
} 