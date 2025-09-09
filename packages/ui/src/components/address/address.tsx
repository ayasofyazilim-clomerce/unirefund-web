"use client";

import { Alert, AlertDescription } from "@repo/ayasofyazilim-ui/atoms/alert";
import { Badge } from "@repo/ayasofyazilim-ui/atoms/badge";
import { Button } from "@repo/ayasofyazilim-ui/atoms/button";
import { Combobox } from "@repo/ayasofyazilim-ui/molecules/combobox";
import { MapPin } from "lucide-react";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  useAddressData,
  type AdminAreaLevel1,
  type AdminAreaLevel2,
  type Country,
  type Neighborhood,
} from "../../../../actions/unirefund/CrmService/address-hook"; // Adjust the import path as necessary
import { cn } from "../../utils";

export interface AddressSelectorProps {
  onAddressChange?: (location: SelectedAddress) => void;
  initialValues?: Partial<SelectedAddress>;
  disabled?: boolean;
  className?: string;
  showDebug?: boolean; // Optional prop to control debug info display
  showBreadcrumb?: boolean; // Optional prop to control breadcrumb display
  languageData?: {
    "country.label": string;
    "adminAreaLevel1.label": string;
    "adminAreaLevel2.label": string;
    "neighborhood.label": string;

    "country.emptyMessage": string;

    "adminAreaLevel1.emptyMessage.default": string;
    "adminAreaLevel2.emptyMessage.default": string;
    "neighborhood.emptyMessage.default": string;

    "adminAreaLevel1.emptyMessage.disabled": string;
    "adminAreaLevel2.emptyMessage.disabled": string;
    "neighborhood.emptyMessage.disabled": string;

    "country.searchPlaceholder": string;
    "adminAreaLevel1.searchPlaceholder": string;
    "adminAreaLevel2.searchPlaceholder": string;
    "neighborhood.searchPlaceholder": string;

    "country.searchResultLabel": string;
    "adminAreaLevel1.searchResultLabel": string;
    "adminAreaLevel2.searchResultLabel": string;
    "neighborhood.searchResultLabel": string;
  };
  children?: React.ReactNode; // Optional children prop for additional content
  required?: string[]
}

interface SelectedAddress {
  countryId?: string;
  adminAreaLevel1Id?: string;
  adminAreaLevel2Id?: string;
  neighborhoodId?: string;
}

// ==================== CONSTANTS ====================

const SEARCH_PLACEHOLDERS = {
  COUNTRY: "Search countries...",
  ADMIN_AREA_LEVEL_1: "Search states/provinces...",
  ADMIN_AREA_LEVEL_2: "Search cities/districts...",
  NEIGHBORHOODS: "Search neighborhoods...",
} as const;

const EMPTY_MESSAGES = {
  COUNTRY: "Choose a country.",
  ADMIN_AREA_LEVEL_1: {
    DEFAULT: "Select a state/province",
    DISABLED: "First select a country.",
  },
  ADMIN_AREA_LEVEL_2: {
    DEFAULT: "Select a city/district",
    DISABLED: "First select a state/province.",
  },
  NEIGHBORHOODS: {
    DEFAULT: "Select a neighborhood",
    DISABLED: "First select a city/district.",
  },
} as const;

const SEARCH_RESULT_LABELS = {
  COUNTRY: "No countries found.",
  ADMIN_AREA_LEVEL_1: "No states/provinces found.",
  ADMIN_AREA_LEVEL_2: "No cities/districts found.",
  NEIGHBORHOODS: "No neighborhoods found.",
} as const;

const hasValidData = <T extends { id?: string; name?: string | null }>(data: T[] | null): boolean => {
  return data !== null && data.length > 0;
};

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorDisplay = memo<ErrorDisplayProps>(({ error, onRetry, onDismiss }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertDescription className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-2 h-7 text-xs">
            Try Again
          </Button>
        )}
      </div>
      <Button onClick={onDismiss} variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0" aria-label="Dismiss error">
        ×
      </Button>
    </AlertDescription>
  </Alert>
));

ErrorDisplay.displayName = "ErrorDisplay";

interface AddressBreadcrumbProps {
  selectedAddress: SelectedAddress;
  countries: Country[] | null;
  adminAreaLevel1: AdminAreaLevel1[] | null;
  adminAreaLevel2: AdminAreaLevel2[] | null;
  neighborhoods: Neighborhood[] | null;
}

const AddressBreadcrumb = memo<AddressBreadcrumbProps>(
  ({ selectedAddress, countries, adminAreaLevel1, adminAreaLevel2, neighborhoods }) => {
    const breadcrumbItems: string[] = [];

    if (selectedAddress.countryId) {
      const country = countries?.find((c) => c.id === selectedAddress.countryId);
      if (country?.name) breadcrumbItems.push(country.name);
    }

    if (selectedAddress.adminAreaLevel1Id) {
      const area1 = adminAreaLevel1?.find((a) => a.id === selectedAddress.adminAreaLevel1Id);
      if (area1?.name) breadcrumbItems.push(area1.name);
    }

    if (selectedAddress.adminAreaLevel2Id) {
      const area2 = adminAreaLevel2?.find((a) => a.id === selectedAddress.adminAreaLevel2Id);
      if (area2?.name) breadcrumbItems.push(area2.name);
    }

    if (selectedAddress.neighborhoodId) {
      const neighborhood = neighborhoods?.find((n) => n.id === selectedAddress.neighborhoodId);
      if (neighborhood?.name) breadcrumbItems.push(neighborhood.name);
    }

    if (breadcrumbItems.length === 0) return null;

    return (
      <div className="bg-muted/50 flex items-center gap-2 rounded-lg p-3">
        <MapPin className="text-muted-foreground h-4 w-4" />
        <div className="flex flex-wrap items-center gap-1">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <Badge variant="secondary" className="text-xs">
                {item}
              </Badge>
              {index < breadcrumbItems.length - 1 && <span className="text-muted-foreground">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  },
);

AddressBreadcrumb.displayName = "AddressBreadcrumb";

const AddressSelector: React.FC<AddressSelectorProps> = memo(
  ({
    onAddressChange,
    initialValues,
    disabled = false,
    className = "",
    showDebug = false,
    showBreadcrumb = false,
    languageData,
    required = []
  }) => {
    const {
      // Loading states
      isLoading,
      // Error state
      error,
      hasError,

      countriesLoading,
      adminAreaLevel1Loading,
      adminAreaLevel2Loading,
      neighborhoodsLoading,
      // Data
      countries,
      adminAreaLevel1,
      adminAreaLevel2,
      neighborhoods,

      // Actions
      fetchCountries,
      fetchAdminAreaLevel1,
      fetchAdminAreaLevel2,
      fetchNeighborhoods,

      // Reset functions
      resetAdminAreaLevel1,
      resetAdminAreaLevel2,
      resetNeighborhoods,

      // Utility functions
      clearError,
      retryLastFailedRequest,
    } = useAddressData();

    // ==================== LOCAL STATE ====================

    const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>({
      countryId: initialValues?.countryId,
      adminAreaLevel1Id: initialValues?.adminAreaLevel1Id,
      adminAreaLevel2Id: initialValues?.adminAreaLevel2Id,
      neighborhoodId: initialValues?.neighborhoodId,
    });

    // ==================== EFFECTS ====================

    // Load initial data
    useEffect(() => {
      fetchCountries();
    }, [fetchCountries]);

    // Load initial dependent data if initial values are provided
    useEffect(() => {
      if (initialValues?.countryId && !adminAreaLevel1) {
        fetchAdminAreaLevel1(initialValues.countryId);
      }
    }, [initialValues?.countryId, adminAreaLevel1, fetchAdminAreaLevel1]);

    useEffect(() => {
      if (initialValues?.adminAreaLevel1Id && !adminAreaLevel2) {
        fetchAdminAreaLevel2(initialValues.adminAreaLevel1Id);
      }
    }, [initialValues?.adminAreaLevel1Id, adminAreaLevel2, fetchAdminAreaLevel2]);

    useEffect(() => {
      if (initialValues?.adminAreaLevel2Id && !neighborhoods) {
        fetchNeighborhoods(initialValues.adminAreaLevel2Id);
      }
    }, [initialValues?.adminAreaLevel2Id, neighborhoods, fetchNeighborhoods]);

    // Notify parent of location changes
    useEffect(() => {
      onAddressChange?.(selectedAddress);
    }, [selectedAddress, onAddressChange]);

    // ==================== EVENT HANDLERS ====================

    const handleCountryChange = useCallback(
      async (countryId: string) => {
        setSelectedAddress((prev) => ({
          ...prev,
          countryId,
          adminAreaLevel1Id: undefined,
          adminAreaLevel2Id: undefined,
          neighborhoodId: undefined,
        }));

        if (!countryId) {
          resetAdminAreaLevel1();
          return;
        }

        resetAdminAreaLevel1();
        await fetchAdminAreaLevel1(countryId);
      },
      [fetchAdminAreaLevel1, resetAdminAreaLevel1],
    );

    const handleAdminAreaLevel1Change = useCallback(
      async (adminAreaLevel1Id: string) => {
        setSelectedAddress((prev) => ({
          ...prev,
          adminAreaLevel1Id,
          adminAreaLevel2Id: undefined,
          neighborhoodId: undefined,
        }));

        if (!adminAreaLevel1Id) {
          resetAdminAreaLevel2();
          return;
        }

        resetAdminAreaLevel2();
        await fetchAdminAreaLevel2(adminAreaLevel1Id);
      },
      [fetchAdminAreaLevel2, resetAdminAreaLevel2],
    );

    const handleAdminAreaLevel2Change = useCallback(
      async (adminAreaLevel2Id: string) => {
        setSelectedAddress((prev) => ({
          ...prev,
          adminAreaLevel2Id,
          neighborhoodId: undefined,
        }));

        if (!adminAreaLevel2Id) {
          resetNeighborhoods();
          return;
        }

        resetNeighborhoods();
        await fetchNeighborhoods(adminAreaLevel2Id);
      },
      [fetchNeighborhoods, resetNeighborhoods],
    );

    const handleNeighborhoodChange = useCallback((neighborhoodId: string) => {
      setSelectedAddress((prev) => ({
        ...prev,
        neighborhoodId,
      }));
    }, []);

    return (
      <div className={cn("space-y-6", className)}>
        {/* Error Display */}
        {hasError && <ErrorDisplay error={error!} onRetry={retryLastFailedRequest} onDismiss={clearError} />}

        {/* Address Breadcrumb */}
        {showBreadcrumb && (
          <AddressBreadcrumb
            selectedAddress={selectedAddress}
            countries={countries}
            adminAreaLevel1={adminAreaLevel1}
            adminAreaLevel2={adminAreaLevel2}
            neighborhoods={neighborhoods}
          />
        )}

        {/* Form Fields */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Country Selection */}
          <Combobox<Country>
            id="country"
            selectIdentifier="id"
            selectLabel="name"
            required={required.includes("countryId")}
            classNames={{ label: "text-slate-600" }}
            label={languageData?.["country.label"] || "Country"}
            value={countries?.find((n) => n.id === selectedAddress.countryId)}
            list={countries}
            disabled={disabled || countriesLoading || !hasValidData(countries)}
            onValueChange={(value) => {
              handleCountryChange(value?.id || "");
            }}
            searchResultLabel={languageData?.["country.searchResultLabel"] || SEARCH_RESULT_LABELS.COUNTRY}
            searchPlaceholder={languageData?.["country.searchPlaceholder"] || SEARCH_PLACEHOLDERS.COUNTRY}
            emptyValue={languageData?.["country.emptyMessage"] || EMPTY_MESSAGES.COUNTRY}
          />

          {/* Admin Area Level 1 Selection */}
          <Combobox<AdminAreaLevel1>
            id="adminAreaLevel1"
            selectIdentifier="id"
            selectLabel="name"
            required={required.includes("adminAreaLevel1Id")}
            classNames={{ label: "text-slate-600" }}
            label={languageData?.["adminAreaLevel1.label"] || "State/Province"}
            value={adminAreaLevel1?.find((n) => n.id === selectedAddress.adminAreaLevel1Id)}
            list={adminAreaLevel1}
            disabled={disabled || adminAreaLevel1Loading || !hasValidData(adminAreaLevel1)}
            onValueChange={(value) => {
              handleAdminAreaLevel1Change(value?.id || "");
            }}
            searchResultLabel={
              languageData?.["adminAreaLevel1.searchResultLabel"] || SEARCH_RESULT_LABELS.ADMIN_AREA_LEVEL_1
            }
            searchPlaceholder={
              languageData?.["adminAreaLevel1.searchPlaceholder"] || SEARCH_PLACEHOLDERS.ADMIN_AREA_LEVEL_1
            }
            emptyValue={
              !selectedAddress.countryId
                ? languageData?.["adminAreaLevel1.emptyMessage.disabled"] || EMPTY_MESSAGES.ADMIN_AREA_LEVEL_1.DISABLED
                : languageData?.["adminAreaLevel1.emptyMessage.default"] || EMPTY_MESSAGES.ADMIN_AREA_LEVEL_1.DEFAULT
            }
          />

          {/* Admin Area Level 2 Selection */}
          <Combobox<AdminAreaLevel2>
            id="adminAreaLevel2"
            selectIdentifier="id"
            selectLabel="name"
            required={required.includes("adminAreaLevel2Id")}
            classNames={{ label: "text-slate-600" }}
            label={languageData?.["adminAreaLevel2.label"] || "State/Province"}
            value={adminAreaLevel2?.find((n) => n.id === selectedAddress.adminAreaLevel2Id)}
            list={adminAreaLevel2}
            disabled={disabled || adminAreaLevel2Loading || !hasValidData(adminAreaLevel2)}
            onValueChange={(value) => {
              handleAdminAreaLevel2Change(value?.id || "");
            }}
            searchResultLabel={
              languageData?.["adminAreaLevel2.searchResultLabel"] || SEARCH_RESULT_LABELS.ADMIN_AREA_LEVEL_2
            }
            searchPlaceholder={
              languageData?.["adminAreaLevel2.searchPlaceholder"] || SEARCH_PLACEHOLDERS.ADMIN_AREA_LEVEL_2
            }
            emptyValue={
              !selectedAddress.adminAreaLevel1Id
                ? languageData?.["adminAreaLevel2.emptyMessage.disabled"] || EMPTY_MESSAGES.ADMIN_AREA_LEVEL_2.DISABLED
                : languageData?.["adminAreaLevel2.emptyMessage.default"] || EMPTY_MESSAGES.ADMIN_AREA_LEVEL_2.DEFAULT
            }
          />

          {/* Neighborhood Selection */}
          <Combobox<Neighborhood>
            id="neighborhood"
            selectIdentifier="id"
            selectLabel="name"
            required={required.includes("neighborhoodId")}
            classNames={{ label: "text-slate-600" }}
            label={languageData?.["neighborhood.label"] || "Neighborhood"}
            value={neighborhoods?.find((n) => n.id === selectedAddress.neighborhoodId)}
            list={neighborhoods}
            disabled={disabled || neighborhoodsLoading || !hasValidData(neighborhoods)}
            onValueChange={(value) => {
              handleNeighborhoodChange(value?.id || "");
            }}
            searchResultLabel={languageData?.["neighborhood.searchResultLabel"] || SEARCH_RESULT_LABELS.NEIGHBORHOODS}
            searchPlaceholder={languageData?.["neighborhood.searchPlaceholder"] || SEARCH_PLACEHOLDERS.NEIGHBORHOODS}
            emptyValue={
              !selectedAddress.adminAreaLevel2Id
                ? languageData?.["neighborhood.emptyMessage.disabled"] || EMPTY_MESSAGES.NEIGHBORHOODS.DISABLED
                : languageData?.["neighborhood.emptyMessage.default"] || EMPTY_MESSAGES.NEIGHBORHOODS.DEFAULT
            }
          />
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && showDebug && (
          <details className="mt-6">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
              Debug Information
            </summary>
            <pre className="bg-muted mt-2 overflow-auto rounded-lg p-3 font-mono text-xs">
              {JSON.stringify(
                {
                  selectedAddress,
                  hasError,
                  isLoading,
                  dataStatus: {
                    countries: countries?.length || 0,
                    adminAreaLevel1: adminAreaLevel1?.length || 0,
                    adminAreaLevel2: adminAreaLevel2?.length || 0,
                    neighborhoods: neighborhoods?.length || 0,
                  },
                },
                null,
                2,
              )}
            </pre>
          </details>
        )}
      </div>
    );
  },
);

AddressSelector.displayName = "AddressSelector";

export default AddressSelector;
