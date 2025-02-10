import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type ResourceResult = Record<
  string,
  | {
      texts?: Record<string, string> | null | undefined;
      baseResources?: string[] | null | undefined;
    }
  | undefined
>;
