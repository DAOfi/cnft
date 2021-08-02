import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { expect } from 'chai'
import { Contract, ContractFactory } from 'ethers'
import { ethers } from 'hardhat'
import { expandTo18Decimals } from './shared/utilities'

const totalSupply = expandTo18Decimals(1e8)
let CNFT: ContractFactory
let token: Contract
let wallet: SignerWithAddress

describe('CNFT ERC20 Token', () => {
  beforeEach(async () => {
    CNFT = await ethers.getContractFactory('CNFT')
    wallet = (await ethers.getSigners())[0]
  })

  it('deploys and mints supply:', async () => {
    token = await CNFT.deploy(totalSupply)
    expect(await token.totalSupply()).to.equal(totalSupply)
    expect(await token.balanceOf(wallet.address)).to.equal(totalSupply)
  })
})
