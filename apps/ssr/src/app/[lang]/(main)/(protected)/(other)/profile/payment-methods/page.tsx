import {getResourceData as ssrGetResourceData} from "src/language-data/unirefund/SSRService";
import PaymentMethodsClient from "./client";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await ssrGetResourceData(lang);
  return <PaymentMethodsClient {...languageData} />;
}
