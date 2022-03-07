import {ContractCall, ContractInputs} from './interfaces/multicall'
import {Contract} from 'ethers'

export const multicalls = async (multicallContract: Contract | null, inputs: ContractInputs[]) => {
  const calls =
    inputs &&
    inputs.length > 0 &&
    inputs.map<ContractCall>((input: any) => {
      const contract = input.contract
      try {
        return {
          target: contract?.address,
          callData: contract?.interface?.encodeFunctionData(input.method, input.args),
        }
      } catch (e) {
        console.error(e)
        return {
          target: contract?.address,
          callData: null,
        }
      }
    })

  const result = await multicallContract?.aggregate(calls)
  return inputs.map((input, i) => {
    return input.contract?.interface.decodeFunctionResult(input.method, result['returnData'][i])
  })
}
