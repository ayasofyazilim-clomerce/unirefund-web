import {useState, useEffect} from "react";
import type {AppLanguageDataResourceType} from "src/language-data/unirefund/language-data";
import type {CityDto, CountryDto, DistrictDto, NeighborhoodDto, RegionDto, SelectedAddressField} from "./types";
import type {AddressFormFieldsType} from "./schemas";
import {
  getAddressFieldConfig,
  getAddressSchema,
  getAddressSettingsForSchemaForm,
  handleOnAddressValueChange,
  hideAddressFields,
} from "./schemas";
import {getAddressList} from "./utils";

export function useAddressHook({
  countryList,
  selectedFieldsDefaultValue,
  fieldsToHideInAddressSchema,
  languageData,
}: {
  countryList: CountryDto[];
  selectedFieldsDefaultValue: SelectedAddressField;
  fieldsToHideInAddressSchema: AddressFormFieldsType[];
  languageData: AppLanguageDataResourceType;
}) {
  const [selectedFields, setSelectedFields] = useState<SelectedAddressField>(selectedFieldsDefaultValue);
  const [cityList, setCityList] = useState<CityDto[] | undefined>(undefined);
  const [districtList, setDistrictList] = useState<DistrictDto[] | undefined>(undefined);
  const [neighborhoodList, setNeighborhoodList] = useState<NeighborhoodDto[] | undefined>(undefined);
  const [regionList, setRegionList] = useState<RegionDto[] | undefined>(undefined);

  if (!regionList || regionList.length === 0) {
    fieldsToHideInAddressSchema.push("regionId");
  }
  const addressFieldsToShow = hideAddressFields(fieldsToHideInAddressSchema);
  const addressSchema = getAddressSchema(addressFieldsToShow);

  const addressSchemaFieldConfig = getAddressFieldConfig({
    cityList,
    regionList,
    countryList,
    languageData,
    neighborhoodList,
    districtList,
  });
  const addressSettings = getAddressSettingsForSchemaForm({
    cityList,
    districtList,
    neighborhoodList,
    regionList,
    countryList,
    languageData,
  });

  useEffect(() => {
    getAddressList({
      countryId: selectedFields.countryId,
      regionId: selectedFields.regionId,
      cityId: selectedFields.cityId,
      districtId: selectedFields.districtId,
      languageData,
      countryList,
      setCityList,
      setDistrictList,
      setNeighborhoodList,
      setRegionList,
    });
  }, []);

  function onAddressValueChanged(val: Record<string, string> | Record<string, Record<string, string>>) {
    let values: Record<string, string>;
    if ("address" in val) {
      values = val.address as Record<string, string>;
    } else {
      values = val as Record<string, string>;
    }
    handleOnAddressValueChange({
      selectedFields,
      setSelectedFields,
      countryList,
      regionList,
      values,
      setRegionList,
      setCityList,
      setNeighborhoodList,
      setDistrictList,
      languageData,
    });
  }
  return {
    addressSchema,
    addressSchemaFieldConfig,
    setRegionList,
    onAddressValueChanged,
    addressFieldsToShow,
    selectedFields,
    addressSettings,
  };
}
