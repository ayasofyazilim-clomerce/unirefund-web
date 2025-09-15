"use client";

import { useCallback, useMemo, useEffect, useRef } from "react";
import type { WidgetProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { AddressCombobox } from "./address-combobox";
import { useAddressData } from "./use-address-data";
import { AddressLanguageData } from "./types";

export function createAddressWidgets({ languageData }: { languageData: AddressLanguageData }) {
    return function AddressWidgets({ initialValue }: { initialValue?: { countryId?: string, adminAreaLevel1Id?: string, adminAreaLevel2Id?: string } } = {}) {
        const {
            countries,
            countriesLoading,
            countriesError,
            countriesSuccess,
            adminAreaLevel1Mutation,
            adminAreaLevel2Mutation,
            neighborhoodMutation,
            handleAdminAreaLevel1Search,
            handleAdminAreaLevel2Search,
            handleNeighborhoodSearch,
            resetDependentFields,
            hasDataChanged,
            forceRenderCounter,
            previousDataRef,
            countriesUpdatedAt,
        } = useAddressData();
        useEffect(() => {
            if (initialValue?.countryId) {
                handleAdminAreaLevel1Search(initialValue.countryId);
            }
            if (initialValue?.adminAreaLevel1Id) {
                handleAdminAreaLevel2Search(initialValue.adminAreaLevel1Id);
            }
            if (initialValue?.adminAreaLevel2Id) {
                handleNeighborhoodSearch(initialValue.adminAreaLevel2Id);
            }
        }, [
            initialValue?.countryId,
            initialValue?.adminAreaLevel1Id,
            initialValue?.adminAreaLevel2Id
        ]);

        const handleCountryChange = useCallback((widget: WidgetProps) => (val: string) => {
            resetDependentFields('country');
            widget.onChange(val);
            handleAdminAreaLevel1Search(val);
        }, [resetDependentFields, handleAdminAreaLevel1Search]);

        const handleAdminAreaLevel1Change = useCallback((widget: WidgetProps) => (adminAreaLevel1Id: string) => {
            resetDependentFields('adminAreaLevel1');
            widget.onChange(adminAreaLevel1Id);
            handleAdminAreaLevel2Search(adminAreaLevel1Id);
        }, [resetDependentFields, handleAdminAreaLevel2Search]);

        const handleAdminAreaLevel2Change = useCallback((widget: WidgetProps) => (adminAreaLevel2Id: string) => {
            resetDependentFields('adminAreaLevel2');
            widget.onChange(adminAreaLevel2Id);
            handleNeighborhoodSearch(adminAreaLevel2Id);
        }, [resetDependentFields, handleNeighborhoodSearch]);

        const schemaFormKey = useMemo(() => {
            let shouldForceRender = false;

            if (hasDataChanged(countries, previousDataRef.current.countries)) {
                previousDataRef.current.countries = [...countries];
                shouldForceRender = true;
            }
            const adminLevel1Data = adminAreaLevel1Mutation.data || [];
            if (hasDataChanged(adminLevel1Data, previousDataRef.current.adminAreaLevel1)) {
                previousDataRef.current.adminAreaLevel1 = [...adminLevel1Data];
                shouldForceRender = true;
            }
            const adminLevel2Data = adminAreaLevel2Mutation.data || [];
            if (hasDataChanged(adminLevel2Data, previousDataRef.current.adminAreaLevel2)) {
                previousDataRef.current.adminAreaLevel2 = [...adminLevel2Data];
                shouldForceRender = true;
            }
            const neighborhoodData = neighborhoodMutation.data || [];
            if (hasDataChanged(neighborhoodData, previousDataRef.current.neighborhoods)) {
                previousDataRef.current.neighborhoods = [...neighborhoodData];
                shouldForceRender = true;
            }

            const statusChanged =
                countriesSuccess ||
                adminAreaLevel1Mutation.isSuccess ||
                adminAreaLevel2Mutation.isSuccess ||
                neighborhoodMutation.isSuccess ||
                countriesError ||
                adminAreaLevel1Mutation.isError ||
                adminAreaLevel2Mutation.isError ||
                neighborhoodMutation.isError;

            if (shouldForceRender || statusChanged) {
                forceRenderCounter.current += 1;
            }

            return `address-schema-form-${forceRenderCounter.current}-${countriesUpdatedAt}-${Date.now()}`;
        }, [
            countries,
            adminAreaLevel1Mutation.data,
            adminAreaLevel2Mutation.data,
            neighborhoodMutation.data,
            countriesSuccess,
            adminAreaLevel1Mutation.isSuccess,
            adminAreaLevel2Mutation.isSuccess,
            neighborhoodMutation.isSuccess,
            countriesError,
            adminAreaLevel1Mutation.isError,
            adminAreaLevel2Mutation.isError,
            neighborhoodMutation.isError,
            countriesUpdatedAt,
            hasDataChanged,
            forceRenderCounter,
            previousDataRef
        ]);

        const widgets = {
            countryWidget: (widget: WidgetProps) => (
                <AddressCombobox
                    type="country"
                    isError={countriesError}
                    isPending={countriesLoading}
                    isSuccess={countriesSuccess && countries.length > 0}
                    list={countries}
                    selectLabel="name"
                    selectIdentifier="id"
                    onValueChange={handleCountryChange(widget)}
                    messages={{
                        disabled: languageData["country.disabled"],
                        error: languageData.error,
                        loading: languageData["country.loading"],
                        placeholder: languageData["country.placeholder"],
                        search: languageData["country.search"]
                    }}
                    {...widget}
                />
            ),
            adminAreaLevel1Widget: (widget: WidgetProps) => (
                <AddressCombobox
                    type="adminAreaLevel1"
                    isError={adminAreaLevel1Mutation.isError}
                    isPending={adminAreaLevel1Mutation.isPending}
                    isSuccess={adminAreaLevel1Mutation.isSuccess && (adminAreaLevel1Mutation.data?.length || 0) > 0}
                    list={adminAreaLevel1Mutation.data}
                    selectLabel="name"
                    selectIdentifier="id"
                    onValueChange={handleAdminAreaLevel1Change(widget)}
                    messages={{
                        disabled: languageData["adminAreaLevel1.disabled"],
                        error: languageData.error,
                        loading: languageData["adminAreaLevel1.loading"],
                        placeholder: languageData["adminAreaLevel1.placeholder"],
                        search: languageData["adminAreaLevel1.search"]
                    }}
                    {...widget}
                />
            ),
            adminAreaLevel2Widget: (widget: WidgetProps) => (
                <AddressCombobox
                    type="adminAreaLevel2"
                    isError={adminAreaLevel2Mutation.isError}
                    isPending={adminAreaLevel2Mutation.isPending}
                    isSuccess={adminAreaLevel2Mutation.isSuccess && (adminAreaLevel2Mutation.data?.length || 0) > 0}
                    list={adminAreaLevel2Mutation.data}
                    selectLabel="name"
                    selectIdentifier="id"
                    onValueChange={handleAdminAreaLevel2Change(widget)}
                    messages={{
                        disabled: languageData["adminAreaLevel2.disabled"],
                        error: languageData.error,
                        loading: languageData["adminAreaLevel2.loading"],
                        placeholder: languageData["adminAreaLevel2.placeholder"],
                        search: languageData["adminAreaLevel2.search"]
                    }}
                    {...widget}
                />
            ),
            neighborhoodWidget: (widget: WidgetProps) => (
                <AddressCombobox
                    type="neighborhood"
                    isError={neighborhoodMutation.isError}
                    isPending={neighborhoodMutation.isPending}
                    isSuccess={neighborhoodMutation.isSuccess && (neighborhoodMutation.data?.length || 0) > 0}
                    list={neighborhoodMutation.data}
                    selectLabel="name"
                    selectIdentifier="id"
                    onValueChange={widget.onChange}
                    messages={{
                        disabled: languageData["neighborhood.disabled"],
                        error: languageData.error,
                        loading: languageData["neighborhood.loading"],
                        placeholder: languageData["neighborhood.placeholder"],
                        search: languageData["neighborhood.search"]
                    }}
                    {...widget}
                />
            )
        };
        return {
            widgets,
            schemaFormKey,
            isLoading: countriesLoading || adminAreaLevel1Mutation.isPending || adminAreaLevel2Mutation.isPending || neighborhoodMutation.isPending,
            hasError: countriesError || adminAreaLevel1Mutation.isError || adminAreaLevel2Mutation.isError || neighborhoodMutation.isError,
        };
    };
}