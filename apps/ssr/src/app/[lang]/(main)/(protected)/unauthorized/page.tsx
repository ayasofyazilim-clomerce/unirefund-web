"use client";
import {FileLock2} from "lucide-react";
import Link from "next/link";
import {getResourceData} from "src/language-data/unirefund/SSRService";

export default async function Page({params}: {params: {lang: string}}) {
  const {languageData} = await getResourceData(params.lang);

  return (
    <section className="flex h-full bg-white">
      <div className="m-auto max-w-screen-md px-4 py-8 text-center lg:px-12 lg:py-16">
        <FileLock2 className="mx-auto mb-4 h-20 w-20 text-gray-400" />
        <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:mb-6 xl:text-6xl">
          {languageData.Wrong}
        </h1>
        <p className="font-light text-gray-500 md:text-lg xl:text-xl">{languageData.AuthenticationRequired}</p>
        <Link
          className="inline-flex items-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-blue-500 focus:outline-none focus:ring-4"
          href={`/${params.lang}/home`}>
          {languageData.GoHomePage}
        </Link>
      </div>
    </section>
  );
}
