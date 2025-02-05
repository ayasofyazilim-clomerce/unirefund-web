"use server";

import {notFound} from "next/navigation";
import {getCountrySettingsApi} from "src/actions/core/AdministrationService/actions";
import {getResourceData as getResourceDataCoreSettingsService} from "src/language-data/core/AdministrationService";
import {getResourceData as getResourceDataUnirefundSettingsService} from "src/language-data/unirefund/SettingService";
import TenantSettingsPage from "./group";

export default async function Page({params}: {params: {group: string; lang: string}}) {
  const tenantSettings = await getCountrySettingsApi();
  const {languageData: core} = await getResourceDataCoreSettingsService(params.lang);
  const {languageData: unirefund} = await getResourceDataUnirefundSettingsService(params.lang);
  if (tenantSettings.type !== "success") {
    return notFound();
  }

  return <TenantSettingsPage languageData={{...core, ...unirefund}} list={tenantSettings.data} />;
}
