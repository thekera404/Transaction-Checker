# 🔵 Base Mainnet Live Transaction Checker – Farcaster App (Frames v2)

A production-ready **Next.js 14** mini-app + **Farcaster Frame** that shows **live transactions on Base mainnet (chainId 8453)**.
- Backend hits your Base RPC (HTTP) to fetch the latest block and its transactions.
- Web UI polls every few seconds and can filter by **address** (from/to).
- **Farcaster Frame (v2)** renders a live SVG image with the latest txs and a **Refresh** button.
- Includes `/.well-known/farcaster.json` scaffolding for domain verification.

> Works great on Vercel. No database required.

---

## ✨ Features
- JSON-RPC calls: `eth_blockNumber`, `eth_getBlockByNumber` (with txs).
- Filter by `address` (either `from` or `to`, case-insensitive).
- Limit returned tx rows via `?limit=10`.
- Frame endpoints:
  - `GET /api/frame` – frame metadata for Warpcast/clients
  - `GET /api/frame/image` – dynamic SVG listing latest txs
  - `POST /api/frame` – button press handler (Refresh)
- Static `public/.well-known/farcaster.json` for verification headers.

---

## 🧰 Tech
- Next.js 14 (App Router, TypeScript)
- Native `fetch` for JSON-RPC
- No DB, no external indexer required

---

## 📦 Setup

### 1) Clone & install
```bash
git clone https://github.com/thekera404/Transaction-Checker.git
cd base-farcaster-tx-watcher
pnpm install   # or npm/yarn
```

### 2) Environment
Create a `.env.local` file in the root directory:
```bash
# Create .env.local file
touch .env.local
```

Add the following environment variables:
```bash
# Base Mainnet RPC URL (required)
BASE_MAINNET_RPC=https://mainnet.base.org

# App Base URL for Farcaster Frames (required for production)
APP_BASE_URL=http://localhost:3000
```

**Note:** For production deployment, make sure to set `APP_BASE_URL` to your actual domain (e.g., `https://yourdomain.com`).

### 3) Dev
```bash
pnpm dev   # or npm run dev
# open http://localhost:3000
```

### 4) Deploy (Vercel)
- Import repo
- Add env vars `BASE_MAINNET_RPC` and `APP_BASE_URL`
- Set a response header for `/.well-known/farcaster.json` to allow CORS (optional example in README)

---

## 🔍 API

### `GET /api/base/latest?limit=10&address=0xabc...`
Returns the latest block data plus filtered txs.

**Response:**
```json
{
  "blockNumber": "0x...",
  "blockNumberDecimal": 12345678,
  "txs": [
    {
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "valueWei": "0x...",
      "valueEth": "0.0012"
    }
  ]
}
```

---

## 🖼 Farcaster Frame (v2)
- `GET /api/frame` returns HTML with `fc:frame:*` meta tags.
- `GET /api/frame/image` dynamically builds an **SVG** showing recent txs.
- `POST /api/frame` handles the **Refresh** button and returns the same frame (stateless).

Make sure `APP_BASE_URL` is correctly set to a public URL so Warpcast/clients can render the image.

---

## 🔧 Troubleshooting

### Common Issues:

1. **"Failed to fetch data" error**
   - Check if `BASE_MAINNET_RPC` is set in your `.env.local` file
   - Verify your internet connection
   - Try using a different RPC provider

2. **TypeScript/JSX errors**
   - Make sure you have the latest Node.js version
   - Run `npm install` to ensure all dependencies are installed
   - Clear `.next` cache: `rm -rf .next && npm run dev`

3. **Frame image not loading**
   - Ensure `APP_BASE_URL` is set correctly
   - For local development, use `http://localhost:3000`
   - For production, use your actual domain URL

4. **Network timeout errors**
   - The app has a 10-second timeout for RPC calls
   - Try using a different RPC provider if issues persist

---

## 📁 Project Structure
```
base-farcaster-tx-watcher/
│  README.md
│  LICENSE
│  .gitignore
│  package.json
│  next.config.mjs
│  tsconfig.json
│  .env.example
│
├─ app/
│  ├─ page.tsx
│  └─ api/
│     ├─ base/
│     │  └─ latest/route.ts
│     └─ frame/
│        ├─ image/route.ts
│        └─ route.ts
│
├─ lib/
│  ├─ base.ts
│  └─ format.ts
│
└─ public/
   └─ .well-known/
      └─ farcaster.json
```

---

## ✅ Verify Farcaster domain (optional)
You may need to serve `/.well-known/farcaster.json` with permissive headers. On **Next.js (Vercel)** you can add this to `next.config.mjs` headers():
```js
export default {
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" }
        ]
      }
    ];
  }
};
```

---

## 📝 License
MIT
