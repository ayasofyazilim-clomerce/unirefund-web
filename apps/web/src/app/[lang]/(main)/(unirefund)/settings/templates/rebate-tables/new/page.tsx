import { getResourceData } from "src/language-data/unirefund/ContractService";
import RebateTableHeaderCreateForm from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { languageData } = await getResourceData(params.lang);
  return <RebateTableHeaderCreateForm languageData={languageData} />;
}
