// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CNFT is ERC20 {
    constructor(uint256 initialSupply) ERC20('Communifty', 'CNFT') {
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }
}
