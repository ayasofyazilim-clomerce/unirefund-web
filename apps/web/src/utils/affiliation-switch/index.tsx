"use client";
import {toast} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import {postUserAffiliationApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ayasofyazilim-ui/atoms/command";
import {Popover, PopoverContent, PopoverTrigger} from "@repo/ayasofyazilim-ui/atoms/popover";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import type {UniRefund_CRMService_UserAffiliations_UserAffiliationDto as Affiliation} from "@repo/saas/CRMService";
import {fetchNewAccessTokenByRefreshToken, getUserData, useSession} from "@repo/utils/auth";
import {Building2, ChevronDownIcon, LoaderCircle, Store} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export default function AffiliationSwitch({
  affiliations: originalAffiliations,
  languageData,
}: {
  affiliations: Affiliation[];
  languageData: CRMServiceServiceResource;
}) {
  const router = useRouter();
  const {session, sessionUpdate} = useSession();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const [tempActive, setTempActive] = useState<string | null>(null);
  const affiliations = originalAffiliations.map((aff) => {
    return {
      ...aff,
      icon: aff.parentId !== null ? Store : Building2,
    };
  });
  const activeIds =
    session?.user?.CustomsId ||
    session?.user?.IndividualId ||
    session?.user?.MerchantId ||
    session?.user?.RefundPointId ||
    session?.user?.TaxFreeId ||
    session?.user?.TaxOfficeId ||
    session?.user?.TourGuideId ||
    session?.user?.TravellerId ||
    "";
  const activeId =
    typeof activeIds === "string"
      ? activeIds
      : affiliations.find((aff) => activeIds.includes(aff.partyId || ""))?.partyId || "";
  const [selectedPartyId, setSelectedPartyId] = useState<string>(activeId);

  if (!originalAffiliations.length || !activeIds.length) return null;
  const isSwitching =
    isPending ||
    (tempActive !== null && tempActive !== affiliations.find((aff) => aff.partyId === activeId)?.partyName);
  return (
    <Popover key={session?.user?.access_token} onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild data-testid="affiliation-switch-trigger">
        <Button
          aria-expanded={open}
          className="bg-background hover:bg-background border-input w-full min-w-60 max-w-60 justify-between px-3 font-normal outline-none outline-offset-0 focus-visible:outline-[3px]"
          data-testid="affiliation-switch-button"
          disabled={isSwitching}
          role="combobox"
          variant="outline">
          <span className="flex min-w-0 items-center gap-1">
            {isSwitching ? (
              <span className="flex items-center gap-1 truncate font-medium">
                <LoaderCircle className="animate size-4 min-w-4 animate-spin" />
                {tempActive}
              </span>
            ) : (
              <>
                {(() => {
                  const selectedItem = affiliations.find((aff) => aff.partyId === activeId);
                  if (selectedItem) {
                    const Icon = selectedItem.icon;
                    return <Icon className="text-muted-foreground size-4 min-w-4" />;
                  }
                  return null;
                })()}
                <span className="truncate">{affiliations.find((aff) => aff.partyId === activeId)?.partyName}</span>
              </>
            )}
          </span>
          <ChevronDownIcon aria-hidden="true" className="text-muted-foreground/80 shrink-0" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="border-input flex w-full min-w-[var(--radix-popper-anchor-width)] flex-col p-0">
        <Command className="rounded-none border-b">
          <CommandInput placeholder={languageData["CRM.Affiliations.search"]} />
          <CommandList>
            <CommandEmpty>{languageData["CRM.Affiliations.notFound"]}</CommandEmpty>
            <CommandGroup>
              {affiliations.map((affiliation) => {
                const keywords = [
                  affiliation.partyName,
                  affiliation.identificationNumber,
                  affiliation.partyType?.toString(),
                ]
                  .filter(Boolean)
                  .join(" ");
                const isSelected = selectedPartyId === affiliation.partyId;
                return (
                  <CommandItem
                    className={cn("mt-1 flex items-center justify-between", isSelected && "bg-muted/50")}
                    key={affiliation.partyId}
                    keywords={[keywords]}
                    onSelect={(currentValue) => {
                      setSelectedPartyId(currentValue);
                    }}
                    value={affiliation.partyId}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="bg-muted/50 flex size-8 min-w-8 items-center justify-center rounded-full">
                        <affiliation.icon className="text-muted-foreground size-4 min-w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("truncate text-xs font-medium", isSelected && "text-blue-600")}>
                          {affiliation.partyName}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="flex p-1">
          <Button
            className="w-full gap-1"
            data-testid="affiliation-switch-select-button"
            disabled={isSwitching || selectedPartyId === activeId}
            onClick={() => {
              setTempActive(affiliations.find((aff) => aff.partyId === selectedPartyId)?.partyName || null);
              startTransition(() => {
                void postUserAffiliationApi(selectedPartyId).then(async (res) => {
                  setOpen(false);
                  if (res.type !== "success") {
                    toast.error(res.message);
                    setTempActive(null);
                    setSelectedPartyId(activeId);
                    return;
                  }
                  const {access_token, refresh_token, expires_in} = await fetchNewAccessTokenByRefreshToken(
                    session?.user?.refresh_token || "",
                  );
                  await sessionUpdate({info: (await getUserData(access_token, refresh_token, expires_in)) as object});
                  router.refresh();
                });
              });
            }}>
            {replacePlaceholders(languageData["CRM.Affiliations.switchTo.{0}"], [
              {
                holder: "{0}",
                replacement: (
                  <span className="truncate font-medium">
                    {affiliations.find((aff) => aff.partyId === selectedPartyId)?.partyName}
                  </span>
                ),
              },
            ])}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
