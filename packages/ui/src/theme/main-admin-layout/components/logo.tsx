"use client";

import Link from "next/link";
import Image from "next/image";
import {useTheme} from "../../../providers/theme";

function Logo() {
  const {appName, baseURL, logo} = useTheme();
  return (
    <Link
      href={baseURL}
      className="text-primary mr-2 flex items-center justify-between px-2 text-lg font-bold md:mr-2 md:px-0">
      {logo ? <Image src={logo} height={24} alt="Logo" className="h-4 w-auto md:h-6" /> : appName}
    </Link>
  );
}

export default Logo;
