import type {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useCallback, useEffect, useRef, useState} from "react";
import {
  getAdminAreaLevel1ByCountryIdApi,
  getAdminAreaLevel2ByAdminAreaLevel1IdApi,
  getCountriesApi,
  getNeighborhoodsByAdminAreaLevel2IdApi,
} from "./actions"; // Update with your actual path

import type {
  UniRefund_CRMService_AdminAreaLevel1_AdminAreaLevel1Dto as AdminAreaLevel1,
  UniRefund_CRMService_AdminAreaLevel2_AdminAreaLevel2Dto as AdminAreaLevel2,
  UniRefund_CRMService_Countries_CountryDto as Country,
  UniRefund_CRMService_Neighborhoods_NeighborhoodDto as Neighborhood,
} from "@repo/saas/CRMService"; // Update with your actual path

export type {AdminAreaLevel1, AdminAreaLevel2, Country, Neighborhood};
// Updated to match your actual API response structure
export interface ApiSuccessResponse<T> {
  type: "success";
  data: T;
  message: string;
}

export interface ApiErrorServerResponse {
  type: "api-error";
  data: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorServerResponse;

interface LoadingStates {
  readonly countriesLoading: boolean;
  readonly adminAreaLevel1Loading: boolean;
  readonly adminAreaLevel2Loading: boolean;
  readonly neighborhoodsLoading: boolean;
}

interface DataStates {
  readonly countries: Country[] | null;
  readonly adminAreaLevel1: AdminAreaLevel1[] | null;
  readonly adminAreaLevel2: AdminAreaLevel2[] | null;
  readonly neighborhoods: Neighborhood[] | null;
}

interface ActionMethods {
  readonly fetchCountries: () => Promise<Country[] | null>;
  readonly fetchAdminAreaLevel1: (countryId: string) => Promise<AdminAreaLevel1[] | null>;
  readonly fetchAdminAreaLevel2: (adminAreaLevel1Id: string) => Promise<AdminAreaLevel2[] | null>;
  readonly fetchNeighborhoods: (adminAreaLevel2Id: string) => Promise<Neighborhood[] | null>;
}

interface ResetMethods {
  readonly resetAdminAreaLevel1: () => void;
  readonly resetAdminAreaLevel2: () => void;
  readonly resetNeighborhoods: () => void;
  readonly resetAll: () => void;
}

interface UtilityMethods {
  readonly clearError: () => void;
  readonly retryLastFailedRequest: () => Promise<void>;
}

export interface UseAddressDataReturn extends LoadingStates, DataStates, ActionMethods, ResetMethods, UtilityMethods {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly hasError: boolean;
}

// ==================== CONSTANTS ====================

const LOADING_STATES_INITIAL: LoadingStates = {
  countriesLoading: false,
  adminAreaLevel1Loading: false,
  adminAreaLevel2Loading: false,
  neighborhoodsLoading: false,
} as const;

const DATA_STATES_INITIAL: DataStates = {
  countries: null,
  adminAreaLevel1: null,
  adminAreaLevel2: null,
  neighborhoods: null,
} as const;

// ==================== ENUMS ====================

enum LoadingStateKey {
  COUNTRIES = "countriesLoading",
  ADMIN_AREA_LEVEL_1 = "adminAreaLevel1Loading",
  ADMIN_AREA_LEVEL_2 = "adminAreaLevel2Loading",
  NEIGHBORHOODS = "neighborhoodsLoading",
}

enum ErrorMessages {
  FETCH_COUNTRIES = "Failed to fetch countries",
  FETCH_ADMIN_AREA_LEVEL_1 = "Failed to fetch states/provinces",
  FETCH_ADMIN_AREA_LEVEL_2 = "Failed to fetch cities/districts",
  FETCH_NEIGHBORHOODS = "Failed to fetch neighborhoods",
  INVALID_PARAMETER = "Invalid parameter provided",
  NETWORK_ERROR = "Network error occurred",
}

// ==================== CUSTOM HOOK ====================

// Fixed version of your useAddressData hook
// The main issue was circular dependency in retry functions

export const useAddressData = (): UseAddressDataReturn => {
  // ==================== STATE MANAGEMENT ====================

  const {data: session} = useSession();
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(LOADING_STATES_INITIAL);
  const [dataStates, setDataStates] = useState<DataStates>(DATA_STATES_INITIAL);
  const [error, setError] = useState<string | null>(null);

  // ==================== REFS FOR CLEANUP & RETRY ====================

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFailedRequestRef = useRef<(() => Promise<void>) | null>(null);

  // ==================== CLEANUP ON UNMOUNT ====================

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ==================== COMPUTED VALUES ====================

  const isLoading = Object.values(loadingStates).some(Boolean);
  const hasError = error !== null;

  // ==================== UTILITY FUNCTIONS ====================

  const validateParameter = useCallback((param: string | undefined, paramName: string): boolean => {
    if (!param || typeof param !== "string" || param.trim().length === 0) {
      setError(`${ErrorMessages.INVALID_PARAMETER}: ${paramName}`);
      return false;
    }
    return true;
  }, []);

  const setLoadingState = useCallback((loadingKey: LoadingStateKey, loading: boolean): void => {
    setLoadingStates((prev) => ({
      ...prev,
      [loadingKey]: loading,
    }));
  }, []);

  const setDataState = useCallback(<T extends keyof DataStates>(level: T, data: DataStates[T]): void => {
    // if (!mountedRef.current) return;

    setDataStates((prev) => ({
      ...prev,
      [level]: data,
    }));
  }, []);

  const handleApiCall = useCallback(
    async <T>(
      apiCall: (session?: Session | null) => Promise<ApiResponse<T>>,
      loadingKey: LoadingStateKey,
      errorMessage: ErrorMessages,
      onSuccess: (data: T) => void,
    ): Promise<T | null> => {
      try {
        // Cancel any previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoadingState(loadingKey, true);
        setError(null);

        const result = await apiCall(session);
        if (result.type === "success" && result.data) {
          onSuccess(result.data);
          return result.data;
        } else if (result.type === "api-error") {
          const errorMsg = result.message || result.data || errorMessage;
          setError(errorMsg);
          return null;
        } else {
          setError(errorMessage);
          return null;
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }

        if (err && typeof err === "object" && "type" in err && err.type === "api-error") {
          const apiError = err as ApiErrorServerResponse;
          setError(apiError.message || apiError.data);
        } else {
          const errorMsg = err instanceof Error ? err.message : errorMessage;
          setError(errorMsg);
        }
        return null;
      } finally {
        setLoadingState(loadingKey, false);
      }
    },
    [session, setLoadingState],
  );

  // ==================== CLEAR ERROR ====================

  const clearError = useCallback((): void => {
    setError(null);
    lastFailedRequestRef.current = null;
  }, []);

  // ==================== RETRY MECHANISM ====================

  const retryLastFailedRequest = useCallback(async (): Promise<void> => {
    if (lastFailedRequestRef.current) {
      await lastFailedRequestRef.current();
    }
  }, []);

  // ==================== API METHODS (FIXED) ====================

  // Internal implementation functions that don't set retry
  const _fetchCountriesInternal = useCallback(async (): Promise<Country[] | null> => {
    return handleApiCall(
      (session) => getCountriesApi(session),
      LoadingStateKey.COUNTRIES,
      ErrorMessages.FETCH_COUNTRIES,
      (data: Country[]) => setDataState("countries", data),
    );
  }, [handleApiCall, setDataState]);

  const _fetchAdminAreaLevel1Internal = useCallback(
    async (countryId: string): Promise<AdminAreaLevel1[] | null> => {
      if (!validateParameter(countryId, "countryId")) return null;

      return handleApiCall(
        (session) => getAdminAreaLevel1ByCountryIdApi(countryId, session),
        LoadingStateKey.ADMIN_AREA_LEVEL_1,
        ErrorMessages.FETCH_ADMIN_AREA_LEVEL_1,
        (data: AdminAreaLevel1[]) => setDataState("adminAreaLevel1", data),
      );
    },
    [handleApiCall, setDataState, validateParameter],
  );

  const _fetchAdminAreaLevel2Internal = useCallback(
    async (adminAreaLevel1Id: string): Promise<AdminAreaLevel2[] | null> => {
      if (!validateParameter(adminAreaLevel1Id, "adminAreaLevel1Id")) return null;

      return handleApiCall(
        (session) => getAdminAreaLevel2ByAdminAreaLevel1IdApi(adminAreaLevel1Id, session),
        LoadingStateKey.ADMIN_AREA_LEVEL_2,
        ErrorMessages.FETCH_ADMIN_AREA_LEVEL_2,
        (data: AdminAreaLevel2[]) => setDataState("adminAreaLevel2", data),
      );
    },
    [handleApiCall, setDataState, validateParameter],
  );

  const _fetchNeighborhoodsInternal = useCallback(
    async (adminAreaLevel2Id: string): Promise<Neighborhood[] | null> => {
      if (!validateParameter(adminAreaLevel2Id, "adminAreaLevel2Id")) return null;

      return handleApiCall(
        (session) => getNeighborhoodsByAdminAreaLevel2IdApi(adminAreaLevel2Id, session),
        LoadingStateKey.NEIGHBORHOODS,
        ErrorMessages.FETCH_NEIGHBORHOODS,
        (data: Neighborhood[]) => setDataState("neighborhoods", data),
      );
    },
    [handleApiCall, setDataState, validateParameter],
  );

  // Public API methods that set up retry
  const fetchCountries = useCallback(async (): Promise<Country[] | null> => {
    // Fix: Use the internal function to avoid circular dependency
    const retryFn = async () => {
      await _fetchCountriesInternal();
    };
    lastFailedRequestRef.current = retryFn;

    return _fetchCountriesInternal();
  }, [_fetchCountriesInternal]);

  const fetchAdminAreaLevel1 = useCallback(
    async (countryId: string): Promise<AdminAreaLevel1[] | null> => {
      const retryFn = async () => {
        await _fetchAdminAreaLevel1Internal(countryId);
      };
      lastFailedRequestRef.current = retryFn;

      return _fetchAdminAreaLevel1Internal(countryId);
    },
    [_fetchAdminAreaLevel1Internal],
  );

  const fetchAdminAreaLevel2 = useCallback(
    async (adminAreaLevel1Id: string): Promise<AdminAreaLevel2[] | null> => {
      const retryFn = async () => {
        await _fetchAdminAreaLevel2Internal(adminAreaLevel1Id);
      };
      lastFailedRequestRef.current = retryFn;

      return _fetchAdminAreaLevel2Internal(adminAreaLevel1Id);
    },
    [_fetchAdminAreaLevel2Internal],
  );

  const fetchNeighborhoods = useCallback(
    async (adminAreaLevel2Id: string): Promise<Neighborhood[] | null> => {
      const retryFn = async () => {
        await _fetchNeighborhoodsInternal(adminAreaLevel2Id);
      };
      lastFailedRequestRef.current = retryFn;

      return _fetchNeighborhoodsInternal(adminAreaLevel2Id);
    },
    [_fetchNeighborhoodsInternal],
  );

  // ==================== RESET METHODS ====================

  const resetNeighborhoods = useCallback((): void => {
    setDataState("neighborhoods", null);
  }, [setDataState]);

  const resetAdminAreaLevel2 = useCallback((): void => {
    setDataState("adminAreaLevel2", null);
    resetNeighborhoods();
  }, [setDataState, resetNeighborhoods]);

  const resetAdminAreaLevel1 = useCallback((): void => {
    setDataState("adminAreaLevel1", null);
    resetAdminAreaLevel2();
  }, [setDataState, resetAdminAreaLevel2]);

  const resetAll = useCallback((): void => {
    abortControllerRef.current?.abort();
    setDataStates(DATA_STATES_INITIAL);
    setLoadingStates(LOADING_STATES_INITIAL);
    setError(null);
    lastFailedRequestRef.current = null;
  }, []);

  // ==================== RETURN INTERFACE ====================

  return {
    // Loading states
    isLoading,
    countriesLoading: loadingStates.countriesLoading,
    adminAreaLevel1Loading: loadingStates.adminAreaLevel1Loading,
    adminAreaLevel2Loading: loadingStates.adminAreaLevel2Loading,
    neighborhoodsLoading: loadingStates.neighborhoodsLoading,

    // Error state
    error,
    hasError,

    // Data states
    countries: dataStates.countries,
    adminAreaLevel1: dataStates.adminAreaLevel1,
    adminAreaLevel2: dataStates.adminAreaLevel2,
    neighborhoods: dataStates.neighborhoods,

    // Action methods
    fetchCountries,
    fetchAdminAreaLevel1,
    fetchAdminAreaLevel2,
    fetchNeighborhoods,

    // Reset methods
    resetAdminAreaLevel1,
    resetAdminAreaLevel2,
    resetNeighborhoods,
    resetAll,

    // Utility methods
    clearError,
    retryLastFailedRequest,
  } as const;
};
