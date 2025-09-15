import type {
    UniRefund_CRMService_AdminAreaLevel1_AdminAreaLevel1Dto,
    UniRefund_CRMService_AdminAreaLevel2_AdminAreaLevel2Dto,
    UniRefund_CRMService_Countries_CountryDto,
    UniRefund_CRMService_Neighborhoods_NeighborhoodDto
} from "@repo/saas/CRMService";

export type AddressData =
    | UniRefund_CRMService_Countries_CountryDto
    | UniRefund_CRMService_AdminAreaLevel1_AdminAreaLevel1Dto
    | UniRefund_CRMService_AdminAreaLevel2_AdminAreaLevel2Dto
    | UniRefund_CRMService_Neighborhoods_NeighborhoodDto;

export interface AddressFieldMessages {
    error?: string;
    loading?: string;
    disabled?: string;
    placeholder?: string;
    search?: string;
}

export interface AddressFieldValue {
    countryId?: string;
    adminAreaLevel1Id?: string;
    adminAreaLevel2Id?: string;
    neighborhoodId?: string;
}

export interface CascadingAddressFieldProps {
    value: AddressFieldValue;
    onChange: (value: AddressFieldValue) => void;
    disabled?: boolean;
    messages?: {
        country?: AddressFieldMessages;
        adminAreaLevel1?: AddressFieldMessages;
        adminAreaLevel2?: AddressFieldMessages;
        neighborhood?: AddressFieldMessages;
    };
    className?: string;
    showNeighborhood?: boolean;
    labels?: {
        country?: string;
        adminAreaLevel1?: string;
        adminAreaLevel2?: string;
        neighborhood?: string;
    };
}
export interface AddressLanguageData {
    "country.label": string;
    "country.placeholder": string;
    "country.loading": string;
    "country.disabled": string;
    "country.search": string;

    "adminAreaLevel1.label": string;
    "adminAreaLevel1.placeholder": string;
    "adminAreaLevel1.loading": string;
    "adminAreaLevel1.disabled": string;
    "adminAreaLevel1.search": string;

    "adminAreaLevel2.label": string;
    "adminAreaLevel2.placeholder": string;
    "adminAreaLevel2.loading": string;
    "adminAreaLevel2.disabled": string;
    "adminAreaLevel2.search": string;

    "neighborhood.label": string;
    "neighborhood.placeholder": string;
    "neighborhood.loading": string;
    "neighborhood.disabled": string;
    "neighborhood.search": string;
}