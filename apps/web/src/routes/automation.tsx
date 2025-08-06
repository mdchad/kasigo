import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Activity, Zap, Globe, Image } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

export const Route = createFileRoute("/automation")({
  component: AutomationPage,
});

function AutomationPage() {
  const executeMutation = trpc.automation.executeHackerNews.mutationOptions();
  const { data, isPending, status, error, mutate } = useMutation(executeMutation);

  const customScriptMutation = trpc.automation.executeCustomScript.mutationOptions();
  const { data: customData, isPending: customPending, mutate: customMutate} = useMutation(customScriptMutation);

  const healthCheckQuery = trpc.automation.healthCheck.queryOptions();
  const healthCheck = useQuery({
    ...healthCheckQuery,
    refetchInterval: 5000, // Check every 5 seconds
  });

  const handleExecuteCustom = () => {
    // Example custom script - navigate to Google and search
    const customScript = {
      url: "https://www.google.com",
      actions: [
        { type: "wait" as const },
        { type: "type" as const, label: 'Search', value: "playwright automation" },
        { type: "click" as const, label: 'Google Search' },
        { type: "screenshot" as const },
      ],
    };
    customMutate(customScript);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Distributed Automation</h1>
      </div>

      {/* Grid Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Grid Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${healthCheck.data?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="font-medium">
              {healthCheck.data?.status === 'healthy' ? 'Connected' : 'Disconnected'}
            </span>
            <span className="text-sm text-muted-foreground">
              {healthCheck.data?.gridUrl}
            </span>
          </div>
          {healthCheck.data?.message && (
            <p className="text-sm text-muted-foreground mt-2">
              {healthCheck.data.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Automation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Hacker News Test
            </CardTitle>
            <CardDescription>
              Navigate to Hacker News and capture a screenshot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => mutate()}
              disabled={isPending || healthCheck.data?.status !== 'healthy'}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Custom Script
            </CardTitle>
            <CardDescription>
              Execute a custom automation script
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExecuteCustom}
              disabled={customPending || healthCheck.data?.status !== 'healthy'}
              className="w-full"
            >
              {customPending ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Custom Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Automation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg ${data.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${data.success ? 'text-green-800' : 'text-red-800'}`}>
                {data.message}
              </p>
              {data.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  Page Title: {data.title}
                </p>
              )}
            </div>

            {/* Screenshot Display */}
            {data.screenshot && (
              <div className="space-y-2">
                <h4 className="font-medium">Screenshot:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${data.screenshot}`}
                    alt="Automation Screenshot"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${data.screenshot}`;
                      link.download = `automation-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                      link.click();
                    }}
                  >
                    Download Screenshot
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`data:image/png;base64,${data.screenshot}`);
                    }}
                  >
                    Copy Base64
                  </Button>
                </div>
              </div>
            )}

            {/* Multiple Results */}
            {/*{result.results && result.results.length > 0 && (*/}
            {/*  <div className="space-y-2">*/}
            {/*    <h4 className="font-medium">Script Results:</h4>*/}
            {/*    <div className="space-y-1">*/}
            {/*      {result.results.map((result, index) => (*/}
            {/*        <div key={index} className="text-sm bg-gray-50 p-2 rounded">*/}
            {/*          {result}*/}
            {/*        </div>*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
          </CardContent>
        </Card>
      )}

      {customData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Automation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg ${customData.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${customData.success ? 'text-green-800' : 'text-red-800'}`}>
                {customData.message}
              </p>
              {customData.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  Page Title: {customData.title}
                </p>
              )}
            </div>

            {/* Screenshot Display */}
            {customData.screenshot && (
              <div className="space-y-2">
                <h4 className="font-medium">Screenshot:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={`data:image/png;base64,${customData.screenshot}`}
                    alt="Automation Screenshot"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `data:image/png;base64,${customData.screenshot}`;
                      link.download = `automation-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
                      link.click();
                    }}
                  >
                    Download Screenshot
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(`data:image/png;base64,${customData.screenshot}`);
                    }}
                  >
                    Copy Base64
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      )}
    </div>
  );
} 