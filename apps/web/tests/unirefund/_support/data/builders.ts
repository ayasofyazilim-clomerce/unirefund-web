import {randDigits, randGuidLike} from "../utils/rand";

export function buildUniqueName(prefix = "Mavi") {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${prefix}-${unique}`;
}

export function buildMerchantData() {
  return {
    name: buildUniqueName("Mavi"),
    chainCodeId: randGuidLike(),
    externalId: randDigits(9),
    vat: randDigits(10),
    phone: "5445444444",
    email: "admin@abp.io",
    address: {
      country: "türkiye",
      admin1: "adıyaman",
      admin2: "merkez",
      line: "adıyaman",
      postal: "41410",
    },
  };
}

export function buildTaxOfficeData() {
  return {
    name: buildUniqueName("Mavi"),
    externalId: randDigits(9),
    vat: randDigits(10),
    phone: "5455454545",
    email: "admin@abp.io",
    address: {
      country: "türkiye",
      admin1: "adıyaman",
      admin2: "merkez",
      line: "lorem ipsum",
      postal: "41700",
    },
  };
}
