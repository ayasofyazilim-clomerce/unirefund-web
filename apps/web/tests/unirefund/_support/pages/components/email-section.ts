import type {Page} from "@playwright/test";
import {byTestId, fillStable} from "../../utils/form";

export class EmailSection {
  private by;
  constructor(private page: Page) {
    this.by = byTestId(page);
  }
  async fill(workEmail: string) {
    await fillStable(this.page, this.by("root_email_emailAddress"), workEmail);
    await this.by("root_email_type").click();
    await this.by("root_email_type_WORK").click();
  }
}
