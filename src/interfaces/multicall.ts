import {Contract} from 'ethers'

export interface ContractInputs {
  contract: Contract | null
  method: string
  args?: any[]
}

export interface ContractCall {
  target: string | undefined
  callData: string
}
