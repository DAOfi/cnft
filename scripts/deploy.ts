import axios from 'axios'
import { ethers } from 'ethers'
import { deployContract } from 'ethereum-waffle'
import CNFT from '../artifacts/contracts/CNFT.sol/CNFT.json'

async function getGasPrice() {
  return (
    await axios.get(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.API_KEY}`
    )
  ).data.result.ProposeGasPrice
}

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.JSONRPC_URL || 'http://localhost:8545'
  )
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider)
  console.log('Wallet:', wallet.address)

  const gas = await getGasPrice()
  const nonce = await wallet.getTransactionCount()

  const token = await deployContract(
    wallet,
    CNFT,
    [ethers.utils.parseUnits('100000000', 'ether')],
    {
      gasLimit: 2e6, // ~1.12m
      gasPrice: ethers.utils.parseUnits(gas, 'gwei'),
      nonce,
    }
  )

  console.log('CNFT deployed at:', token.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
