import type {
  UniRefund_LocationService_AddressCommonDatas_AddressCommonDataUpdateDto,
  UniRefund_LocationService_Cities_CityDto,
  UniRefund_LocationService_Countries_CountryDto,
  UniRefund_LocationService_Districts_DistrictDto,
  UniRefund_LocationService_Neighborhoods_NeighborhoodDto,
  UniRefund_LocationService_Regions_RegionDto,
} from "@ayasofyazilim/saas/LocationService";

export type AddressUpdateDto = UniRefund_LocationService_AddressCommonDatas_AddressCommonDataUpdateDto;
export type CountryDto = UniRefund_LocationService_Countries_CountryDto;
export type RegionDto = UniRefund_LocationService_Regions_RegionDto;
export type CityDto = UniRefund_LocationService_Cities_CityDto;
export type NeighborhoodDto = UniRefund_LocationService_Neighborhoods_NeighborhoodDto;
export type DistrictDto = UniRefund_LocationService_Districts_DistrictDto;

export interface SelectedAddressField {
  countryId: string;
  regionId: string;
  cityId: string;
  neighborhoodId: string;
  districtId: string;
}
