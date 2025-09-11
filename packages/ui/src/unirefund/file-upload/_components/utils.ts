import { toast } from "@repo/ayasofyazilim-ui/atoms/sonner";
import { UniRefund_FileService_Files_FileResponseListDto } from "@repo/saas/FileService";
export function handleFileDownload({
  response,
  file,
  actionType,
}: {
  response: Response;
  file: UniRefund_FileService_Files_FileResponseListDto;
  actionType: "open" | "download";
}) {
  if (response.ok) {
    response.blob().then((blob) => {
      if (actionType === "open") {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank", "noopener,noreferrer");
        URL.revokeObjectURL(url);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", file.fileId || "");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    });
  } else {
    response.json().then((data) => {
      toast.error(data.error.message);
    });
  }
}
