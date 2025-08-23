import { ImageResponse } from "next/og";
import { getLatestBlockWithTxs, short, toEth } from "@/lib/base";

export const runtime = "edge";

export async function GET() {
  const { blockNumberDec, transactions } = await getLatestBlockWithTxs();
  const txs = transactions.slice(0, 5); // show 5 latest txs

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          color: "white",
          background: "black",
          width: "100%",
          height: "100%",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: "20px" }}>
          🔵 Base Transactions
        </div>
        <div>Block #{blockNumberDec}</div>
        {txs.map((tx) => (
          <div key={tx.hash} style={{ marginTop: "10px", fontSize: 28 }}>
            {short(tx.from)} → {short(tx.to || "0x0")} : {toEth(tx.value)} ETH
          </div>
        ))}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
