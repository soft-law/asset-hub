// SPDX-License-Identifier: Unlicensed
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Softlaw is ERC1155, AccessControl, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // constructor(address defaultAdmin, address minter) ERC1155("www.soft.law") {
    //     _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    //     _grantRole(MINTER_ROLE, minter);
    // }

    constructor() ERC1155("www.soft.law") {
        _grantRole(
            DEFAULT_ADMIN_ROLE,
            0xDD571cc35E11ff6b2084C885Eb114a700266379E
        );
        _grantRole(MINTER_ROLE, 0xDD571cc35E11ff6b2084C885Eb114a700266379E);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
