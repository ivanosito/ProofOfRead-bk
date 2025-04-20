const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImmutableWork", function () {
  let workContract;
  let tokenContract;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ProofOfReadToken");
    tokenContract = await Token.deploy(owner.address);

    const ImmutableWork = await ethers.getContractFactory("ImmutableWork");
    workContract = await ImmutableWork.deploy(tokenContract.target);
    await tokenContract.transferOwnership(workContract.target); // Important!
  });

  it("should start with zero works", async function () {
    expect(await workContract.totalWorks()).to.equal(0);
  });

  it("should allow publishing a new work", async function () {
    const title = "Proof of the First Poem";
    const ipfsHash = "QmYpVnX5cExampleHash0000000000000000000000";

    const tx = await workContract.connect(owner).publishWork(title, ipfsHash);
    await tx.wait();

    expect(await workContract.totalWorks()).to.equal(1);

    const work = await workContract.works(1);
    expect(work.title).to.equal(title);
    expect(work.ipfsHash).to.equal(ipfsHash);
    expect(work.author).to.equal(owner.address);
  });

//   it("should emit an event on publishing", async function () {
//     const title = "Immortal Lines";
//     const ipfsHash = "QmAnotherExampleHash1234567890abcdef";
  
//     const tx = await contract.connect(owner).publishWork(title, ipfsHash);
//     const receipt = await tx.wait();
  
//     const event = receipt.events.find(e => e.event === "WorkPublished");
//     expect(event.args[0]).to.equal(1); // workId
//     expect(event.args[1]).to.equal(owner.address); // author
//     expect(event.args[2]).to.equal(title); // title
//     expect(event.args[3]).to.equal(ipfsHash); // ipfsHash
//     expect(event.args[4]).to.be.a("bigint"); // timestamp
//   });

/*
receipt.events is undefined. That’s because in Ethers v6, the transaction receipt no longer includes the .events array like it used to in v5. We need to get logs another way!
*/

  it("should emit an event on publishing", async function () {
    const title = "Immortal Lines";
    const ipfsHash = "QmAnotherExampleHash1234567890abcdef";
  
    await expect(workContract.connect(owner).publishWork(title, ipfsHash))
      .to.emit(workContract, "WorkPublished");
  });

  it("should reject empty title or hash", async function () {
    await expect(workContract.publishWork("", "QmHash")).to.be.revertedWith("Title is required");
    await expect(workContract.publishWork("Untitled", "")).to.be.revertedWith("IPFS hash is required");
  });

  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
