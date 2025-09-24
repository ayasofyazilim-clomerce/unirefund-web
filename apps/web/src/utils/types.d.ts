import "@repo/utils/auth";

declare module "@repo/utils/auth" {
  interface MyUser {
    sub?: string;
    CustomsId: string | string[];
    IndividualId: string | string[];
    MerchantId: string | string[];
    RefundPointId: string | string[];
    TaxFreeId: string | string[];
    TaxOfficeId: string | string[];
    TourGuideId: string | string[];
    TravellerId: string | string[];
  }
}
