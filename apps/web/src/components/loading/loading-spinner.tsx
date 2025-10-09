import {LoaderCircleIcon} from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <LoaderCircleIcon className="text-muted-foreground h-12 w-12 animate-spin" />
      <p className="sr-only font-medium">Loading...</p>
    </div>
  );
}
