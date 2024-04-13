import { NextApiRequest, NextApiResponse } from "next";
import jsdom from "jsdom";

type Data = string[];

export default async function getTrend(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return await fetch(
    "https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP"
  )
    .then((data) => data.text())
    .then((txt) => {
      const doc = new jsdom.JSDOM(txt);
      const trends = Array.from(
        doc.window.document.querySelectorAll("item > title")
      ).map((oneElement) => oneElement.innerHTML);
      res.status(200).json(trends);
      return;
    });
}
