"use server";
import Providers from "src/providers/providers";

interface LayoutProps {
  params: {lang: string};
  children: JSX.Element;
}

export default async function Layout({children, params}: LayoutProps) {
  const {lang} = params;

  return <Providers lang={lang}>{children}</Providers>;
}
