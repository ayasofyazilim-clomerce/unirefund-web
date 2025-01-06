"use server";

import { FormReadyComponent } from "@repo/ui/form-ready";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getVatsApi } from "src/actions/unirefund/SettingService/actions";
import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups.Add"],
    lang,
  });
  const vatsResponse = await getVatsApi({
    maxResultCount: 1000,
  });
  if (isErrorOnRequest(vatsResponse, lang)) return;
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <FormReadyComponent
        active={vatsResponse.data.items?.length === 0}
        content={{
          icon: <FileText className="size-20 text-gray-400" />,
          title: languageData["Missing.Vat.Title"],
          message: languageData["Missing.Vat.Message"],
          action: (
            <Button asChild className="text-blue-500" variant="link">
              <Link href="../vats/new">{languageData["Vat.New"]}</Link>
            </Button>
          ),
        }}
      >
        <Form
          languageData={languageData}
          vatList={vatsResponse.data.items || []}
        />
      </FormReadyComponent>
      <div className="hidden" id="page-description">
        {languageData["ProductGroups.Create.Description"]}
      </div>
    </>
  );
}
