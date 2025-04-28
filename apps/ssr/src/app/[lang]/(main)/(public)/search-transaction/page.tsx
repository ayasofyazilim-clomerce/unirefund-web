import {getResourceData} from "src/language-data/unirefund/SSRService";
import SearchTransactionClient from "./client";

export default async function SearchTransaction({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  // Fetch language data on server side
  const {languageData} = await getResourceData(lang);

  // Pass the language data to the client component
  return <SearchTransactionClient languageData={languageData} />;
}
