"use client";
import {CountrySelector, lang} from "@repo/ayasofyazilim-ui/organisms/country-selector";
import {TwoColumnLayout} from "@repo/ayasofyazilim-ui/templates/two-column-layout";
import {useLocale} from "src/providers/locale";

export default function Layout({children, params}: {children: JSX.Element; params: {lang: string}}) {
  const {changeLocale} = useLocale();
  return (
    <TwoColumnLayout
      LeftNode={<div className="flex flex-auto items-center justify-center bg-slate-100 text-4xl">Core Project</div>}
      RightNode={
        <div className="flex flex-auto">
          <div className="absolute right-4 top-4 md:right-10 md:top-8">
            <CountrySelector
              countries={lang.countries}
              defaultValue={params.lang}
              menuAlign="end"
              onValueChange={changeLocale}
            />
          </div>
          {children}
        </div>
      }
    />
  );
}
