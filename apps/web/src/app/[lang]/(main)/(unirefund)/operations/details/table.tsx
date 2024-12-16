"use client";
import { toast } from "@/components/ui/sonner";
import type { PagedResultDto_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Merchants_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiTagServiceTagResponse,
  GetApiTagServiceTagSummaryResponse,
  UniRefund_TagService_Tags_TagListItemDto,
} from "@ayasofyazilim/saas/TagService";
import { $UniRefund_TagService_Tags_TagListItemDto } from "@ayasofyazilim/saas/TagService";
import type {
  GetApiTravellerServiceTravellersResponse,
  PagedResultDto_TravellerListProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_Travellers_TravellerListProfileDto } from "@ayasofyazilim/saas/TravellerService";
import type {
  ColumnsType,
  fetchRequestProps,
} from "@repo/ayasofyazilim-ui/molecules/tables/types";
import Dashboard from "@repo/ayasofyazilim-ui/templates/dashboard";
import { ChartBarIncreasing, CreditCard, DollarSign } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { CellContext } from "@tanstack/react-table";
import { getBaseLink } from "src/utils";
import { localizeCurrency, localizeNumber } from "src/utils/utils-number";
import { getMerchantsApi } from "src/actions/unirefund/CrmService/actions";
import { getTravellers } from "src/actions/unirefund/TravellerService/actions";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import { dataConfigOfParties } from "../../parties/table-data";
import type { DetailedFilter, TypedFilter } from "../filter";
import { typedCommonFilter } from "../filter";
import { getTravellerFilterClient, travellerTableSchema } from "./utils";
import type { TravllersKeys } from "./utils";
import { getMerchants, getSummary, getTags } from "./actions";

function cellWithLink(
  cell: CellContext<UniRefund_TagService_Tags_TagListItemDto, unknown>,
) {
  const id = cell.row.original.id || "";
  const tagNumber = cell.getValue() as string;
  return (
    <Link className="text-blue-700" href={`details/${id}`}>
      {tagNumber}
    </Link>
  );
}
function cellWithDate(
  cell: CellContext<UniRefund_TagService_Tags_TagListItemDto, unknown>,
  lang: Intl.LocalesArgument,
) {
  return new Date(cell.getValue() as string).toLocaleDateString(lang, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Table({ nationalitiesData }: { nationalitiesData: CountryDto[] }) {
  const params = useParams<{
    lang: string;
  }>();
  const [merchant, setMerchant] = useState<PagedResultDto_MerchantProfileDto>(
    {},
  );
  const [travellers, setTravellers] =
    useState<GetApiTravellerServiceTravellersResponse>({});

  const numberFormatter = (value: number) =>
    localizeNumber(params.lang).format(value);
  const currencyFormatter = localizeCurrency(params.lang);

  useEffect(() => {
    async function getMerchantsLocally() {
      const merchants = await getMerchantsApi();
      if (merchants.type === "success") {
        setMerchant(merchants.data);
      }
      const travellersList = await getTravellers(1);
      setTravellers(
        travellersList.data as GetApiTravellerServiceTravellersResponse,
      );
    }
    void getMerchantsLocally();
  }, []);

  const travellerExcludeList: TravllersKeys[] = [
    ...travellerTableSchema.excludeList,
    "identificationType",
    "languagePreferenceCode",
  ];
  const travellerPosition: TravllersKeys[] = [
    "firstName",
    "lastName",
    "nationalityCountryName",
  ];

  // convert type filter to array
  const typedFilters: TypedFilter = {
    ...typedCommonFilter,
    merchantIds: {
      name: "merchantIds",
      type: "select-async",
      displayName: "Merchant",
      value: "",
      rowCount: merchant.totalCount || 0,
      filterProperty: "id",
      showProperty: "name",
      data: merchant.items || [],
      columnDataType: {
        tableType: $UniRefund_CRMService_Merchants_MerchantProfileDto,
        ...dataConfigOfParties.merchants.tableSchema,
        hideAction: true,
      },
      fetchRequest: getMerchants,
      detailedFilters: dataConfigOfParties.merchants.detailedFilters,
    },
    travellerIds: {
      name: "travellerIds",
      type: "select-async",
      displayName: "Traveller",
      value: "",
      rowCount: travellers.totalCount || 0,
      filterProperty: "id",
      showProperty: "firstName",
      data: travellers.items || [],
      columnDataType: {
        tableType:
          $UniRefund_TravellerService_Travellers_TravellerListProfileDto,
        excludeList: travellerExcludeList,
        positions: travellerPosition,
        hideAction: true,
      },
      fetchRequest: async (page, filter) => {
        const response = await getTravellers(page, filter);
        if (response.type === "success") {
          const data = response.data as PagedResultDto_TravellerListProfileDto;
          return {
            type: "success",
            data: { items: data.items || [], totalCount: data.totalCount || 0 },
          };
        }
        return {
          type: "success",
          data: { items: [], totalCount: 0 },
        };
      },
      detailedFilters: getTravellerFilterClient("en", nationalitiesData),
    },
  };
  const filters: DetailedFilter[] = Object.values(typedFilters);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<GetApiTagServiceTagResponse>();
  const [summary, setSummary] = useState<GetApiTagServiceTagSummaryResponse>();
  const fetchTags = ({ page, filter, pageSize }: fetchRequestProps) => {
    const _pageSize = pageSize || 10;
    // setLoading(true);s
    void getTags({
      maxResultCount: _pageSize,
      skipCount: page * _pageSize,
      ...filter,
    })
      .then((res) => {
        if (res.type === "success") {
          setTags(res.data);
        }
        if (res.type === "error" || res.type === "api-error") {
          toast.error(res.message);
        }
      })
      .finally(() => {
        setLoading(false);
        // handleFilter(filter);
      });
    void getSummary({ maxResultCount: 10, skipCount: page * 10, ...filter })
      .then((res) => {
        if (res.type === "success") {
          setSummary(res.data);
          return;
        }
        toast.error(res.message);
      })
      .finally(() => {
        // setLoading(false);
        // handleFilter(filter);
      });
  };

  useEffect(() => {
    async function getTagsFromAPI() {
      const tagsList = await getTags();
      if (tagsList.type === "success") {
        setTags(tagsList.data);
        toast.success(tagsList.message);
        setLoading(false);
        return;
      }
      toast.error(tagsList.message);
    }
    void getTagsFromAPI();
  }, []);
  const columnsData: ColumnsType<UniRefund_TagService_Tags_TagListItemDto> = {
    type: "Auto",
    data: {
      tableType: $UniRefund_TagService_Tags_TagListItemDto,
      excludeList: ["id"],
      customCells: {
        tagNumber: cellWithLink,
        issueDate: (cell) => cellWithDate(cell, params.lang),
        expireDate: (cell) => cellWithDate(cell, params.lang),
      },
      actionList: [
        {
          cta: "Open in new page",
          type: "Action",
          callback: (originalRow: UniRefund_TagService_Tags_TagListItemDto) => {
            router.push(getBaseLink(`operations/details/${originalRow.id}`));
          },
        },
      ],
    },
  };
  const summaryCards = [
    {
      title: "Total Tags",
      content: numberFormatter(tags?.totalCount || 0),
      icon: <ChartBarIncreasing className="size-4" />,
    },
    {
      title: "Total Sales",
      content: `+${numberFormatter(summary?.totalSalesAmount || 0)}`,
      icon: <CreditCard className="size-4" />,
    },
    {
      title: "Total Refunds",
      content: currencyFormatter(
        summary?.totalRefundAmount || 0,
        summary?.currency || "TRY",
      ),
      icon: <DollarSign className="size-4" />,
    },
    {
      title: "Currency",
      content: summary?.currency || "",
      footer: "",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Dashboard
        action={{
          type: "NewPage",
          cta: "Add Tag",
          href: getBaseLink("operations/details/add"),
        }}
        cards={summaryCards}
        columnsData={columnsData}
        data={tags?.items || []}
        detailedFilter={filters}
        fetchRequest={fetchTags}
        isLoading={loading}
        rowCount={tags?.totalCount}
        withCards
        withTable
      />
    </div>
  );
}

export default Table;
