"use client";

import { useMemo, useCallback } from "react";
import { AddressCombobox } from "./address-combobox";
import { useAddressData } from "./use-address-data";
import type { CascadingAddressFieldProps, AddressFieldValue } from "./types";
import { Label } from "@repo/ayasofyazilim-ui/atoms/label";
import { cn } from "../../utils";

export function CascadingAddressField({
    value,
    onChange,
    disabled = false,
    messages = {},
    className,
    showNeighborhood = true,
    labels = {}
}: CascadingAddressFieldProps) {
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
    } = useAddressData();

    // Handle country change
    const handleCountryChange = useCallback((countryId: string) => {
        resetDependentFields('country');
        const newValue: AddressFieldValue = {
            countryId,
            adminAreaLevel1Id: "",
            adminAreaLevel2Id: "",
            neighborhoodId: "",
        };
        onChange(newValue);
        handleAdminAreaLevel1Search(countryId);
    }, [onChange, resetDependentFields, handleAdminAreaLevel1Search]);

    // Handle admin area level 1 change
    const handleAdminAreaLevel1Change = useCallback((adminAreaLevel1Id: string) => {
        resetDependentFields('adminAreaLevel1');
        const newValue: AddressFieldValue = {
            ...value,
            adminAreaLevel1Id,
            adminAreaLevel2Id: "",
            neighborhoodId: "",
        };
        onChange(newValue);
        handleAdminAreaLevel2Search(adminAreaLevel1Id);
    }, [value, onChange, resetDependentFields, handleAdminAreaLevel2Search]);

    // Handle admin area level 2 change
    const handleAdminAreaLevel2Change = useCallback((adminAreaLevel2Id: string) => {
        resetDependentFields('adminAreaLevel2');
        const newValue: AddressFieldValue = {
            ...value,
            adminAreaLevel2Id,
            neighborhoodId: "",
        };
        onChange(newValue);
        if (showNeighborhood) {
            handleNeighborhoodSearch(adminAreaLevel2Id);
        }
    }, [value, onChange, resetDependentFields, handleNeighborhoodSearch, showNeighborhood]);

    // Handle neighborhood change
    const handleNeighborhoodChange = useCallback((neighborhoodId: string) => {
        const newValue: AddressFieldValue = {
            ...value,
            neighborhoodId,
        };
        onChange(newValue);
    }, [value, onChange]);

    // Generate unique key for re-rendering
    const componentKey = useMemo(() => {
        return `address-${countries.length}-${adminAreaLevel1Mutation.data?.length || 0}-${adminAreaLevel2Mutation.data?.length || 0}-${neighborhoodMutation.data?.length || 0}-${Date.now()}`;
    }, [
        countries.length,
        adminAreaLevel1Mutation.data?.length,
        adminAreaLevel2Mutation.data?.length,
        neighborhoodMutation.data?.length,
    ]);

    return (
        <div key={componentKey} className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
            {/* Country */}
            <div className="space-y-2">
                {labels.country && <Label htmlFor="country" data-testid="country-label" className="text-sm font-medium">{labels.country}</Label>}
                <AddressCombobox
                    id="country"
                    type="country"
                    isError={countriesError}
                    isPending={countriesLoading}
                    isSuccess={countriesSuccess && countries.length > 0}
                    list={countries}
                    selectLabel="name"
                    selectIdentifier="id"
                    value={value.countryId || ""}
                    onValueChange={handleCountryChange}
                    disabled={disabled}
                    messages={messages.country}
                />
            </div>

            {/* Admin Area Level 1 (State/Province) */}
            <div className="space-y-2">
                {labels.adminAreaLevel1 && <Label htmlFor="adminAreaLevel1" data-testid="adminAreaLevel1-label" className="text-sm font-medium">{labels.adminAreaLevel1}</Label>}
                <AddressCombobox
                    id="adminAreaLevel1"
                    type="adminAreaLevel1"
                    isError={adminAreaLevel1Mutation.isError}
                    isPending={adminAreaLevel1Mutation.isPending}
                    isSuccess={adminAreaLevel1Mutation.isSuccess && (adminAreaLevel1Mutation.data?.length || 0) > 0}
                    list={adminAreaLevel1Mutation.data}
                    selectLabel="name"
                    selectIdentifier="id"
                    value={value.adminAreaLevel1Id || ""}
                    onValueChange={handleAdminAreaLevel1Change}
                    disabled={disabled || !value.countryId}
                    messages={messages.adminAreaLevel1}
                />
            </div>

            {/* Admin Area Level 2 (City) */}
            <div className="space-y-2">
                {labels.adminAreaLevel2 && <Label htmlFor="adminAreaLevel2" data-testid="adminAreaLevel2-label" className="text-sm font-medium">{labels.adminAreaLevel2}</Label>}
                <AddressCombobox
                    id="adminAreaLevel2"
                    type="adminAreaLevel2"
                    isError={adminAreaLevel2Mutation.isError}
                    isPending={adminAreaLevel2Mutation.isPending}
                    isSuccess={adminAreaLevel2Mutation.isSuccess && (adminAreaLevel2Mutation.data?.length || 0) > 0}
                    list={adminAreaLevel2Mutation.data}
                    selectLabel="name"
                    selectIdentifier="id"
                    value={value.adminAreaLevel2Id || ""}
                    onValueChange={handleAdminAreaLevel2Change}
                    disabled={disabled || !value.adminAreaLevel1Id}
                    messages={messages.adminAreaLevel2}
                />
            </div>

            {/* Neighborhood (optional) */}
            {showNeighborhood && (
                <div className="space-y-2">
                    {labels.neighborhood && <Label htmlFor="neighborhood" data-testid="neighborhood-label" className="text-sm font-medium">{labels.neighborhood}</Label>}
                    <AddressCombobox
                        id="neighborhood"
                        type="neighborhood"
                        isError={neighborhoodMutation.isError}
                        isPending={neighborhoodMutation.isPending}
                        isSuccess={neighborhoodMutation.isSuccess && (neighborhoodMutation.data?.length || 0) > 0}
                        list={neighborhoodMutation.data}
                        selectLabel="name"
                        selectIdentifier="id"
                        value={value.neighborhoodId || ""}
                        onValueChange={handleNeighborhoodChange}
                        disabled={disabled || !value.adminAreaLevel2Id}
                        messages={messages.neighborhood}
                    />
                </div>
            )}
        </div>
    );
}