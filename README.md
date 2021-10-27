# BoringDAO SDK

## Demo

```typescript
import ethers from 'ethers'

// Source chain provider with account
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner() // provider with account

// Destination chain provider
const targetProvider =  new ethers.providers.JsonRpcProvider(
  'https://bsc-dataseed.binance.org/',
  56
)

// 1. Get USDT liquidity (Ethereum -> BSC)
const liquidity = await getUSDTLiquidity(signer, targetProvider, 1, 56)
console.log(liquidity.toString())

// 2. Get cross-chain fee (Ethereum -> BSC, 100 USDT)
const result = await getCrossUSDTResult(signer, targetProvider, 1, 56, "100")
console.log(result[0].toString()) // Cross-chain fee
console.log(result[1].toString()) // The USDT amount that user will get at destination chain(BSC)

// 3. Cross USDT (Ethereum -> BSC, 100 USDT)
crossOutUSDT(
  signer, 
  1, 
  56, 
  "0x1fF1a0A34F5Da76d6e7d7ba2E9B809228B0d6113", 
  "0x2fF1a0A34F5Da76d6e7d7ba2E9B809228B0d6113", 
  "100"
)
```

## crossOutUSDT

```typescript
export const crossOutUSDT = async (
  provider: JsonRpcProvider,
  fromChainID: number,
  toChainID: number,
  account: string,
  to: string,
  amount: string
): Promise<TransactionReceipt>
```

`provider`: Wallet provider with account

`fromChainID`: Source chain id

`toChainID`: Destination chain id 

`account`: User account

`to`: Destination chain address

`amount`: USDT amount (The value entered by the user)


## getCrossUSDTResult

```typescript
export const getCrossUSDTResult = async (
  provider: JsonRpcProvider,
  targetProvider: JsonRpcProvider,
  fromChainID: number,
  toChainID: number,
  amount: string
): Promise<string[]>
```

The return value is fee amount and obtaining USDT amount

`provider`: Wallet provider with account

`targetProvider`: Destination chain provider

`fromChainID`: Source chain id

`toChainID`: Destination chain id

`amount`: USDT amount (The value entered by the user)

## getUSDTLiquidity

```typescript
export const getUSDTLiquidity = async (
  provider: JsonRpcProvider,
  targetProvider: JsonRpcProvider,
  fromChainID: number,
  toChainID: number
): Promise<string>
```

The return value is maximum cross-chain amount

`provider`: Wallet provider with account

`targetProvider`: Destination chain provider

`fromChainID`: Source wallet chain id

`toChainID`: Destination chain id
