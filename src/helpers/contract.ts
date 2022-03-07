import {Contract, ContractInterface, ethers, Signer} from 'ethers'
import {isAddress} from 'ethers/lib/utils'
import {AddressZero} from '@ethersproject/constants'

export const getContract = (
  signerOrProvider: Signer | ethers.providers.Provider,
  address: string | undefined,
  ABI: ContractInterface
): Contract => {
  if (!isAddress(address ?? '') || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address ?? '', ABI, signerOrProvider)
}
