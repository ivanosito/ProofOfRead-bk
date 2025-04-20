
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProofOfReadToken", function () {
  let tokenContract;
  let deployer;
  let recipient;

  beforeEach(async function () {
    [deployer, recipient] = await ethers.getSigners();

    const ProofOfReadToken = await ethers.getContractFactory("ProofOfReadToken");
    tokenContract = await ProofOfReadToken.deploy(deployer.address);
  });

  it("should mint a token to recipient", async function () {
    const tokenURI = "ipfs://QmTestHashPoem001";

    const tx = await tokenContract.connect(deployer).mintWork(recipient.address, tokenURI);
    await tx.wait();

    const tokenId = await tokenContract.totalMinted();
    expect(tokenId).to.equal(1);

    expect(await tokenContract.ownerOf(tokenId)).to.equal(recipient.address);
    expect(await tokenContract.tokenURI(tokenId)).to.equal(tokenURI);
  });

  it("should only allow owner to mint", async function () {
    await expect(
      tokenContract.connect(recipient).mintWork(recipient.address, "ipfs://QmFakeHash")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should report correct total minted", async function () {
    await tokenContract.mintWork(recipient.address, "ipfs://Qm1");
    await tokenContract.mintWork(recipient.address, "ipfs://Qm2");
    await tokenContract.mintWork(recipient.address, "ipfs://Qm3");

    const total = await tokenContract.totalMinted();
    expect(total).to.equal(3);
  });
});
