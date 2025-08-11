import {Suspense} from "react";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import {taxFreeService} from "./services/tax-free-service";
import ExploreClient from "./client";

// This component is a server component that fetches tax-free points data from the server
// and passes it to the client component
export default async function ExplorePage({params}: {params: {lang: string}}) {
  // Get tax-free points data from the service
  // In a real application, this could fetch from a database or API
  const taxFreePoints = await taxFreeService.getAll();
  const {languageData} = await getResourceData(params.lang);

  return (
    <Suspense fallback={<div>{languageData["Explore.Loading"]}</div>}>
      <ExploreClient initialPoints={taxFreePoints} languageData={languageData} />
    </Suspense>
  );
}
