import {Tag} from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-20">
      <Tag className="h-12 w-12 animate-bounce" />
      <p className="font-medium">Loading...</p>
    </div>
  );
}
