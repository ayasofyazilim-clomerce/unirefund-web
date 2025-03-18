"use client";

import {toast} from "@/components/ui/sonner";
import type {Dispatch, SetStateAction} from "react";
import {
  getCitiesByRegionId,
  getDefaultRegionsByCountryIdApi,
  getDistrictsByCityIdApi,
  getNeighborhoodsByDistrictIdApi,
  getRegionsByCountryIdApi,
} from "@repo/actions/unirefund/LocationService/actions";
import type {AppLanguageDataResourceType} from "src/language-data/unirefund/language-data";
import type {CityDto, CountryDto, DistrictDto, NeighborhoodDto, RegionDto} from "./types";

export async function getRegion({
  countryList,
  countryId,
  setRegionList,
  languageData,
}: {
  countryList: CountryDto[];
  countryId: string;
  setRegionList: Dispatch<SetStateAction<RegionDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  const selectedCountry = countryList.find((country) => country.id === countryId);
  if (selectedCountry?.hasRegion) {
    const regions = await getRegionsByCountryIdApi({
      countryId,
    });
    if (regions.type !== "success") {
      setRegionList([]);
      toast.error(`location/utils: ${languageData["Fetch.Fail"]}`);
      return false;
    }
    setRegionList(regions.data);
  } else {
    const regions = await getDefaultRegionsByCountryIdApi({
      countryId,
    });
    setRegionList([]);
    if (regions.type !== "success") {
      toast.error(`location/utils/region: ${languageData["Fetch.Fail"]}`);
      return false;
    }
    return regions.data;
  }
  return false;
}
export async function getCity({
  regionId,
  setCityList,
  languageData,
}: {
  regionId: string;
  setCityList: Dispatch<SetStateAction<CityDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  const cities = await getCitiesByRegionId({regionId});
  if (cities.type === "success") {
    setCityList(cities.data);
    return;
  }
  setCityList([]);
  toast.error(`location/utils/city: ${languageData["Fetch.Fail"]}`);
}
export async function getDistrict({
  cityId,
  setDistrictList,
  languageData,
}: {
  cityId: string;
  setDistrictList: Dispatch<SetStateAction<DistrictDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  const districts = await getDistrictsByCityIdApi({cityId});
  if (districts.type === "success") {
    setDistrictList(districts.data);
    return;
  }
  setDistrictList([]);
  toast.error(`location/utils/district: ${languageData["Fetch.Fail"]}`);
}
export async function getNeighborhood({
  districtId,
  setNeighborhoodList,
  languageData,
}: {
  districtId: string;
  setNeighborhoodList: Dispatch<SetStateAction<NeighborhoodDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  const neighborhoods = await getNeighborhoodsByDistrictIdApi({districtId});
  if (neighborhoods.type === "success") {
    setNeighborhoodList(neighborhoods.data);
    return;
  }
  setNeighborhoodList([]);
  toast.error(`location/utils/neighborhood: ${languageData["Fetch.Fail"]}`);
}
export function getAddressList({
  countryList,
  countryId,
  districtId,
  regionId,
  setRegionList,
  setCityList,
  setDistrictList,
  setNeighborhoodList,
  cityId,
  languageData,
}: {
  countryList: CountryDto[];
  countryId: string;
  regionId?: string;
  cityId?: string;
  districtId?: string;
  setRegionList: Dispatch<SetStateAction<RegionDto[] | undefined>>;
  setCityList: Dispatch<SetStateAction<CityDto[] | undefined>>;
  setDistrictList: Dispatch<SetStateAction<DistrictDto[] | undefined>>;
  setNeighborhoodList: Dispatch<SetStateAction<NeighborhoodDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  if (countryId) {
    void getRegion({
      countryList,
      countryId,
      setRegionList,
      languageData,
    });
  }
  if (regionId) {
    void getCity({regionId, setCityList, languageData});
  }
  if (cityId) {
    void getDistrict({cityId, setDistrictList, languageData});
  }
  if (districtId) {
    void getNeighborhood({
      districtId,
      setNeighborhoodList,
      languageData,
    });
  }
}
