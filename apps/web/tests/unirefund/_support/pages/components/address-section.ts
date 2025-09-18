import type {Page} from "@playwright/test";
import {byTestId, fillStable} from "../../utils/form";

export class AddressSection {
  private by;
  constructor(private page: Page) {
    this.by = byTestId(page);
  }
  async selectCountry(nameLower: string) {
    await this.by("root_address_countryId-trigger").click();
    await this.page.locator(`[data-value="${nameLower}"]`).click();
  }
  async selectAdmin1(nameLower: string) {
    await this.by("root_address_adminAreaLevel1Id-trigger").click();
    await this.page.locator(`[data-value="${nameLower}"]`).click();
  }
  async selectAdmin2(nameLower: string) {
    await this.by("root_address_adminAreaLevel2Id-trigger").click();
    await this.page.locator(`[data-value="${nameLower}"]`).click();
  }
  async fillLineAndPostal(line: string, postal: string) {
    await fillStable(this.page, this.by("root_address_addressLine"), line);
    await fillStable(this.page, this.by("root_address_postalCode"), postal);
  }
  async setTypeWork() {
    await this.by("root_address_type").click();
    await this.by("root_address_type_WORK").click();
  }
}
