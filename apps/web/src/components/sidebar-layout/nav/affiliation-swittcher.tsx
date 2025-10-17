"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar";
import {toast} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";
import {postUserAffiliationApi} from "@repo/actions/unirefund/CrmService/post-actions";
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import type {UniRefund_CRMService_UserAffiliations_UserAffiliationDto as Affiliation} from "@repo/saas/CRMService";
import {Logo} from "@repo/ui/logo";
import {fetchNewAccessTokenByRefreshToken, getUserData, useSession} from "@repo/utils/auth";
import {Building2, ChevronsUpDown, LoaderCircle, Repeat, Store} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import type {AbpUiNavigationResource} from "@/language-data/core/AbpUiNavigation";

export default function AffiliationSwitch({
  affiliations: originalAffiliations,
  languageData,
}: {
  affiliations: Affiliation[];
  languageData: AbpUiNavigationResource;
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
  const {isMobile} = useSidebar();

  if (!originalAffiliations.length || !activeIds.length) return <EmptyAffiliations />;
  const isSwitching =
    isPending ||
    (tempActive !== null && tempActive !== affiliations.find((aff) => aff.partyId === activeId)?.partyName);
  return (
    <SidebarMenu key={session?.user?.access_token}>
      <SidebarMenuItem>
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger asChild data-testid="open-affiliation-switcher">
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg">
              <Logo
                iconProps={{
                  fill: "#FFFFFF",
                  className: "!size-8 p-2 rounded-md !min-w-8 block bg-primary",
                }}
                variant="icon"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {isSwitching ? (
                  <>
                    <span className="flex items-center gap-1 truncate font-medium">
                      <LoaderCircle className="animate size-4 min-w-4 animate-spin" />
                      {languageData["Affiliations.switching"]}
                    </span>
                    <span className="truncate text-xs">{tempActive}</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">{affiliations.find((aff) => aff.partyId === activeId)?.partyName}</span>
                    <span className="truncate text-xs">
                      {affiliations.find((aff) => aff.partyId === activeId)?.vatNumber}
                    </span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 max-w-72 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
            {affiliations.map((affiliation) => {
              const isSelected = selectedPartyId === affiliation.partyId;
              return (
                <DropdownMenuItem
                  className={cn("mt-1 flex items-center justify-between", isSelected && "bg-muted/50")}
                  key={affiliation.partyId}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPartyId(affiliation.partyId || "");
                  }}>
                  <div className="flex items-center gap-2 overflow-hidden ">
                    <div className="bg-muted/50 flex size-8 min-w-8 items-center justify-center rounded-full">
                      <affiliation.icon className="text-muted-foreground size-4 min-w-4" />
                    </div>
                    <span className={cn("truncate text-xs font-medium", isSelected && "text-blue-600")}>
                      {affiliation.partyName}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="w-full gap-1"
              data-testid="affiliation-switch-select-button"
              disabled={isSwitching || selectedPartyId === activeId}
              onClick={(e) => {
                e.preventDefault();
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
              <div className="flex items-center gap-2 overflow-hidden ">
                <div className="bg-muted/50 flex size-8 min-w-8 items-center justify-center rounded-full">
                  <Repeat className="text-muted-foreground size-4 min-w-4" />
                </div>
                <span className="truncate text-xs font-medium">
                  {replacePlaceholders(languageData["Affiliations.switchTo.{0}"], [
                    {
                      holder: "{0}",
                      replacement: (
                        <span className="truncate font-medium">
                          {affiliations.find((aff) => aff.partyId === selectedPartyId)?.partyName}
                        </span>
                      ),
                    },
                  ])}
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function EmptyAffiliations() {
  return (
    <>
      <Logo
        iconProps={{
          fill: "#FFFFFF",
          className:
            "!size-8 p-2 rounded-md !min-w-8 block bg-primary transition-all duration-300 ease-in-out group-data-[state=collapsed]:translate-x-0 group-data-[state=collapsed]:opacity-100 group-data-[state=expanded]:-translate-x-full group-data-[state=expanded]:opacity-0 absolute ",
        }}
        variant="icon"
      />
      <Logo
        textProps={{
          className:
            "max-w-40 mx-auto transition-all duration-300 ease-in-out group-data-[state=expanded]:translate-x-0 group-data-[state=expanded]:opacity-100 group-data-[state=collapsed]:translate-x-full group-data-[state=collapsed]:opacity-0 absolute",
        }}
        variant="text"
      />
    </>
  );
}
