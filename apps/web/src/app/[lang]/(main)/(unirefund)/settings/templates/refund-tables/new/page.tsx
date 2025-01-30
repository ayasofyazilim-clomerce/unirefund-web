import { getResourceData } from "@/language-data/unirefund/ContractService";
import RefundTableHeaderCreateForm from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  return (
    <RefundTableHeaderCreateForm languageData={languageData} merchants={[]} />
  );
}
