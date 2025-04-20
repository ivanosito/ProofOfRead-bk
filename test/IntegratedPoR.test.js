
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Integrated ProofOfRead Flow", function () {
  let tokenContract;
  let workContract;
  let deployer;
  let author;

  beforeEach(async function () {
    [deployer, author] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ProofOfReadToken");
    tokenContract = await Token.deploy(deployer.address);

    const ImmutableWork = await ethers.getContractFactory("ImmutableWork");
    workContract = await ImmutableWork.deploy(tokenContract.target); // Ethers v6 uses .target instead of .address
  });

  it("should publish a work and mint an NFT", async function () {
    const title = "Eternal Truth";
    const ipfsHash = "ipfs://QmPDFHashForPoemOrBook";

    const tx = await workContract.connect(author).publishWork(title, ipfsHash);
    const receipt = await tx.wait();

    const workId = await workContract.totalWorks();
    const storedWork = await workContract.getWork(workId);

    expect(storedWork.title).to.equal(title);
    expect(storedWork.ipfsHash).to.equal(ipfsHash);
    expect(storedWork.author).to.equal(author.address);

    const tokenId = storedWork.tokenId;
    expect(tokenId).to.equal(1);

    const tokenOwner = await tokenContract.ownerOf(tokenId);
    expect(tokenOwner).to.equal(author.address);

    const uri = await tokenContract.tokenURI(tokenId);
    expect(uri).to.equal(ipfsHash);
  });
});
