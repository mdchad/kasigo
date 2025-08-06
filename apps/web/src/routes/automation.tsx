import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";
import {useMutation} from "@tanstack/react-query";

export const Route = createFileRoute("/automation")({
  component: AutomationPage,
});

function AutomationPage() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    title?: string;
    screenshot?: string;
  } | null>(null);

  const executeMutation = trpc.automation.executeHackerNews.mutationOptions();
  const myMutation = useMutation(executeMutation);

  const handleExecute = () => {
    setResult(null);
    myMutation.mutate();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Automation</h1>
          <p className="text-muted-foreground">
            Execute Playwright automation scripts on the backend
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hacker News Navigation</CardTitle>
            <CardDescription>
              Execute a simple Playwright script that navigates to Hacker News
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExecute}
              disabled={myMutation.isPending}
              className="w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              {myMutation.isPending ? "Executing..." : "Execute Script"}
            </Button>

            {result && (
              <div className="mt-6 space-y-4">
                <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <CardHeader>
                    <CardTitle className={result.success ? "text-green-800" : "text-red-800"}>
                      {result.success ? "Success" : "Error"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.message}</p>
                    {result.title && (
                      <p className="text-sm mt-2">
                        <strong>Page Title:</strong> {result.title}
                      </p>
                    )}
                    {result.screenshot && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Screenshot:</p>
                        <img
                          src={`data:image/png;base64,${result.screenshot}`}
                          alt="Screenshot"
                          className="max-w-full h-auto border rounded"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 