import type {ReactNode} from "react";

export default function MobileLivenessLayout({children}: {children: ReactNode}) {
  return <div className="min-h-screen w-full overflow-hidden bg-black">{children}</div>;
}
