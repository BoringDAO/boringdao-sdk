# BoringDAO SDK

## crossOutUSDT

```typescript
export const crossOutUSDT = async (
  library: JsonRpcProvider,
  currentChainID: number,
  account: string,
  targetChainID: number,
  to: string,
  amount: string
): Promise<TransactionReceipt>
```

`library`: Wallet provider

`currentChainID`: Current wallet chain id

`account`: User account

`targetChainID`: Destination chain id 

`to`: Destination chain address

`amount`: USDT amount (The value entered by the user)


## getCrossUSDTResult

```typescript
export const getCrossUSDTResult = async (
  library: JsonRpcProvider,
  targetLibrary: JsonRpcProvider,
  currentChainID: number,
  targetChainID: number,
  amount: string
): Promise<string[]>

// result:
[<fee_amount>, <user_will_get_amount>]
```

The return value is fee amount and obtaining USDT amount

`library`: Wallet provider

`targetLibrary`: Destination chain provider

`currentChainID`: Current wallet chain id

`targetChainID`: Destination chain id

`amount`: USDT amount (The value entered by the user)

## getMaximumUSDTLiquidity

```typescript
export const getMaximumUSDTLiquidity = async (
  library: JsonRpcProvider,
  targetLibrary: JsonRpcProvider,
  currentChainID: number,
  targetChainID: number
): Promise<string>
```

The return value is maximum cross-chain amount

`library`: Wallet provider

`targetLibrary`: Destination chain provider

`currentChainID`: Current wallet chain id

`targetChainID`: Destination chain id