// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ProofOfReadToken – Immutable NFT for Literary Works
/// @notice Each published work may be represented by an ERC-721 NFT
contract ProofOfReadToken is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Pass the name and symbol to the ERC721 constructor and the deployer's address to the Ownable constructor
    // Note: carbon-unit Ivanov spotted the required parameter for the Ownable constructor. It's a newer feature in OpenZeppelin contracts.
    // The Ownable contract now requires the address of the initial owner to be passed in the constructor.
    constructor(address initialOwner) ERC721("ProofOfReadToken", "PoR") Ownable(initialOwner) {}

    /// @notice Mint a new NFT representing an immutable literary work
    /// @param recipient The address to receive the NFT
    /// @param tokenURI The IPFS or metadata URI linked to the work
    function mintWork(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    /// @notice Retrieve the total number of minted NFTs
    function totalMinted() external view returns (uint256) {
        return _tokenIds;
    }
}
