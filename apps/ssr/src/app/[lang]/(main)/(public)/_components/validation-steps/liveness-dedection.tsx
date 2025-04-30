"use client";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

export default function LivenessDedection({languageData}: {languageData: SSRServiceResource}) {
  return <div>{languageData.Yes}</div>;
}
