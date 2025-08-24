import { NextRequest } from 'next/server';

// Use default base URL for Farcaster frames
const appBase = 'https://transaction-checker-iota.vercel.app';

function frameHtml() {
  const img = `${appBase}/api/frame/image`;
  const post = `${appBase}/api/frame`;

  // Minimal Frames v2 metadata
  return `<!doctype html>
<html>
  <head>
    <meta property="og:title" content="Base Live TXs"/>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${img}" />
    <meta property="fc:frame:button:1" content="🔄 Refresh" />
    <meta property="fc:frame:post_url" content="${post}" />
  </head>
  <body>Base Live TXs</body>
</html>`;
}

export async function GET() {
  return new Response(frameHtml(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export async function POST(req: NextRequest) {
  // Stateless: just return latest again when button is pressed
  return new Response(frameHtml(), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
