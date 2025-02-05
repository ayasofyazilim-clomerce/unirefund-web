"use server";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getContractServiceClient} from "src/lib";

export async function deleteMerchantContractHeaderByIdApi(id: string) {
  try {
    const client = await getContractServiceClient();
    const response = await client.contractsMerchant.deleteApiContractServiceMerchantsContractsContractHeadersById({id});
    return structuredResponse(response);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRefundPointContractHeadersById(id: string) {
  try {
    const client = await getContractServiceClient();
    return structuredResponse(
      await client.contractsRefundPoint.deleteApiContractServiceRefundPointsContractsContractHeadersById({id}),
    );
  } catch (error) {
    return structuredError(error);
  }
}

// export async function deleteRefundFeeHeadersById(id: string) {
//   try {
//     const client = await getContractServiceClient();
//     return structuredResponse(
//       await client.refundFeeHeader.del(
//         {
//           id,
//         },
//       ),
//     );
//   } catch (error) {
//     return structuredError(error);
//   }
// }

// export async function deleteRefundTableHeadersById(id: string) {
//   try {
//     const client = await getContractServiceClient();
//     return structuredResponse(
//       await client.refundTableHeader.del(
//         {
//           id,
//         },
//       ),
//     );
//   } catch (error) {
//     return structuredError(error);
//   }
// }
