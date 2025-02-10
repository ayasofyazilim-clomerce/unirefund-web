import {toast} from "@repo/ayasofyazilim-ui/atoms/sonner";

export interface GlobalFetchType {
  url: string;
  options?: RequestInit;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export async function GlobalFetch<T>({
  url,
  options = {},
  showErrorToast = true,
  showSuccessToast = false,
}: GlobalFetchType): Promise<T | null> {
  try {
    const getData = await fetch(url, options);
    if (!getData.ok) {
      const body = (await getData.json()) as {message: string};
      if (showErrorToast) {
        toast.error(body.message);
      }
      return null;
    }

    const data = (await getData.json()) as T;
    if (showSuccessToast) {
      toast.success("Data fetched successfully");
    }
    return data;
  } catch (error) {
    toast.error(`Fetch error: ${String(error)}`);
    return null;
  }
}
