import type {Page} from "@playwright/test";
import {expect} from "@playwright/test";

type ToastType = "success" | "error" | "warning" | "info";

export async function expectNewToastAfter(
  page: Page,
  action: () => Promise<void>,
  {
    text = /Updated successfully/i,
    type = "success",
    timeout = 7000,
    waitDisappear = false,
    postSuccessDelayMs = 150,
  }: {
    text?: RegExp | string;
    type?: ToastType;
    timeout?: number;
    waitDisappear?: boolean;
    postSuccessDelayMs?: number;
  } = {},
) {
  const toastSelector = "[data-sonner-toast]";
  const toasts = page.locator(toastSelector);

  const getState = async () => {
    const count = await toasts.count();
    const signature = await page.evaluate((sel: string) => {
      const nodes = Array.from(document.querySelectorAll(sel));
      return nodes
        .map((n) => {
          const el = n as HTMLElement;
          const t = n.querySelector("[data-title]")?.textContent?.trim() || "";
          const ty = el.getAttribute("data-type") || "";
          return `${ty}::${t}`;
        })
        .join("||");
    }, toastSelector);
    return {count, signature};
  };

  const waitForChange = async (prevCount: number, prevSig: string) => {
    await page.waitForFunction(
      (state: {sel: string; prevCount: number; prevSig: string}) => {
        const nodes = Array.from(document.querySelectorAll(state.sel));
        const count = nodes.length;
        const sig = nodes
          .map((n) => {
            const el = n as HTMLElement;
            const t = n.querySelector("[data-title]")?.textContent?.trim() || "";
            const ty = el.getAttribute("data-type") || "";
            return `${ty}::${t}`;
          })
          .join("||");
        return count > state.prevCount || sig !== state.prevSig;
      },
      {sel: toastSelector, prevCount, prevSig},
      {timeout},
    );
  };

  const matchesText = (val: string | null, expected: RegExp | string) => {
    if (!val) return false;
    if (expected instanceof RegExp) {
      return expected.test(val);
    }
    return val.includes(expected);
  };

  const attempt = async (): Promise<boolean> => {
    const before = await getState();
    const waiter = waitForChange(before.count, before.signature);
    await action();
    await waiter;

    const newToast = toasts.last();
    await expect(newToast).toBeVisible({timeout});

    const handle = await newToast.elementHandle();
    if (!handle) throw new Error("Toast handle alınamadı");

    const toastType = await handle.getAttribute("data-type");
    const titleEl = await handle.$("[data-title]");
    const toastText = titleEl ? (await titleEl.textContent())?.trim() ?? "" : "";

    const ok = toastType === type && matchesText(toastText, text);

    if (ok) {
      if (waitDisappear) {
        await newToast.waitFor({state: "detached", timeout: 5000}).catch(async () => {
          await expect(newToast).toHaveAttribute("data-removed", "true", {timeout: 5000});
        });
      } else if (postSuccessDelayMs > 0) {
        await page.waitForTimeout(postSuccessDelayMs);
      }
      return true;
    }

    await page.waitForTimeout(250);
    return false;
  };

  if (await attempt()) return;
  if (await attempt()) return;

  throw new Error("expectNewToastAfter: 2 denemede de beklenen toast (type/text) gelmedi.");
}
