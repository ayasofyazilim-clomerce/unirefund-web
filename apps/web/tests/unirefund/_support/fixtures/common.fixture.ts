// tests/unirefund/_support/fixtures/common.fixture.ts
import {test as base, type Locator} from "@playwright/test";
import {byTestId, fillStable} from "../utils/form";
import {fillPhoneTR} from "../utils/phone";
import {randDigits, randGuidLike} from "../utils/rand";

type Helpers = {
  by: (id: string) => Locator;
  fillStable: typeof fillStable;
  fillPhoneTR: typeof fillPhoneTR;
  randDigits: typeof randDigits;
  randGuidLike: typeof randGuidLike;
};

export const test = base.extend<{h: Helpers; by: (id: string) => Locator}>({
  // "h" toplu yardımcılar
  h: async ({page}, use) => {
    const helpers: Helpers = {
      by: (id: string) => byTestId(page)(id),
      fillStable,
      fillPhoneTR,
      randDigits,
      randGuidLike,
    };
    await use(helpers);
  },
  // "by" tek başına da mevcut (geri uyumluluk)
  by: async ({page}, use) => {
    await use(byTestId(page));
  },
});

export const expect = test.expect;
