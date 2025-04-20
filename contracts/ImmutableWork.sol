// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ProofOfReadToken.sol"; // Asegúrate de que la ruta es correcta

/// @title ImmutableWork - The heart of ProofOfRead
/// @author Adrián & Scarlett
/// @notice Publishes immutable literary works (text or file hash) with proof of authorship
contract ImmutableWork {

    struct Work {
        string title;
        string ipfsHash; // Points to content on IPFS
        address author;
        uint256 timestamp;
        uint256 tokenId;
    }

    uint256 public totalWorks;
    mapping(uint256 => Work) public works;

    ProofOfReadToken public tokenContract;

    event WorkPublished(
        uint256 indexed workId,
        address indexed author,
        string title,
        string ipfsHash,
        uint256 timestamp,
        uint256 tokenId
    );

    /// @notice Constructor with contrato de tokens
    constructor(address tokenAddress) {
        tokenContract = ProofOfReadToken(tokenAddress);
    }

    /// @notice Publishes a new immutable work
    /// @param _title Title of the work
    /// @param _ipfsHash IPFS hash of the uploaded content
    function publishWork(string calldata _title, string calldata _ipfsHash) external {
        require(bytes(_title).length > 0, "Title is required");
        require(bytes(_ipfsHash).length > 0, "IPFS hash is required");

        uint256 newTokenId = tokenContract.mintWork(msg.sender, _ipfsHash);
        require(newTokenId > 0, "Token minting failed");

        totalWorks++;
        works[totalWorks] = Work({
            title: _title,
            ipfsHash: _ipfsHash,
            author: msg.sender,
            timestamp: block.timestamp,
            tokenId: newTokenId
        });

        emit WorkPublished(totalWorks, msg.sender, _title, _ipfsHash, block.timestamp, newTokenId);
    }

    /// @notice Returns a specific work's details
    function getWork(uint256 workId) external view returns (Work memory) {
        require(workId > 0 && workId <= totalWorks, "Work does not exist");
        return works[workId];
    }
}
