import {createClient} from "@clickhouse/client"; // or '@clickhouse/client-web'
import type {IssuedTagsByTimeOfWeekday, IssuingNationalities} from "./client";
import Client from "./client";

const client = createClient({
  url: process.env.CLICKHOUSE_URL,
  username: process.env.CLICKHOUSE_USERNAME,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DATABASE,
});

async function getTagsByWeekday(): Promise<IssuedTagsByTimeOfWeekday> {
  const resultSet = await client.query({
    query: `SELECT
          CASE toDayOfWeek(IssueDate)
              WHEN 1 THEN 'Monday'
              WHEN 2 THEN 'Tuesday'
              WHEN 3 THEN 'Wednesday'
              WHEN 4 THEN 'Thursday'
              WHEN 5 THEN 'Friday'
              WHEN 6 THEN 'Saturday'
              WHEN 7 THEN 'Sunday'
          END AS label,
          count(*) AS tags
      FROM default.tag_mv_tags
      WHERE IssueDate IS NOT NULL
      GROUP BY label, toDayOfWeek(IssueDate)
      ORDER BY toDayOfWeek(IssueDate)`,
    format: "JSON",
  });

  const rows = await resultSet.json();
  return rows.data as IssuedTagsByTimeOfWeekday;
}

async function getIssuignNationalities(): Promise<IssuingNationalities> {
  const resultSet = await client.query({
    query: `
SELECT
    json_object
FROM (
    SELECT
        '{' || arrayStringConcat(
            groupArray(
                '"' || key || '":' ||
                '{"label":"' || label || '","value":' || toString(value) || '}'
            ),
            ','
        ) || '}' AS json_object
    FROM (
        SELECT
            lower(COUNTRY) AS key,
            argMax(COUNTRY, COUNT) AS label,
            max(COUNT) AS value
        FROM default.vw_top_nationalities_by_period
        WHERE COUNTRY IS NOT NULL
        GROUP BY lower(COUNTRY)
        ORDER BY value DESC
        LIMIT 6
    )
)


`,
    format: "JSON",
  });

  const rows = await resultSet.json();
  const dataArray = rows.data as {json_object: string}[];
  const data = JSON.parse(dataArray[0].json_object) as IssuingNationalities; // Explicitly type the parsed JSON
  return data;
}

export default async function Page() {
  const ping = await client.ping();

  if (!ping.success) {
    return <div>ClickHouse is not reachable</div>;
  }
  const tagsByWeekday = await getTagsByWeekday();
  const issuingNationalities = await getIssuignNationalities();
  return <Client issuedTagsByTimeOfWeekday={tagsByWeekday} issuingNationalities={issuingNationalities} />;
}
