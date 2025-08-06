import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { chromium } from "playwright";

export const automationRouter = router({
  executeHackerNews: publicProcedure
    .mutation(async () => {
      try {
        // Connect to the distributed grid instead of launching local browser
        const browser = await chromium.connect('ws://localhost:8080');
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Navigate to Hacker News
        await page.goto("https://news.ycombinator.com/");
        
        // Get the page title to verify we're on the right site
        const title = await page.title();
        
        // Take a screenshot for verification
        const screenshot = await page.screenshot({ fullPage: true });
        
        await context.close();
        await browser.close();
        
        return {
          success: true,
          message: "Successfully navigated to Hacker News using distributed grid",
          title,
          screenshot: screenshot.toString("base64"),
        };
      } catch (error) {
        return {
          success: false,
          message: `Error executing automation: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    }),

  // Add a health check for the distributed grid
  healthCheck: publicProcedure
    .query(async () => {
      try {
        const browser = await chromium.connect('ws://localhost:8080');
        await browser.close();
        return { 
          status: 'healthy', 
          gridUrl: 'ws://localhost:8080',
          message: 'Successfully connected to distributed grid'
        };
      } catch (error) {
        return { 
          status: 'unhealthy', 
          error: error instanceof Error ? error.message : "Unknown error",
          message: 'Failed to connect to distributed grid'
        };
      }
    }),

  // Add a more complex automation example
  executeCustomScript: publicProcedure
    .input(z.object({
      url: z.string().url(),
      actions: z.array(z.object({
        type: z.enum(['click', 'type', 'wait', 'screenshot', 'navigate']),
        label: z.string().optional(),
        value: z.string().optional(),
        url: z.string().optional(),
      }))
    }))
    .mutation(async ({ input }) => {
      console.log('inputtsss', input);
      try {
        const browser = await chromium.connect('ws://localhost:8080');
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto(input.url);
        
        const results = [];
        
        // Execute custom actions
        for (const action of input.actions) {
          switch (action.type) {
            case 'click':
              console.log('clicked something');
              if (action.label) {
                await page.locator('[name="btnK"]')
                  .first()
                  .click()
                results.push(`Clicked ${action.label}`);
              }
              break;
            case 'type':
              console.log('typed something', action.label);
              if (action.label && action.value) {
                console.log('typing.....');
                await page.getByTitle(action.label).fill(action.value);
                console.log('finished typing.....');
                results.push(`Typed "${action.value}" into ${action.label}`);
              }
              break;
            case 'wait':
              console.log('Waited 1 second');
              await page.waitForTimeout(1000);
              results.push('Waited 1 second');
              break;
            case 'navigate':
              if (action.url) {
                await page.goto(action.url);
                results.push(`Navigated to ${action.url}`);
              }
              break;
            case 'screenshot':
              const screenshot = await page.screenshot();
              results.push('Screenshot captured');
              return {
                success: true,
                message: "Custom script executed successfully with screenshot",
                results,
                screenshot: screenshot.toString("base64"),
              };
          }
        }
        
        await context.close();
        await browser.close();
        
        return { 
          success: true, 
          message: "Custom script executed successfully",
          results 
        };
      } catch (error) {
        return {
          success: false,
          message: `Error executing custom script: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    }),
}); 