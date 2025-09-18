"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {StoreIcon} from "lucide-react";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";

export type PartyType = "merchants" | "refund-points" | "tax-free" | "tax-offices" | "customs" | "individuals";

export default function PartyHeader({
  details,
  partyType,
}: {
  details: {
    name?: string | null | undefined;
    firstname?: string | null | undefined;
    lastname?: string | null | undefined;
    parentName?: string | null | undefined;
    parentId?: string | null | undefined;
  };
  partyType: PartyType;
}) {
  const {lang} = useParams<{lang: string}>();

  const name = partyType === "individuals" ? `${details.firstname} ${details.lastname}` : details.name;
  if (!name) return null;
  const link = details.parentId ? getBaseLink(`parties/${partyType}/${details.parentId}/details`, lang) : null;

  return (
    <div className="text mb-2 flex h-9 items-center border-b pb-2 font-bold">
      <Breadcrumb>
        <BreadcrumbList>
          {link ? (
            <BreadcrumbItem>
              <BreadcrumbLink
                className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-blue-600"
                data-testid="parent-link"
                href={link}>
                <StoreIcon className="w-4" />
                {details.parentName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ) : null}
          {link ? <BreadcrumbSeparator /> : null}
          <BreadcrumbItem>
            <BreadcrumbPage className={link ? "font-medium text-blue-600" : "font-semibold"} data-testid={name}>
              {name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
