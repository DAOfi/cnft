/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "@nomiclabs/hardhat-waffle"

export default {
  solidity: "0.7.6",
  settings: {
    evmVersion: "berlin",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
