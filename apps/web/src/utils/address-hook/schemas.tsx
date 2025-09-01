"use client";
import {$UniRefund_LocationService_AddressCommonDatas_AddressCommonDataDto as AddressDto} from "@ayasofyazilim/saas/LocationService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {AutoFormInputComponentProps} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {createFieldConfigWithResource, CustomCombobox} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import type {WidgetProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {CustomCombobox as SchemaFormCustomCombobox} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {Dispatch, SetStateAction} from "react";
import type {AppLanguageDataResourceType} from "src/language-data/unirefund/language-data";
import type {CityDto, CountryDto, DistrictDto, NeighborhoodDto, RegionDto, SelectedAddressField} from "./types";
import {getCity, getDistrict, getNeighborhood, getRegion} from "./utils";

const AddressFormFields: AddressFormFieldsType[] = [
  "countryId",
  "regionId",
  "cityId",
  "districtId",
  "neighborhoodId",
  "addressLine",
  "postalCode",
];
export type AddressFormFieldsType =
  | "countryId"
  | "regionId"
  | "cityId"
  | "districtId"
  | "neighborhoodId"
  | "addressLine"
  | "postalCode";

export function getAddressFieldConfig(params: {
  cityList?: CityDto[];
  regionList?: RegionDto[];
  countryList?: CountryDto[];
  neighborhoodList?: NeighborhoodDto[];
  districtList?: DistrictDto[];
  languageData: AppLanguageDataResourceType;
}) {
  const fieldConfig = {
    cityId: {
      renderer: (props: AutoFormInputComponentProps) => (
        <CustomCombobox<CityDto>
          childrenProps={props}
          emptyValue={params.languageData["City.Select"]}
          list={params.cityList}
          selectIdentifier="id"
          selectLabel="name"
        />
      ),
    },
    districtId: {
      renderer: (props: AutoFormInputComponentProps) => (
        <CustomCombobox<DistrictDto>
          childrenProps={props}
          emptyValue={params.languageData["District.Select"]}
          list={params.districtList}
          selectIdentifier="id"
          selectLabel="name"
        />
      ),
    },
    neighborhoodId: {
      renderer: (props: AutoFormInputComponentProps) => (
        <CustomCombobox<NeighborhoodDto>
          childrenProps={props}
          emptyValue={params.languageData["Neighborhood.Select"]}
          list={params.neighborhoodList}
          selectIdentifier="id"
          selectLabel="name"
        />
      ),
    },
    countryId: {
      renderer: (props: AutoFormInputComponentProps) => (
        <CustomCombobox<CountryDto>
          childrenProps={props}
          emptyValue={params.languageData["Country.Select"]}
          list={params.countryList}
          selectIdentifier="id"
          selectLabel="name"
        />
      ),
    },
    regionId: {
      renderer: (props: AutoFormInputComponentProps) => (
        <CustomCombobox<RegionDto>
          childrenProps={props}
          emptyValue={params.languageData["Region.Select"]}
          list={params.regionList}
          selectIdentifier="id"
          selectLabel="name"
        />
      ),
    },
  };

  const translatedForm = createFieldConfigWithResource({
    schema: AddressDto,
    resources: params.languageData,
    name: "Form.address",
    extend: fieldConfig,
  });

  return translatedForm;
}

export function handleOnAddressValueChange({
  values,
  selectedFields,
  setSelectedFields,
  countryList = [],
  regionList,
  setRegionList,
  setCityList,
  // neighborhoodList,
  setNeighborhoodList,
  // districtList,
  setDistrictList,
  languageData,
}: {
  values: Record<string, string>;
  setCityList: Dispatch<SetStateAction<CityDto[] | undefined>>;
  setRegionList?: Dispatch<SetStateAction<RegionDto[] | undefined>>;
  countryList: CountryDto[];
  regionList?: RegionDto[];
  selectedFields: SelectedAddressField;
  setSelectedFields: Dispatch<SetStateAction<SelectedAddressField>>;
  neighborhoodList?: NeighborhoodDto[];
  setNeighborhoodList: Dispatch<SetStateAction<NeighborhoodDto[] | undefined>>;
  districtList?: DistrictDto[];
  setDistrictList: Dispatch<SetStateAction<DistrictDto[] | undefined>>;
  languageData: AppLanguageDataResourceType;
}) {
  const val = values as {
    [key in AddressFormFieldsType]: string;
  };

  if (setRegionList && val.countryId && val.countryId !== selectedFields.countryId) {
    setRegionList(undefined);
    setCityList(undefined);
    setDistrictList(undefined);
    setNeighborhoodList(undefined);
    setSelectedFields((current) => ({
      ...current,
      countryId: val.countryId,
      regionId: "",
      cityId: "",
      neighborhoodId: "",
    }));
    void getRegion({
      countryList,
      countryId: val.countryId,
      setRegionList,
      languageData,
    }).then((response) => {
      if (response) {
        setSelectedFields((current) => ({
          ...current,
          regionId: response,
        }));
        void getCity({regionId: response, setCityList, languageData});
      }
    });
  } else if (selectedFields.regionId && !regionList) {
    void getCity({regionId: val.regionId, setCityList, languageData});
  } else if (val.regionId && selectedFields.regionId === "" && regionList) {
    setSelectedFields((current) => ({
      ...current,
      regionId: val.regionId,
    }));
    void getCity({regionId: val.regionId, setCityList, languageData});
  } else if (val.cityId && val.cityId !== selectedFields.cityId) {
    setSelectedFields((current) => ({
      ...current,
      cityId: val.cityId,
    }));
    void getDistrict({cityId: val.cityId, setDistrictList, languageData});
  } else if (val.districtId && val.districtId !== selectedFields.districtId) {
    setSelectedFields((current) => ({
      ...current,
      districtId: val.districtId,
    }));
    void getNeighborhood({
      districtId: val.districtId,
      setNeighborhoodList,
      languageData,
    });
  } else if (val.neighborhoodId && val.neighborhoodId !== selectedFields.neighborhoodId) {
    setSelectedFields((current) => ({
      ...current,
      neighborhoodId: val.neighborhoodId,
    }));
  }
}
export function hideAddressFields(hideFields: AddressFormFieldsType[]) {
  return AddressFormFields.filter((field) => !hideFields.includes(field));
}

export function getAddressSchema(fields: AddressFormFieldsType[] = []) {
  const schema = createZodObject(AddressDto, fields);
  return schema;
}

export function getAddressSettingsForSchemaForm(params: {
  cityList?: CityDto[];
  regionList?: RegionDto[];
  countryList?: CountryDto[];
  neighborhoodList?: NeighborhoodDto[];
  districtList?: DistrictDto[];
  languageData: AppLanguageDataResourceType;
}) {
  const widgets = {
    cityId: (props: WidgetProps) => (
      <SchemaFormCustomCombobox<CityDto>
        {...props}
        emptyValue={params.languageData["adminAreaLevel1.label"]}
        label={params.languageData["adminAreaLevel1.label"]}
        list={params.cityList}
        selectIdentifier="id"
        selectLabel="name"
      />
    ),
    districtId: (props: WidgetProps) => (
      <SchemaFormCustomCombobox<DistrictDto>
        {...props}
        emptyValue={params.languageData["adminAreaLevel2.label"]}
        label={params.languageData["adminAreaLevel2.label"]}
        list={params.districtList}
        selectIdentifier="id"
        selectLabel="name"
      />
    ),
    neighborhoodId: (props: WidgetProps) => (
      <SchemaFormCustomCombobox<NeighborhoodDto>
        {...props}
        emptyValue={params.languageData["neighborhood.label"]}
        label={params.languageData["neighborhood.label"]}
        list={params.neighborhoodList}
        selectIdentifier="id"
        selectLabel="name"
      />
    ),
    countryId: (props: WidgetProps) => (
      <SchemaFormCustomCombobox<CountryDto>
        {...props}
        emptyValue={params.languageData["country.label"]}
        label={params.languageData["country.label"]}
        list={params.countryList}
        selectIdentifier="id"
        selectLabel="name"
      />
    ),
    regionId: (props: WidgetProps) => (
      <SchemaFormCustomCombobox<RegionDto>
        {...props}
        emptyValue={params.languageData["Select.EmptyValue"]}
        label={params.languageData["Select.EmptyValue"]}
        list={params.regionList}
        selectIdentifier="id"
        selectLabel="name"
      />
    ),
  };
  const uiSchema = {
    cityId: {
      "ui:widget": "cityId",
      "ui:title": params.languageData["adminAreaLevel1.label"],
    },
    neighborhoodId: {
      "ui:widget": "neighborhoodId",
      "ui:title": params.languageData["neighborhood.label"],
    },
    countryId: {
      "ui:widget": "countryId",
      "ui:title": params.languageData["country.label"],
    },
    regionId: {
      "ui:widget": "regionId",
      "ui:title": params.languageData["Select.EmptyValue"],
    },
  };
  return {widgets, uiSchema};
}
