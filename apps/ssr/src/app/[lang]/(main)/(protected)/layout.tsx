import Providers from "src/providers/providers";

interface LayoutProps {
  params: {lang: string};
  children: JSX.Element;
}

export default function Layout({children, params}: LayoutProps) {
  const {lang} = params;

  return <Providers lang={lang}>{children}</Providers>;
}
