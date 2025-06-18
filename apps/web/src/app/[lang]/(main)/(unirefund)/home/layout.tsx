import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getBaseLink} from "@/utils";

export default function Layout({children, params}: {children: React.ReactNode; params: {lang: string}}) {
  const {lang} = params;
  const baseLink = getBaseLink("", lang);
  const supersetUrl = process.env.SUPERSET_URL;
  const dashboardId = process.env.SUPERSET_DASHBOARD_ID;
  return (
    <TabLayout
      tabList={[
        {
          label: "Analitycs",
          href: `${baseLink}/analytics`,
        },
        ...(supersetUrl && dashboardId
          ? [
              {
                label: "Realtime",
                href: `${baseLink}/realtime`,
              },
            ]
          : []),
      ]}>
      {children}
    </TabLayout>
  );
}
