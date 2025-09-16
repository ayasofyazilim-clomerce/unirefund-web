"use server";
import type {GetApiRefundServiceRefundsData} from "@repo/saas/RefundService";
import {structuredSuccessResponse, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {isUnauthorized} from "@repo/utils/policies";
import {getRefundServiceClient} from "../lib";

export async function getRefundApi(data: GetApiRefundServiceRefundsData = {}, session?: Session | null) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds", "RefundService.Refunds.View"],
    lang: "en",
  });
  try {
    const client = await getRefundServiceClient(session);
    const response = await client.refund.getApiRefundServiceRefunds(data);
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRefundDetailByIdApi(id: string, session?: Session | null) {
  await isUnauthorized({
    requiredPolicies: ["RefundService.Refunds.Detail", "RefundService.Refunds.View"],
    lang: "en",
  });
  try {
    const client = await getRefundServiceClient(session);
    const response = await client.refund.getApiRefundServiceRefundsByIdDetail({id});
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}

// Payment method types
export type ApiFieldValueAllowed = {
  key: string;
  name: string;
};

export type ApiField = {
  key: string;
  name: string;
  type: "text" | "select";
  required: boolean;
  example?: string;
  minLength?: number;
  maxLength?: number;
  validationRegexp?: string;
  displayFormat?: string;
  refreshRequirementsOnChange?: boolean;
  valuesAllowed?: ApiFieldValueAllowed[];
};

export type ApiFieldGroup = {
  name: string;
  group: ApiField[];
};

export type ApiMethod = {
  type: string;
  title: string;
  usageInfo?: string;
  fields: ApiFieldGroup[];
};

export async function getPaymentMethodRequirementsApi(paymentMethod: string) {
  try {
    // Define payment method data based on the payment method type
    let methodData: ApiMethod[] = [];

    switch (paymentMethod) {
      case "bank_account":
        methodData = [
          {
            type: "local_bank",
            title: "PaymentMethods.LocalBank.Title",
            usageInfo: "PaymentMethods.LocalBank.UsageInfo",
            fields: [
              {
                name: "PaymentMethods.AccountHolderInformation",
                group: [
                  {
                    key: "accountHolderName",
                    name: "PaymentMethods.AccountHolderName",
                    type: "text",
                    required: true,
                    example: "John Doe",
                    minLength: 2,
                    maxLength: 100,
                    validationRegexp: "^[a-zA-Z\\s.'-]+$",
                  },
                  {
                    key: "legalType",
                    name: "PaymentMethods.AccountType",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "PRIVATE", name: "PaymentMethods.PersonalAccount"},
                      {key: "BUSINESS", name: "PaymentMethods.BusinessAccount"},
                    ],
                  },
                ],
              },
              {
                name: "PaymentMethods.BankDetails",
                group: [
                  {
                    key: "bankName",
                    name: "PaymentMethods.BankName",
                    type: "text",
                    required: true,
                    example: "Example Bank",
                    minLength: 2,
                    maxLength: 100,
                  },
                  {
                    key: "accountNumber",
                    name: "PaymentMethods.AccountNumber",
                    type: "text",
                    required: true,
                    example: "1234567890",
                    minLength: 8,
                    maxLength: 20,
                    validationRegexp: "^\\d{8,20}$",
                  },
                  {
                    key: "routingNumber",
                    name: "PaymentMethods.RoutingNumber",
                    type: "text",
                    required: true,
                    example: "021000021",
                    minLength: 6,
                    maxLength: 12,
                    validationRegexp: "^\\d{6,12}$",
                  },
                ],
              },
            ],
          },
        ];
        break;

      case "credit_card":
        methodData = [
          {
            type: "credit_card",
            title: "PaymentMethods.CreditCard.Title",
            usageInfo: "PaymentMethods.CreditCard.UsageInfo",
            fields: [
              {
                name: "PaymentMethods.CardInformation",
                group: [
                  {
                    key: "cardNumber",
                    name: "PaymentMethods.CardNumber",
                    type: "text",
                    required: true,
                    displayFormat: "**** **** **** ****",
                    example: "4111111111111111",
                    minLength: 13,
                    maxLength: 19,
                    validationRegexp: "^[0-9]{13,19}$",
                  },
                  {
                    key: "expiryMonth",
                    name: "PaymentMethods.ExpiryMonth",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "01", name: "01 - January"},
                      {key: "02", name: "02 - February"},
                      {key: "03", name: "03 - March"},
                      {key: "04", name: "04 - April"},
                      {key: "05", name: "05 - May"},
                      {key: "06", name: "06 - June"},
                      {key: "07", name: "07 - July"},
                      {key: "08", name: "08 - August"},
                      {key: "09", name: "09 - September"},
                      {key: "10", name: "10 - October"},
                      {key: "11", name: "11 - November"},
                      {key: "12", name: "12 - December"},
                    ],
                  },
                  {
                    key: "expiryYear",
                    name: "PaymentMethods.ExpiryYear",
                    type: "select",
                    required: true,
                    valuesAllowed: Array.from({length: 15}, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return {key: year.toString(), name: year.toString()};
                    }),
                  },
                  {
                    key: "cvv",
                    name: "PaymentMethods.CVV",
                    type: "text",
                    required: true,
                    example: "123",
                    minLength: 3,
                    maxLength: 4,
                    validationRegexp: "^[0-9]{3,4}$",
                  },
                ],
              },
              {
                name: "PaymentMethods.CardholderInformation",
                group: [
                  {
                    key: "cardholderName",
                    name: "PaymentMethods.CardholderName",
                    type: "text",
                    required: true,
                    example: "John Doe",
                    minLength: 2,
                    maxLength: 100,
                    validationRegexp: "^[a-zA-Z\\s.'-]+$",
                  },
                  {
                    key: "billingAddress",
                    name: "PaymentMethods.BillingAddress",
                    type: "text",
                    required: true,
                    example: "123 Main Street",
                    minLength: 5,
                    maxLength: 200,
                  },
                  {
                    key: "billingCity",
                    name: "PaymentMethods.City",
                    type: "text",
                    required: true,
                    example: "New York",
                    minLength: 2,
                    maxLength: 100,
                  },
                  {
                    key: "billingPostalCode",
                    name: "PaymentMethods.PostalCode",
                    type: "text",
                    required: true,
                    example: "10001",
                    minLength: 3,
                    maxLength: 20,
                  },
                  {
                    key: "billingCountry",
                    name: "PaymentMethods.Country",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "US", name: "United States"},
                      {key: "CA", name: "Canada"},
                      {key: "GB", name: "United Kingdom"},
                      {key: "DE", name: "Germany"},
                      {key: "FR", name: "France"},
                      {key: "TR", name: "Turkey"},
                      // Add more countries as needed
                    ],
                  },
                ],
              },
            ],
          },
        ];
        break;

      case "paypal":
        methodData = [
          {
            type: "paypal",
            title: "PaymentMethods.PayPal.Title",
            usageInfo: "PaymentMethods.PayPal.UsageInfo",
            fields: [
              {
                name: "PaymentMethods.PayPalAccount",
                group: [
                  {
                    key: "paypalEmail",
                    name: "PaymentMethods.PayPalEmailAddress",
                    type: "text",
                    required: true,
                    example: "john.doe@example.com",
                    validationRegexp: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                  },
                  {
                    key: "accountType",
                    name: "PaymentMethods.AccountType",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "PERSONAL", name: "PaymentMethods.PersonalAccount"},
                      {key: "BUSINESS", name: "PaymentMethods.BusinessAccount"},
                    ],
                  },
                ],
              },
              {
                name: "PaymentMethods.AccountHolderInformation",
                group: [
                  {
                    key: "firstName",
                    name: "PaymentMethods.FirstName",
                    type: "text",
                    required: true,
                    example: "John",
                    minLength: 1,
                    maxLength: 50,
                    validationRegexp: "^[a-zA-Z\\s'-]+$",
                  },
                  {
                    key: "lastName",
                    name: "PaymentMethods.LastName",
                    type: "text",
                    required: true,
                    example: "Doe",
                    minLength: 1,
                    maxLength: 50,
                    validationRegexp: "^[a-zA-Z\\s'-]+$",
                  },
                  {
                    key: "phoneNumber",
                    name: "PaymentMethods.PhoneNumberOptional",
                    type: "text",
                    required: false,
                    example: "+1234567890",
                    validationRegexp: "^\\+?[1-9]\\d{1,14}$",
                  },
                ],
              },
            ],
          },
        ];
        break;

      case "wechat":
        methodData = [
          {
            type: "wechat",
            title: "PaymentMethods.WeChat.Title",
            usageInfo: "PaymentMethods.WeChat.UsageInfo",
            fields: [
              {
                name: "PaymentMethods.WeChatAccount",
                group: [
                  {
                    key: "wechatId",
                    name: "PaymentMethods.WeChatID",
                    type: "text",
                    required: true,
                    example: "wechat_user_123",
                    minLength: 3,
                    maxLength: 50,
                    validationRegexp: "^[a-zA-Z0-9_-]+$",
                  },
                  {
                    key: "phoneNumber",
                    name: "PaymentMethods.PhoneNumber",
                    type: "text",
                    required: true,
                    example: "+8613800000000",
                    validationRegexp: "^\\+?[1-9]\\d{1,14}$",
                  },
                  {
                    key: "verificationMethod",
                    name: "PaymentMethods.VerificationMethod",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "SMS", name: "PaymentMethods.SMSVerification"},
                      {key: "QR_CODE", name: "PaymentMethods.QRCodeVerification"},
                    ],
                  },
                ],
              },
              {
                name: "PaymentMethods.AccountHolderInformation",
                group: [
                  {
                    key: "realName",
                    name: "PaymentMethods.RealName",
                    type: "text",
                    required: true,
                    example: "张三",
                    minLength: 2,
                    maxLength: 100,
                  },
                  {
                    key: "idNumber",
                    name: "PaymentMethods.IDNumberOptional",
                    type: "text",
                    required: false,
                    example: "310101199001011234",
                    minLength: 15,
                    maxLength: 20,
                  },
                  {
                    key: "region",
                    name: "PaymentMethods.Region",
                    type: "select",
                    required: true,
                    valuesAllowed: [
                      {key: "CN", name: "PaymentMethods.ChinaMainland"},
                      {key: "HK", name: "PaymentMethods.HongKong"},
                      {key: "TW", name: "PaymentMethods.Taiwan"},
                      {key: "MO", name: "PaymentMethods.Macau"},
                    ],
                  },
                ],
              },
            ],
          },
        ];
        break;

      default:
        methodData = [];
    }

    return {ok: true, status: 200, data: methodData};
  } catch (error) {
    return {ok: false, status: 500, data: null as any, error: "network_error"};
  }
}
