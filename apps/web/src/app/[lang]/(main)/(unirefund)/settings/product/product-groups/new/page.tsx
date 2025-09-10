"use server";

import {Button} from "@/components/ui/button";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {FileText} from "lucide-react";
import Link from "next/link";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getVatsApi} from "@repo/actions/unirefund/SettingService/actions";
import {getResourceData} from "src/language-data/unirefund/SettingService";
import Form from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getVatsApi(
        {
          maxResultCount: 1000,
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups.Add"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [vatResponse] = apiRequests.data;

  return (
    <>
      <FormReadyComponent
        active={vatResponse.data.items?.length === 0}
        content={{
          icon: <FileText className="size-20 text-gray-400" />,
          title: languageData["Missing.Vat.Title"],
          message: languageData["Missing.Vat.Message"],
          action: (
            <Button asChild className="text-blue-500" data-testid="form-ready-action-button" variant="link">
              <Link data-testid="form-ready-action-link" href="../vats/new">
                {languageData["Vat.New"]}
              </Link>
            </Button>
          ),
        }}>
        <Form languageData={languageData} vatList={vatResponse.data.items || []} />
      </FormReadyComponent>
      <div className="hidden" id="page-description">
        {languageData["ProductGroups.Create.Description"]}
      </div>
    </>
  );
}
