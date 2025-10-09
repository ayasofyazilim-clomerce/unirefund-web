import {Button} from "@/components/ui/button";
import Link from "next/link";
import {SendToBack, Store, UserStar} from "lucide-react";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export function checkIsFormReady({
  lang,
  languageData,
  grantedPolicies,
  affiliationsLength,
  rebateTableHeadersLength,
  storesLength,
  contractSettingsLength,
}: {
  lang: string;
  languageData: ContractServiceResource;
  grantedPolicies: Record<Policy, boolean>;
  affiliationsLength?: number;
  rebateTableHeadersLength?: number;
  storesLength?: number;
  contractSettingsLength?: number;
}) {
  if (affiliationsLength !== undefined && affiliationsLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <UserStar className="size-20 text-gray-400" />,
        title: languageData["Missing.Affiliations.Title"],
        message: languageData["Missing.Affiliations.Message"],
        action: isActionGranted(["CRMService.Merchants.CreateAffiliation"], grantedPolicies) ? (
          <Action languageData={languageData} link="../../affiliations" />
        ) : null,
      },
    };
  }
  if (rebateTableHeadersLength !== undefined && rebateTableHeadersLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <SendToBack className="size-20 text-gray-400" />,
        title: languageData["Missing.RebateTableHeaders.Title"],
        message: languageData["Missing.RebateTableHeaders.Message"],
        action: isActionGranted(["ContractService.RebateTableHeader.Create"], grantedPolicies) ? (
          <Action languageData={languageData} link={getBaseLink("settings/templates/rebate-tables/new", lang)} />
        ) : null,
      },
    };
  }
  if (storesLength !== undefined && storesLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <Store className="size-20 text-gray-400" />,
        title: languageData["Missing.ContractStores.Title"],
        message: languageData["Missing.ContractStores.Message"],
      },
    };
  }
  if (contractSettingsLength !== undefined && contractSettingsLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <Store className="size-20 text-gray-400" />,
        title: languageData["Missing.ContractSettings.Title"],
        message: languageData["Missing.ContractSettings.Message"],
        action: isActionGranted(["ContractService.ContractHeaderForMerchant.ConractSettingCreate"], grantedPolicies) ? (
          <Action languageData={languageData} link="contract-settings" />
        ) : null,
      },
    };
  }
  return {
    isActive: false,
    content: null,
  };
}

function Action({languageData, link}: {languageData: ContractServiceResource; link: string}) {
  return (
    <Button asChild className="text-blue-500" data-testid="new-button" variant="link">
      <Link data-testid="new-link" href={link}>
        {languageData.New}
      </Link>
    </Button>
  );
}
