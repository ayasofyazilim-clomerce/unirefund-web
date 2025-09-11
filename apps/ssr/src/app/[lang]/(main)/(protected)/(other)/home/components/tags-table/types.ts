import type {
  TagListResponseDto_TagListItemDto,
  UniRefund_TagService_Tags_TagListItemDto,
  UniRefund_TagService_Tags_TagTotalDto,
} from "@repo/saas/TagService";
import type {ServerResponse} from "@repo/utils/api";
import type {SSRServiceResource} from "src/language-data/unirefund/SSRService";

// Constants
export const DISPLAY_LIMIT = 5;
export const DEFAULT_CURRENCY = "TRY";

// Type definitions
export interface TagsTableProps {
  languageData: SSRServiceResource;
  tagsResponse: ServerResponse<TagListResponseDto_TagListItemDto>;
  showAll?: boolean;
}

export interface AmountInfo {
  amount: number;
  currency: string;
}

export interface TagRowData {
  salesAmount: AmountInfo | null;
  vatAmount: AmountInfo | null;
  grossRefund: AmountInfo | null;
}

// Type alias for better readability
export type TagItem = UniRefund_TagService_Tags_TagListItemDto;
export type TagTotal = UniRefund_TagService_Tags_TagTotalDto;

// Helper function to get amount from totals
export function getAmountByType(totals: TagTotal[] | null | undefined, type: string): AmountInfo | null {
  if (!totals || !Array.isArray(totals)) return null;
  const total = totals.find((t: TagTotal) => t.totalType === type);
  return total ? {amount: total.amount, currency: total.currency} : null;
}

// Helper function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("tr-TR");
}
