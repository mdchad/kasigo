import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { chromium } from "playwright";

export const automationRouter = router({
  executeHackerNews: publicProcedure
    .mutation(async () => {
      try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Navigate to Hacker News
        await page.goto("https://news.ycombinator.com/");
        
        // Get the page title to verify we're on the right site
        const title = await page.title();
        
        // Take a screenshot for verification
        const screenshot = await page.screenshot({ fullPage: true });
        
        await browser.close();
        
        return {
          success: true,
          message: "Successfully navigated to Hacker News",
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
}); 