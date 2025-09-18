import type {Page} from "@playwright/test";
import {byTestId, fillStable} from "../utils/form";
import {AddressSection} from "./components/address-section";
import {EmailSection} from "./components/email-section";
import {PhoneField} from "./components/phone-field";

export class MerchantFormPage {
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
    await this.page.goto("/en/parties/merchants/new");
  }
  async fillCore(name: string, chainCodeId: string, extStoreId: string, vat: string) {
    await fillStable(this.page, this.by("root_name"), name, {hard: true});
    await this.by("root_taxOfficeId").click();
    await this.by("root_taxOfficeId_0").click();
    await fillStable(this.page, this.by("root_chainCodeId"), chainCodeId);
    await fillStable(this.page, this.by("root_externalStoreIdentifier"), extStoreId);
    await this.by("root_isPersonalCompany").click();
    await fillStable(this.page, this.by("root_vatNumber"), vat);
  }
  async selectTypeWork() {
    await this.by("type-select").click();
    await this.by("type_2").click();
  }
  async submit() {
    await this.by("create-merchant-form_submit").click();
  }
}
