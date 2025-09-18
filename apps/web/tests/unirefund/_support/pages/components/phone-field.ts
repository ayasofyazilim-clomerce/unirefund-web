import type {Page} from "@playwright/test";
import {byTestId} from "../../utils/form";
import {fillPhoneTR} from "../../utils/phone";

export class PhoneField {
  private by;
  constructor(private page: Page) {
    this.by = byTestId(page);
  }
  async fill(digits: string) {
    await fillPhoneTR(this.page, this.by("phone"), digits);
  }
}
