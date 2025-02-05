import {PhoneNumberUtil} from "google-libphonenumber";

export const isPhoneValid = (phone: string) => {
  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const phoneNumber = phoneUtil.parseAndKeepRawInput(phone);

    return phoneUtil.isValidNumber(phoneNumber);
  } catch (error) {
    return false;
  }
};
export const splitPhone = (phone: string) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const phoneNumber = phoneUtil.parseAndKeepRawInput(phone);
  const format = phoneUtil.formatOutOfCountryCallingNumber(phoneNumber).split("+")[1];
  const ituCountryCode = format.split(" ")[0];
  const phoneNumberWithoutCountryCode = format.substring(ituCountryCode.length + 1);
  const areaCode = phoneNumberWithoutCountryCode.includes("-")
    ? phoneNumberWithoutCountryCode.split("-")[0]
    : phoneNumberWithoutCountryCode.split(" ")[0];

  const phoneData = {
    ituCountryCode,
    areaCode,
    localNumber: phoneNumberWithoutCountryCode
      .substring(areaCode.length + 1)
      .replaceAll(" ", "")
      .replaceAll("-", ""),
  };
  return phoneData;
};
