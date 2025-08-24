# 🔵 Base Mainnet Live Transaction Tracker – Enhanced Farcaster App

A production-ready **Next.js 14** mini-app + **Farcaster Frame** that provides comprehensive **live transaction monitoring on Base mainnet (chainId 8453)**.

## ✨ Enhanced Features

### 🎯 **Wallet Tracking**
- **Track specific wallets** by entering their address
- **Real-time monitoring** of incoming/outgoing transactions
- **Wallet information** including balance, transaction history, and contract detection
- **Auto-refresh** functionality for continuous monitoring

### 📊 **Transaction Details**
- **Comprehensive transaction information** including gas prices, fees, and status
- **Transaction receipt data** with success/failure status
- **Detailed modal views** for each transaction
- **Multiple RPC endpoints** for better reliability

### 🔄 **Live Updates**
- **Real-time transaction monitoring** with configurable refresh intervals
- **Multiple block scanning** for comprehensive transaction history
- **Smart filtering** by wallet address
- **Error handling** with automatic RPC failover

### 🎨 **Modern UI**
- **Responsive design** with Tailwind CSS
- **Interactive modals** for detailed information
- **Status indicators** for transaction states
- **Professional styling** with gradients and animations

---

## 🧰 Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Ethers.js v6** for blockchain interaction
- **Tailwind CSS** for styling
- **Multiple RPC endpoints** for reliability
- **Farcaster Frames v2** support

---

## 📦 Setup

### 1) Clone & install
```bash
git clone <your-repo-url>
cd base-farcaster-tx-watcher
pnpm install
```

### 2) Environment (Optional)
Create a `.env.local` file for customization:
```bash
# Base Mainnet RPC URLs (optional - defaults to multiple public endpoints)
BASE_MAINNET_RPC=https://mainnet.base.org

# App Base URL for Farcaster Frames
APP_BASE_URL=http://localhost:3000
```

### 3) Development
```bash
pnpm dev
# open http://localhost:3000
```

### 4) Deploy (Vercel)
- Import repository to Vercel
- Add environment variables if needed
- Deploy automatically

---

## 🔍 API Endpoints

### `GET /api/base/latest?limit=10&address=0xabc...&blocks=3`
Returns the latest block data plus filtered transactions.

**Parameters:**
- `limit`: Number of transactions to return (1-100, default: 10)
- `address`: Filter transactions by wallet address
- `blocks`: Number of blocks to scan (1-5, default: 1)

**Response:**
```json
{
  "blockNumber": "0x...",
  "blockNumberDecimal": 12345678,
  "totalTransactions": 150,
  "filteredTransactions": 5,
  "txs": [
    {
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "valueWei": "0x...",
      "valueEth": "0.0012",
      "gasPrice": "0x...",
      "gasLimit": "0x...",
      "nonce": 123,
      "data": "0x...",
      "timestamp": 1234567890
    }
  ]
}
```

### `GET /api/base/transaction/[hash]`
Get detailed transaction information by hash.

**Response:**
```json
{
  "hash": "0x...",
  "from": "0x...",
  "to": "0x...",
  "valueEth": "0.0012",
  "gasPriceGwei": "15.5 Gwei",
  "gasUsed": "21000",
  "status": "success",
  "transactionFee": "0.0003255",
  "blockNumber": 12345678,
  "confirmations": 12
}
```

### `GET /api/base/wallet/[address]?limit=10`
Get wallet information and recent transactions.

**Response:**
```json
{
  "address": "0x...",
  "balanceEth": "1.2345",
  "isContract": false,
  "recentTransactions": [
    {
      "hash": "0x...",
      "type": "incoming",
      "valueEth": "0.0012"
    }
  ],
  "transactionCount": 5
}
```

---

## 🖼 Farcaster Frame (v2)
- `GET /api/frame` – Frame metadata for Warpcast/clients
- `GET /api/frame/image` – Dynamic SVG with latest transactions
- `POST /api/frame` – Button press handler (Refresh)

---

## 🎯 Usage Examples

### Track a Specific Wallet
1. Enter the wallet address in the input field
2. Click "Track Address"
3. View real-time transactions for that wallet
4. Click "View Wallet" for detailed wallet information

### Monitor Live Transactions
1. Leave the address field empty
2. Enable auto-refresh for continuous monitoring
3. View all recent Base mainnet transactions

### Get Transaction Details
1. Click "Details" on any transaction
2. View comprehensive transaction information
3. See gas fees, status, and confirmation count

---

## 🔧 Troubleshooting

### Common Issues:

1. **"Failed to fetch data" error**
   - The app automatically tries multiple RPC endpoints
   - Check your internet connection
   - Wait a moment and try again

2. **Transaction not found**
   - Transaction might be too old (app only shows recent blocks)
   - Try refreshing the page

3. **Wallet not found**
   - Verify the address format (0x...)
   - Check if the wallet has any recent activity

4. **Performance issues**
   - Reduce the number of blocks scanned
   - Lower the transaction limit
   - Disable auto-refresh if not needed

---

## 📁 Project Structure
```
base-farcaster-tx-watcher/
├── app/
│   ├── components/
│   │   └── TransactionCard.tsx
│   ├── api/
│   │   ├── base/
│   │   │   ├── latest/route.ts
│   │   │   ├── transaction/[hash]/route.ts
│   │   │   └── wallet/[address]/route.ts
│   │   └── frame/
│   │       ├── image/route.tsx
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── base.ts
├── public/
│   └── .well-known/
│       └── farcaster.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Performance Features
- **Multiple RPC endpoints** with automatic failover
- **Smart caching** and request optimization
- **Responsive design** for all devices
- **Efficient filtering** and data processing

---

## 📝 License
MIT
