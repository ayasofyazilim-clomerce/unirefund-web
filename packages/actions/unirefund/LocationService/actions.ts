"use server";

import type {
  GetApiLocationServiceCitiesData,
  GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
  GetApiLocationServiceCountriesData,
  GetApiLocationServiceCurrenciesData,
  GetApiLocationServiceDistrictsGetListByCityByCityIdData,
  GetApiLocationServiceNeighborhoodsGetListByDistrictByDistrictIdData,
  GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
} from "@repo/saas/LocationService";
import { structuredError, structuredResponse, structuredSuccessResponse } from "@repo/utils/api";
import type { Session } from "@repo/utils/auth";
import { getLocationServiceClient } from "../lib";

export async function getAllCountriesApi(data: GetApiLocationServiceCountriesData, session?: Session | null) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.country.getApiLocationServiceCountries({
      ...data,
      maxResultCount: 250,
      sorting: "name",
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
export async function getRegionsByCountryIdApi(
  data: GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
  session?: Session | null,
) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.region.getApiLocationServiceRegionsGetListByCountryByCountryId(data);

    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getDefaultRegionsByCountryIdApi(
  data: GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
  session?: Session | null,
) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.region.getApiLocationServiceRegionsGetDefaultRegionIdByCountryId(data);

    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getCitiesByRegionId(
  data: GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
  session?: Session | null,
) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.city.getApiLocationServiceCitiesGetListByRegionByRegionId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getCitiesApi(data: GetApiLocationServiceCitiesData = {}, session?: Session | null) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.city.getApiLocationServiceCities(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getDistrictsByCityIdApi(
  data: GetApiLocationServiceDistrictsGetListByCityByCityIdData,
  session?: Session | null,
) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.district.getApiLocationServiceDistrictsGetListByCityByCityId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}
export async function getNeighborhoodsByDistrictIdApi(
  data: GetApiLocationServiceNeighborhoodsGetListByDistrictByDistrictIdData,
  session?: Session | null,
) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response =
      await locationClient.neighborhood.getApiLocationServiceNeighborhoodsGetListByDistrictByDistrictId(data);
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getCurrencyApi(data: GetApiLocationServiceCurrenciesData, session?: Session | null) {
  try {
    const locationClient = await getLocationServiceClient(session);
    const response = await locationClient.currency.getApiLocationServiceCurrencies({
      ...data,
      maxResultCount: 250,
    });
    return structuredSuccessResponse(response);
  } catch (error) {
    throw structuredError(error);
  }
}
