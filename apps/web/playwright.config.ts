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
    // Setup projects for each environment
    {
      name: "setup-local",
      testMatch: "tests/core/auth/auth.setup.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_LOCAL_URL,
      },
    },
    {
      name: "setup-dev",
      testMatch: "tests/core/auth/auth.setup.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_DEV_URL,
      },
    },
    {
      name: "setup-uat",
      testMatch: "tests/core/auth/auth.setup.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_UAT_URL,
      },
    },
    // Test projects for each environment
    {
      name: "local",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_LOCAL_URL,
        trace: "on-first-retry",
        storageState: "apps/web/tests/core/auth.json",
      },
      dependencies: ["setup-local"],
    },
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_DEV_URL,
        trace: "on-first-retry",
        storageState: "apps/web/tests/core/auth.json",
      },
      dependencies: ["setup-dev"],
    },
    {
      name: "uat",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.TEST_UAT_URL,
        trace: "on-first-retry",
        storageState: "apps/web/tests/core/auth.json",
      },
      dependencies: ["setup-uat"],
    },
  ],
});
