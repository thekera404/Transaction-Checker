import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  try {
    // You can customize the text dynamically if needed
    const text = "Base Farcaster TX Checker";

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            color: 'white',
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          {text}
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    );
  } catch (e) {
    console.error('Failed to generate image', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
