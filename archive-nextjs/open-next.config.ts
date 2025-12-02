// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Minimal, non-interactive config.
  // Add overrides later (R2 incremental cache, D1 tag cache, DO queues) as needed.
});

