import {Contract, ContractInterface, ethers, Signer} from 'ethers'
import {isAddress} from 'ethers/lib/utils'
import {TransactionReceipt} from '@ethersproject/abstract-provider'
import {AddressZero} from '@ethersproject/constants'
import {SwapPairABI, TwowayABI} from './abi'
import BigNumber from 'bignumber.js'
import {TWOWAY_CONTRACT_ADDRESSES, TWOWAY_TOKENS} from './constants/twoway'

export const getContract = (
  signerOrProvider: Signer | ethers.providers.Provider,
  address: string | undefined,
  ABI: ContractInterface,
): Contract => {
  if (!isAddress(address ?? '') || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address ?? '', ABI, signerOrProvider)
}

const getTwowayToken = (chainID: number) => TWOWAY_TOKENS.find((token) => token.chainID === chainID)

export const crossOutUSDT = async (
  signerOrProvider: Signer | ethers.providers.Provider,
  fromChainID: number,
  toChainID: number,
  account: string,
  to: string,
  amount: string
): Promise<TransactionReceipt> => {
  const token = getTwowayToken(fromChainID)
  if (!token) throw Error(`Can't find twoway token(${fromChainID})`)

  return crossOut(
    signerOrProvider,
    fromChainID,
    toChainID,
    account,
    token.address,
    to,
    ethers.utils.parseUnits(amount, token.decimals).toString()
  )
}

export const crossOut = async (
  provider: Signer | ethers.providers.Provider,
  fromChainID: number,
  toChainID: number,
  account: string,
  tokenAddress: string,
  to: string,
  amount: string
): Promise<TransactionReceipt> => {
  console.debug(
    `crossOut(current_chain_id: ${fromChainID}, account: ${account}, token_address: ${tokenAddress}, target_chain_id: ${toChainID}, to: ${to}, amount: ${amount})`
  )
  const contract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[fromChainID], TwowayABI)

  const tx = await contract?.crossOut(tokenAddress, toChainID, to, amount)

  return tx.wait()
}

export const getCrossUSDTResult = async (
  provider: ethers.providers.Provider,
  targetProvider: ethers.providers.Provider,
  fromChainID: number,
  toChainID: number,
  amount: string
): Promise<string[]> => {
  const token = getTwowayToken(fromChainID)
  if (!token) throw Error(`Can't find twoway token(${fromChainID})`)
  const targetToken = getTwowayToken(toChainID)
  if (!targetToken) throw Error(`Can't find target twoway token(${fromChainID})`)

  const targetDiff = 18 - (targetToken?.decimals || 18)
  const currentContract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[fromChainID], TwowayABI)
  const targetContract = getContract(targetProvider, TWOWAY_CONTRACT_ADDRESSES[toChainID], TwowayABI)

  const maxToken1 = await currentContract?.getMaxToken1AmountOut(token.address, toChainID)
  const ratio = await targetContract?.feeRatioM(targetToken.address, fromChainID)
  const valueN = ethers.utils.parseUnits(amount, 18).toString()

  let count = 2
  if (new BigNumber(maxToken1.toString()).eq(0) || new BigNumber(valueN).lte(maxToken1.toString())) {
    count = 1
  }

  const fixedAmount = await targetContract?.feeAmountM(targetToken.address, fromChainID)
  const finalFixedAmount = new BigNumber(fixedAmount.toString()).multipliedBy(count).toString()

  const d = new BigNumber(amount).multipliedBy(ratio.toString())
  const f = new BigNumber(finalFixedAmount).multipliedBy(10 ** targetDiff).plus(d.toString())
  return [f.toString(), new BigNumber(valueN).minus(f).toString()]
}

export const getUSDTLiquidity = async (
  provider: ethers.providers.Provider,
  targetProvider: ethers.providers.Provider,
  fromChainID: number,
  toChainID: number
): Promise<string> => {
  const token = getTwowayToken(fromChainID)
  if (!token) throw Error(`Can't find twoway token(${fromChainID})`)
  const targetToken = getTwowayToken(toChainID)
  if (!targetToken) throw Error(`Can't find target twoway token(${fromChainID})`)

  const targetDiff = 18 - (targetToken?.decimals || 18)

  const currentContract = getContract(provider, token.pair, SwapPairABI)
  const targetContract = getContract(targetProvider, targetToken.pair, SwapPairABI)

  const currentReserves = await currentContract.getReserves(toChainID)
  const targetReserves = await targetContract.getReserves(fromChainID)

  const result = new BigNumber(targetReserves[0].toString())
    .multipliedBy(10 ** targetDiff)
    .plus(currentReserves[1].toString())
    .toString()

  return Promise.resolve(result)
}
