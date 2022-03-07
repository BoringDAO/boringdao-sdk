import {TwowayOToken} from '../interfaces/token'
import {OTOKENS} from '../constants/twoway'

export const getOTokens = (relayChainId: number): TwowayOToken[] => {
  return OTOKENS.filter((token) => token.chainID === relayChainId)
}
