import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    getAdminAreaLevel1ByCountryIdApi,
    getAdminAreaLevel2ByAdminAreaLevel1IdApi,
    getCountriesApi,
    getNeighborhoodsByAdminAreaLevel2IdApi
} from "@repo/actions/unirefund/CrmService/actions";
import { UniRefund_CRMService_AdminAreaLevel1_AdminAreaLevel1Dto, UniRefund_CRMService_AdminAreaLevel2_AdminAreaLevel2Dto, UniRefund_CRMService_Countries_CountryDto, UniRefund_CRMService_Neighborhoods_NeighborhoodDto } from "@repo/saas/CRMService";

export function useAddressData() {
    const forceRenderCounter = useRef(0);
    const previousDataRef = useRef({
        countries: [] as UniRefund_CRMService_Countries_CountryDto[],
        adminAreaLevel1: [] as UniRefund_CRMService_AdminAreaLevel1_AdminAreaLevel1Dto[],
        adminAreaLevel2: [] as UniRefund_CRMService_AdminAreaLevel2_AdminAreaLevel2Dto[],
        neighborhoods: [] as UniRefund_CRMService_Neighborhoods_NeighborhoodDto[]
    });

    // Countries query
    const {
        data: countries = [],
        isLoading: countriesLoading,
        isError: countriesError,
        isSuccess: countriesSuccess,
        dataUpdatedAt: countriesUpdatedAt
    } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            const response = await getCountriesApi();
            if (response.type === "success") return response.data || [];
            return [];
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Admin Area Level 1 mutation
    const adminAreaLevel1Mutation = useMutation({
        mutationFn: async (countryId: string) => {
            const response = await getAdminAreaLevel1ByCountryIdApi(countryId);
            if (response.type === "success") return response.data || [];
            return [];
        },
    });

    // Admin Area Level 2 mutation
    const adminAreaLevel2Mutation = useMutation({
        mutationFn: async (adminAreaLevel1Id: string) => {
            const response = await getAdminAreaLevel2ByAdminAreaLevel1IdApi(adminAreaLevel1Id);
            if (response.type === "success") return response.data || [];
            return [];
        },
    });

    // Neighborhood mutation
    const neighborhoodMutation = useMutation({
        mutationFn: async (adminAreaLevel2Id: string) => {
            const response = await getNeighborhoodsByAdminAreaLevel2IdApi(adminAreaLevel2Id);
            if (response.type === "success") return response.data || [];
            return [];
        },
    });

    // Data change detection
    const hasDataChanged = useCallback((newData: any[], previousData: any[]) => {
        if (newData.length !== previousData.length) return true;

        if (newData.length > 0 && previousData.length > 0) {
            const newIds = newData.slice(0, 3).map(item => item.id).join(',');
            const prevIds = previousData.slice(0, 3).map(item => item.id).join(',');
            return newIds !== prevIds;
        }

        return false;
    }, []);

    // Debounced handlers
    const handleAdminAreaLevel1Search = useDebouncedCallback((countryId: string) => {
        if (!countryId) {
            adminAreaLevel1Mutation.reset();
        } else {
            adminAreaLevel1Mutation.mutate(countryId);
        }
    }, 300);

    const handleAdminAreaLevel2Search = useDebouncedCallback((adminAreaLevel1Id: string) => {
        if (!adminAreaLevel1Id) {
            adminAreaLevel2Mutation.reset();
        } else {
            adminAreaLevel2Mutation.mutate(adminAreaLevel1Id);
        }
    }, 300);

    const handleNeighborhoodSearch = useDebouncedCallback((adminAreaLevel2Id: string) => {
        if (!adminAreaLevel2Id) {
            neighborhoodMutation.reset();
        } else {
            neighborhoodMutation.mutate(adminAreaLevel2Id);
        }
    }, 300);

    // Reset dependent fields
    const resetDependentFields = useCallback((level: 'country' | 'adminAreaLevel1' | 'adminAreaLevel2') => {
        switch (level) {
            case 'country':
                adminAreaLevel1Mutation.reset();
                adminAreaLevel2Mutation.reset();
                neighborhoodMutation.reset();
                break;
            case 'adminAreaLevel1':
                adminAreaLevel2Mutation.reset();
                neighborhoodMutation.reset();
                break;
            case 'adminAreaLevel2':
                neighborhoodMutation.reset();
                break;
        }
    }, [adminAreaLevel1Mutation, adminAreaLevel2Mutation, neighborhoodMutation]);

    return {
        // Data
        countries,
        countriesLoading,
        countriesError,
        countriesSuccess,
        adminAreaLevel1Mutation,
        adminAreaLevel2Mutation,
        neighborhoodMutation,

        // Handlers
        handleAdminAreaLevel1Search,
        handleAdminAreaLevel2Search,
        handleNeighborhoodSearch,
        resetDependentFields,

        // Utilities
        hasDataChanged,
        forceRenderCounter,
        previousDataRef,
        countriesUpdatedAt
    };
}