"use server";

import { getCountriesApi } from "src/actions/unirefund/LocationService/actions";
import Table from "./table";

export default async function Page() {
  const nationalitiesResponse = await getCountriesApi();
  const nationalitiesData =
    nationalitiesResponse.type === "success"
      ? nationalitiesResponse.data.items || []
      : [];

  return <Table nationalitiesData={nationalitiesData} />;
}
