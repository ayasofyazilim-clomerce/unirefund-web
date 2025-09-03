import {EvidenceClient} from "./client";
import {getResourceData} from "src/language-data/core/AccountService";

interface EvidencePageProps {
  params: {
    lang: string;
  };
}

export default async function EvidencePage({params}: EvidencePageProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  return <EvidenceClient languageData={languageData} />;
}
