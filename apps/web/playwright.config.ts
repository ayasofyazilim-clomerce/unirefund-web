import path from "node:path";
import {defineConfig, devices} from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({path: path.resolve(__dirname, ".env")});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  // Ortam = Project (Chromium)
  projects: [
    {
      name: "local",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_LOCAL_URL ?? "http://localhost:3000",
        trace: "on-first-retry",
      },
    },
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_DEV_URL ?? "http://localhost:3000",
        trace: "on-first-retry",
      },
    },
    {
      name: "uat",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_UAT_URL ?? "http://localhost:3000",
        trace: "on-first-retry",
      },
    },
  ],

  // İstersen app’i otomatik ayağa kaldır:
  // webServer: {
  //   command: "npm run dev",
  //   url: process.env.LOCAL_URL ?? "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
});
