import {
  $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto,
  $UniRefund_CRMService_Organizations_UpdateOrganizationDto,
  $UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto,
  $UniRefund_LocationService_AddressCommonDatas_AddressCommonDataUpdateDto,
} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
export const UpdateOrganizationDto = $UniRefund_CRMService_Organizations_UpdateOrganizationDto;
export const UpdateTelephoneTypeDto = $UniRefund_CRMService_TelephoneTypes_UpdateTelephoneTypeDto;
export const UpdateAddressTypeDto = $UniRefund_LocationService_AddressCommonDatas_AddressCommonDataUpdateDto;
export const UpdateEmailCommonDataDto = $UniRefund_CRMService_EmailCommonDatas_UpdateEmailCommonDataDto;

// re-usable schema sub-positions to prevent repeated code
const TelephoneSubPosition = ["localNumber", "typeCode"];
const AddressSubPosition = ["countryId", "regionId", "cityId", "postalCode", "addressLine", "type"];
const EmailSubPosition = ["emailAddress", "typeCode"];
export const ContactFormSubPositions = {
  telephone: TelephoneSubPosition,
  address: AddressSubPosition,
  email: EmailSubPosition,
};

// re-usable schemas to prevent repeated code
export const emailSchema = createZodObject(UpdateEmailCommonDataDto, ContactFormSubPositions.email);
export const telephoneSchema = createZodObject(UpdateTelephoneTypeDto, ContactFormSubPositions.telephone);

export const addressSchema = createZodObject(UpdateAddressTypeDto, ContactFormSubPositions.address);

export const addressSchemaByData = (
  countriesEnum: {name: string; id: string}[],
  citiesEnum: {name: string; id: string}[],
  hide: string[],
) => {
  const convertors = {
    country: {
      type: "enum",
      data: countriesEnum.map((i) => i.name),
    },
    city: {
      type: "enum",
      data: citiesEnum.map((i) => i.name),
    },
  };
  const subPositions = AddressSubPosition.filter((i) => !hide.includes(i));
  const schema = createZodObject(UpdateAddressTypeDto, subPositions, convertors);
  return {
    subPositions,
    convertors,
    schema,
  };
};

export type telephoneTypeCodes = "HOME" | "OFFICE" | "MOBILE" | "FAX";

export type addressTypeCodes = "HOME" | "OFFICE";

export type emailTypeCodes = "WORK" | "PERSONAL";
