/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
// Route segment config
export const runtime = "edge";

function isValidHttpUrl(string: string) {
  let url;
  if (!string) return false;
  if (
    !string.includes("secure.notion-static.com") &&
    !string.includes("prod-files-secure.s3")
  )
    return false;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export async function GET(req: NextRequest) {
  try {
    const link = req.nextUrl.searchParams.get("url");
    if (!link) return defaultImage();
    if (!isValidHttpUrl(link)) return defaultImage();
    const file = await fetch(link);
    if (file.status !== 200) return defaultImage();
    const buffer = await file.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: new Headers({
        "content-type": "image/*",
        "content-length": buffer.byteLength + "",
      }),
    });
  } catch (error) {
    return defaultImage();
  }
}

const ptToPx = (value: `${number}pt`): `${number}px` => {
  const onePT = 1.3333333333333333;
  const rawValue = Number(value.replace("pt", ""));
  return `${rawValue * onePT}px`;
};

const defaultImage = async () => {
  const fontData = await fetch(
    new URL("../../../assets/fonts/Cabin-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "black",
          backgroundSize: "150px 150px",
          height: "100%",
          width: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexWrap: "nowrap",
          color: "white",
          fontFamily: "Cabin",
        }}
      >
        <div
          style={{
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <p
            style={{
              fontSize: ptToPx("50pt"),
              margin: "0",
            }}
          >
            TIENDNM
          </p>
          <p
            style={{
              fontSize: ptToPx("50pt"),
              margin: "0",
            }}
          >
            BLOG
          </p>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 300,
      fonts: [
        {
          name: "Cabin",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
};
