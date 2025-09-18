import type {Page} from "@playwright/test";
import {byTestId, fillStable} from "../utils/form";
import {AddressSection} from "./components/address-section";
import {EmailSection} from "./components/email-section";
import {PhoneField} from "./components/phone-field";

export class TaxOfficeFormPage {
  by;
  address;
  email;
  phone;
  constructor(private page: Page) {
    this.by = byTestId(page);
    this.address = new AddressSection(page);
    this.email = new EmailSection(page);
    this.phone = new PhoneField(page);
  }
  async goto() {
    await this.page.goto("/en/parties/tax-offices/new");
  }
  async fillCore(name: string, extStoreId: string, vat: string) {
    await fillStable(this.page, this.by("root_name"), name, {hard: true});
    await fillStable(this.page, this.by("root_externalStoreIdentifier"), extStoreId);
    await fillStable(this.page, this.by("root_vatNumber"), vat);
  }
  async selectTypeWork() {
    await this.by("type-select").click();
    await this.by("type_2").click();
  }
  async submit() {
    await this.by("create-tax-office-form_submit").click();
  }
}
