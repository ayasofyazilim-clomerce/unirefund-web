import {Button} from "@/components/ui/button";
import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {getBaseLink} from "@/utils";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {FileSliders} from "lucide-react";
import Link from "next/link";

export function checkIsFormReady({
  lang,
  languageData,
  taxOfficeListLength,
}: {
  lang: string;
  languageData: CRMServiceServiceResource;
  taxOfficeListLength?: number;
}) {
  const {grantedPolicies} = useGrantedPolicies();

  if (taxOfficeListLength !== undefined && taxOfficeListLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <FileSliders className="size-20 text-gray-400" />,
        title: languageData["CRM.Messages.MissingTaxOffice.Title"],
        message: languageData["CRM.Messages.MissingTaxOffice.Message"],
        action: isActionGranted(["CRMService.TaxOffices.Create"], grantedPolicies) ? (
          <Action
            languageData={languageData}
            link={getBaseLink("parties/tax-offices/new", lang)}
            label={languageData["Form.TaxOffice.Create"]}
          />
        ) : null,
      },
    };
  }
  return {
    isActive: false,
    content: null,
  };
}

function Action({languageData, link, label}: {languageData: CRMServiceServiceResource; link: string; label: string}) {
  return (
    <Button asChild className="text-blue-500" variant="link">
      <Link href={link}>{label}</Link>
    </Button>
  );
}
