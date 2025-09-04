import {getResourceData} from "src/language-data/core/AccountService";
import {EvidenceClient} from "../components/evidence-client";

interface EvidencePageProps {
  params: {
    lang: string;
  };
}

export default async function EvidencePage({params}: EvidencePageProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  return <EvidenceClient authType="register" languageData={languageData} />;
}
