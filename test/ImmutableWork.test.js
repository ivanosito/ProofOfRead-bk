const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImmutableWork", function () {
  let contract;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();

    const ImmutableWork = await ethers.getContractFactory("ImmutableWork");
    contract = await ImmutableWork.deploy();
  });

  it("should start with zero works", async function () {
    expect(await contract.totalWorks()).to.equal(0);
  });

  it("should allow publishing a new work", async function () {
    const title = "Proof of the First Poem";
    const ipfsHash = "QmYpVnX5cExampleHash0000000000000000000000";

    const tx = await contract.connect(owner).publishWork(title, ipfsHash);
    await tx.wait();

    expect(await contract.totalWorks()).to.equal(1);

    const work = await contract.works(1);
    expect(work.title).to.equal(title);
    expect(work.ipfsHash).to.equal(ipfsHash);
    expect(work.author).to.equal(owner.address);
  });

  it("should emit an event on publishing", async function () {
    const title = "Immortal Lines";
    const ipfsHash = "QmAnotherExampleHash1234567890abcdef";

    await expect(contract.connect(owner).publishWork(title, ipfsHash))
      .to.emit(contract, "WorkPublished")
      .withArgs(1, owner.address, title, ipfsHash, await getBlockTimestamp());
  });

  it("should reject empty title or hash", async function () {
    await expect(contract.publishWork("", "QmHash")).to.be.revertedWith("Title is required");
    await expect(contract.publishWork("Untitled", "")).to.be.revertedWith("IPFS hash is required");
  });

  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
