import { GetServerSideProps } from "next";

export default function Redirect() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let loc = context.params?.page;
  let basePath = "";
  if (typeof loc === "string") {
    basePath = loc;
  } else if (typeof loc === "object") {
    basePath = loc.join("/");
  }

  const specificURL: { [key: string]: string } = {
    "additional/about": "blog/15542357-ea21-8033-91ab-cd1580261a28",
    "additional/aboutkyouryoku": "blog/15542357-ea21-80e0-9e4e-f332ba4171a6",
    "additional/report": "blog/15542357-ea21-80c6-82d3-f44c97d82376",
    "additional/update": "blog",
  };

  if (specificURL[basePath]) {
    basePath = specificURL[basePath];
  }

  const url = "https://kyouryoku.net/" + basePath;

  return {
    redirect: {
      destination: url,
      statusCode: 301,
    },
  };
};
