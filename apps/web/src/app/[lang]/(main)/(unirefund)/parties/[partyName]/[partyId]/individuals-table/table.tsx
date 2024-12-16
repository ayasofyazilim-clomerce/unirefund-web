"use server";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import TableComponent from "@repo/ui/TableComponent";
import { deleteTableRow, getApiRequests } from "src/actions/api-requests";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { dataConfigOfParties } from "../../../table-data";
import type { PartyNameType } from "../../../types";

function Individual({
  languageData,
  partyName,
  partyId,
}: {
  languageData: CRMServiceServiceResource;
  partyName: Exclude<PartyNameType, "individuals">;
  partyId: string;
}) {
  const formData = dataConfigOfParties[partyName];

  return (
    <SectionLayoutContent sectionId="individuals">
      <TableComponent
        deleteRequest={async (id) => {
          "use server";
          const response = await deleteTableRow(partyName, id);
          return response;
        }}
        deleteableRow
        editOnNewPage
        editOnNewPageUrl={`/parties/${partyName}`}
        fetchRequest={async (page) => {
          "use server";
          const requests = await getApiRequests();
          const response = await requests[partyName].getIndivuals({
            id: partyId,
            maxResultCount: 10,
            skipCount: page * 10,
          });

          return {
            type: "success",
            data: {
              items: response.items || [],
              totalCount: response.totalCount || 0,
            },
          };
        }}
        languageData={languageData}
        tableSchema={formData.tableSchema}
      />
    </SectionLayoutContent>
  );
}

export default Individual;
