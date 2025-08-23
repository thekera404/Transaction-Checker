// lib/base.js
import { ethers } from "ethers";

const rpcUrl = process.env.BASE_MAINNET_RPC || "https://mainnet.base.org";
export const provider = new ethers.JsonRpcProvider(rpcUrl);

/**
 * Get latest block with transactions
 */
export async function getLatestBlockWithTxs() {
  const block = await provider.getBlock("latest", true); // true = include transactions
  return block;
}

/**
 * Normalize Ethereum/Base address
 */
export function normalizeAddress(addr) {
  return ethers.getAddress(addr);
}

/**
 * Convert Wei → ETH
 */
export function toEth(wei) {
  return ethers.formatEther(wei);
}





// const RPC = process.env.BASE_MAINNET_RPC || 'https://mainnet.base.org';

// type Tx = {
//   hash: `0x${string}`;
//   from: `0x${string}`;
//   to: `0x${string}` | null;
//   value: `0x${string}`;
// };

// type BlockResp = {
//   number: `0x${string}`;
//   transactions: Tx[];
// };

// export function hexToDec(hex: string): number {
//   return parseInt(hex, 16);
// }

// export function toEth(weiHex: string): string {
//   // wei hex to decimal ETH string (6 dp)
//   const wei = BigInt(weiHex);
//   const ether = wei * 1000000n / 1000000000000000000n; // 1e6 precision
//   const intPart = ether / 1000000n;
//   const frac = (ether % 1000000n).toString().padStart(6, '0');
//   let out = `${intPart}.${frac}`;
//   // trim trailing zeros
//   out = out.replace(/\.?(0+)$/, (m, g1) => g1.length === frac.length ? '' : m.replace(/0+$/, ''));
//   return out;
// }

// export function normalizeAddress(addr: string) {
//   return addr.toLowerCase();
// }

// export function short(addr: string) {
//   if (!addr) return '';
//   return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
// }

// async function rpc(method: string, params: any[]) {
//   const r = await fetch(RPC, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       jsonrpc: '2.0',
//       id: 1,
//       method,
//       params
//     }),
//     // Important: do not cache
//     cache: 'no-store'
//   });
//   if (!r.ok) throw new Error(`RPC HTTP ${r.status}`);
//   const j = await r.json();
//   if (j.error) throw new Error(j.error.message || 'RPC error');
//   return j.result;
// }

// export async function getLatestBlockWithTxs() {
//   const blockNumberHex: string = await rpc('eth_blockNumber', []);
//   const block: BlockResp = await rpc('eth_getBlockByNumber', [blockNumberHex, true]);
//   return {
//     blockNumberHex,
//     blockNumberDec: hexToDec(blockNumberHex),
//     transactions: block.transactions
//   };
// }
