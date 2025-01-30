import { getResourceData } from "src/language-data/unirefund/ContractService";
import RebateForm from "../_components/rebate-form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { languageData } = await getResourceData(params.lang);
  return <RebateForm formType="create" languageData={languageData} />;
}
