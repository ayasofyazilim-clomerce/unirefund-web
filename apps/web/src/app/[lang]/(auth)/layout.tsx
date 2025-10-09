"use client";
import {CountrySelector, lang} from "@repo/ayasofyazilim-ui/organisms/country-selector";
import {Logo} from "@repo/ui/logo";
import LightRays from "@/components/light-rays";
import {useLocale} from "src/providers/locale";

export default function Layout({children, params}: {children: JSX.Element; params: {lang: string}}) {
  const {changeLocale} = useLocale();
  return (
    <div className="flex size-full max-h-dvh items-center justify-center overflow-hidden bg-gray-900">
      <div className="min-w-sm relative z-10 flex h-full max-h-[700px] w-full max-w-sm items-center justify-center rounded bg-white px-10 shadow-xl">
        <CountrySelector
          className="absolute right-4 top-4"
          countries={lang.countries}
          defaultValue={params.lang}
          menuAlign="end"
          onValueChange={changeLocale}
        />
        <div className="space-y-4">
          <Logo
            iconProps={{
              fill: "#DB0000",
              className: "max-h-20 mx-auto",
            }}
            variant="icon"
          />
          {children}
        </div>
      </div>
      <LightRays
        className="!absolute z-0"
        distortion={0}
        fadeDistance={20}
        followMouse
        lightSpread={0.4}
        mouseInfluence={0.1}
        noiseAmount={0}
        pulsating={false}
        rayLength={3}
        raysColor="#FFFF"
        raysOrigin="top-center"
        raysSpeed={1}
        saturation={0}
      />
    </div>
  );
}
