import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import HomePageClient from "./client";

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const tagsResponse = await getTagsApi();

  // Pass the language data to the client component
  return <HomePageClient languageData={languageData} tagsResponse={tagsResponse} />;
}
