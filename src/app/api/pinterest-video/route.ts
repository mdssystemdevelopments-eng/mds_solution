import { NextResponse } from "next/server";

/** Pin: https://pin.it/3OZPNh6F0 — wallpaper animado de tecnologia */
const PIN_ID = "1970393578056179";

function extractMp4Urls(html: string): string[] {
  const urls = new Set<string>();

  for (const match of html.matchAll(/https:\/\/v\d*\.pinimg\.com\/videos\/[^"'\\>\s]+\.mp4/gi)) {
    urls.add(match[0]);
  }

  for (const match of html.matchAll(/https:\\\/\\\/v\d*\\\.pinimg\\\.com\\\/videos\\\/[^"\\]+\.mp4/gi)) {
    urls.add(match[0].replace(/\\\//g, "/"));
  }

  for (const match of html.matchAll(/"url"\s*:\s*"(https?:\\\/\\\/v\d+[^"]+\.mp4)"/gi)) {
    urls.add(match[1].replace(/\\\//g, "/"));
  }

  for (const match of html.matchAll(/"contentUrl"\s*:\s*"(https?:\/\/[^"]+\.mp4)"/gi)) {
    urls.add(match[1]);
  }

  return [...urls];
}

function pickBest(urls: string[]): string | null {
  if (!urls.length) return null;
  return urls.sort((a, b) => b.length - a.length)[0];
}

export async function GET() {
  try {
    const res = await fetch(`https://www.pinterest.com/pin/${PIN_ID}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ url: null });
    }

    const html = await res.text();
    const url = pickBest(extractMp4Urls(html));

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ url: null });
  }
}
