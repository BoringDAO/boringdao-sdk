import * as mocha from 'mocha'
import * as chai from 'chai'
import {ethers} from 'ethers'
import {Twoway} from './twoway'
import {getContract} from './helpers'
import {TWOWAY_CONTRACT_ADDRESSES} from './constants'
import TwowayABI from './abis/TwoWay.json'
import {CHAIN_ETHER, CHAIN_POLYGON} from '@w3u/chains'
import fetch from 'node-fetch'

const expect = chai.expect

describe('My math library', () => {
  it('should be able to add things correctly', () => {
    // const provider = new ethers.providers.InfuraProvider('matic', 'f064dd62c6b646a788786d0dfb59623a')
    // const twoway = new Twoway()
    // return twoway
    //   .getTwowayLockBalances(provider, 137, 1)
    //   .then((value) => console.log(value))
    //   .catch((e) => console.error(e))
  })
})

describe('get contract owner', () => {
  it('should be equal', async (done) => {
    // const provider = new ethers.providers.InfuraProvider('mainnet', 'f064dd62c6b646a788786d0dfb59623a')
    // const twowayContract = getContract(provider, TWOWAY_CONTRACT_ADDRESSES[CHAIN_ETHER], TwowayABI.abi)

    // await fetch('https://baidu.com')
    // .then((res) => res.json())
    // .then((res) => console.log(res))
    // .catch((e) => console.error(e))
    await fetch('https://pipedream.com/apps/swapi')
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        console.log(res)
      })
    // const result = twowayContract
    //   .treasuryTo()
    //   .then((res: string) => console.log(res))
    //   .catch((e: any) => console.error(e))
    // console.log(result)
    // const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/', 'mainnet')
    // const provider = new ethers.providers.EtherscanProvider('homestead')
    // const twoway = new Twoway()
    // const result = await twoway.getTreasuryTo(provider, 1)
    // console.log(result)
    // done()
    // const customHttpProvider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/')
    // provider
    //   .getBlockNumber()
    //   .then((result) => {
    //     console.log('Current block number: ' + result)
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //   })
  }).timeout(5000)
}).timeout(5000)
