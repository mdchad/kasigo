import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import { Kernel } from "@onkernel/sdk";
import {chromium} from "playwright";

const createBrowserSchema = z.object({
  headless: z.boolean().optional(),
  stealth: z.boolean().optional(),
  persistence_id: z.string().optional(),
});

const browserIdSchema = z.object({
  id: z.string(),
});

const persistenceIdSchema = z.object({
  persistence_id: z.string(),
});

// Initialize OnKernel SDK
const client = new Kernel({
  apiKey: process.env.KERNEL_API_KEY!,
});

export const onkernelRouter = router({
  createBrowser: publicProcedure
    .input(createBrowserSchema)
    .mutation(async ({ input }) => {
      try {
        const kernelBrowser = await client.browsers.create({
          headless: input.headless || false,
          stealth: input.stealth || false,
          persistence: input.persistence_id ? { id: input.persistence_id } : undefined,
        });

        const browser = await chromium.connectOverCDP(kernelBrowser.cdp_ws_url);

        try {
          const context = await browser.contexts()[0] || (await browser.newContext());
          const page = await context.pages()[0] || (await context.newPage());

          // await page.exposeFunction('onUserEvent', (eventData) => {
          //   console.log(`🎯 User ${eventData.type}:`, {
          //     element: eventData.element,
          //     position: eventData.position,
          //     timestamp: eventData.timestamp,
          //     key: eventData.key,
          //     url: eventData.url
          //   });
          // });


          await page.addInitScript(() => {
            // Minimal, native-looking code
            const events = ['click', 'keydown', 'input'];
            events.forEach(type => {
              document.addEventListener(type, (e) => {
                // Use standard console.log instead of custom functions
                console.log('USER_EVENT:' + JSON.stringify({
                  type: e.type,
                  outerHTML: e.target.outerHTML,
                  x: e.clientX || 0,
                  y: e.clientY || 0,
                  timestamp: Date.now()
                }));
              }, true);
            });
          });

// Listen via console monitoring
          page.on('console', (msg) => {
            if (msg.text().startsWith('USER_EVENT:')) {
              const eventData = JSON.parse(msg.text().replace('USER_EVENT:', ''));
              console.log('Captured event:', eventData);
            }
          });

          await page.goto("https://google.com/");
          const title = await page.title();

        } catch (error) {
          console.error(error);
        }

        return {
          id: kernelBrowser.session_id,
          browser_live_view_url: kernelBrowser.browser_live_view_url,
          cdp_ws_url: kernelBrowser.cdp_ws_url,
          persistence_id: input.persistence_id,
        };
      } catch (error) {
        throw new Error(`Failed to create browser session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  getBrowser: publicProcedure
    .input(browserIdSchema)
    .query(async ({ input }) => {
      try {
        const browser = await client.browsers.retrieve(input.id);

        return {
          id: browser.session_id,
          browser_live_view_url: browser.browser_live_view_url,
        };
      } catch (error) {
        throw new Error(`Failed to get browser session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  deleteBrowser: publicProcedure
    .input(persistenceIdSchema)
    .mutation(async ({ input }) => {
      try {
        // Use direct API call instead of SDK

        const browser = await client.browsers.delete({ persistent_id: input.persistence_id });

        return { success: true };
      } catch (error) {
        throw new Error(`Failed to delete browser session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  listBrowsers: publicProcedure
    .query(async () => {
      try {
        const browsers = await client.browsers.list();



        return { success: true, browsers };
        // return response.data.map((browser: any) => ({
        //   id: browser.id,
        //   browser_live_view_url: browser.browser_live_view_url,
        //   status: browser.status,
        //   created_at: browser.created_at,
        //   persistence_id: browser.persistence_id,
        // }));
      } catch (error) {
        throw new Error(`Failed to list browser sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
}); 