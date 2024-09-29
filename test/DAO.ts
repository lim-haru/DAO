import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "ethers";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DAO", function () {
  async function deploy() {
    const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
    const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

    const TokenERC20 = await hre.ethers.getContractFactory("TokenERC20");
    const token = await TokenERC20.deploy("Token", "tok", parseEther("10000.0"));

    const pricePerShare = 10;
    const DAO = await hre.ethers.getContractFactory("DAO");
    const dao = await DAO.deploy(token.getAddress(), pricePerShare);

    return { token, dao, owner, addr1, addr2, addr3, ONE_DAY_IN_SECONDS };
  }

  it("Should allow users to buy shares and become new members", async function () {
    const { token, dao, addr1 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));

    await dao.connect(addr1).buyShares(parseEther("100.0"));

    expect(await dao.shares(addr1.address)).to.equal(parseEther("100.0"));
  });

  it("Should allow members to propose decision", async function () {
    const { token, dao, addr1 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));

    await dao.connect(addr1).proposeDecision("Proposal 1", "Proposal test 1", hre.ethers.ZeroAddress, 0, 3);

    const proposal = await dao.proposals(0);
    expect(proposal.title).to.equal("Proposal 1");
  });

  it("Should allow you to vote using weighted votes", async function () {
    const { token, dao, addr1, addr2 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.transfer(addr2.address, parseEther("750.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await token.connect(addr2).approve(dao.getAddress(), parseEther("750"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr2).buyShares(parseEther("75.0"));
    await dao.connect(addr1).proposeDecision("Proposal 1", "Proposal test 1", hre.ethers.ZeroAddress, 0, 3);

    await dao.connect(addr1).vote(0, 1);
    await dao.connect(addr2).vote(0, 2);

    const proposal = await dao.proposals(0);
    expect(proposal.votesFor).to.equal(await dao.shares(addr1.address));
    expect(proposal.votesAgainst).to.equal(await dao.shares(addr2.address));
  });

  it("Should approve the proposal if it receives a majority of votes", async function () {
    const { token, dao, addr1, ONE_DAY_IN_SECONDS } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr1).proposeDecision("Proposal 1", "Proposal test 1", hre.ethers.ZeroAddress, 0, 3);
    await dao.connect(addr1).vote(0, 1);

    await time.increase(ONE_DAY_IN_SECONDS * 3);
    await dao.connect(addr1).executeProposal(0);

    const proposal = await dao.proposals(0);
    expect(proposal.executed).to.equal(true);
  });

  it("Should prevent those who do not own shares from voting", async function () {
    const { dao, addr1 } = await loadFixture(deploy);

    await expect(dao.connect(addr1).vote(0, 1)).to.be.revertedWith("Not a DAO member");
  });

  it("Should allow the delegation of votes", async function () {
    const { token, dao, addr1, addr2 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.transfer(addr2.address, parseEther("750.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await token.connect(addr2).approve(dao.getAddress(), parseEther("750"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr2).buyShares(parseEther("75.0"));

    await dao.connect(addr1).delegateVote(addr2.address);

    expect(await dao.delegatedVotes(addr2)).to.equal(parseEther("100.0"));
  });

  it("Should allow the delegation of votes to be revoked", async function () {
    const { token, dao, addr1, addr2 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.transfer(addr2.address, parseEther("750.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await token.connect(addr2).approve(dao.getAddress(), parseEther("750"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr2).buyShares(parseEther("75.0"));
    await dao.connect(addr1).delegateVote(addr2.address);

    await dao.connect(addr1).revokeDelegation();

    expect(await dao.delegatedVotes(addr2)).to.equal(0);
  });

  it("When the delegator votes, they should also mark their delegates as having voted.", async function () {
    const { token, dao, addr1, addr2, addr3 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.transfer(addr2.address, parseEther("750.0"));
    await token.transfer(addr3.address, parseEther("750.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await token.connect(addr2).approve(dao.getAddress(), parseEther("750"));
    await token.connect(addr3).approve(dao.getAddress(), parseEther("750"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr2).buyShares(parseEther("75.0"));
    await dao.connect(addr3).buyShares(parseEther("75.0"));
    await dao.connect(addr1).delegateVote(addr3.address);
    await dao.connect(addr2).delegateVote(addr3.address);
    await dao.connect(addr1).proposeDecision("Proposal 1", "Proposal test 1", hre.ethers.ZeroAddress, 0, 3);

    await dao.connect(addr3).vote(0, 1);
    expect(await dao.hasVoted(0, addr1)).to.equal(true);
    expect(await dao.hasVoted(0, addr2)).to.equal(true);
  });

  it("Should remove all delegates from the delegator registry during delegation revocation.", async function () {
    const { token, dao, addr1, addr2, addr3 } = await loadFixture(deploy);

    await token.transfer(addr1.address, parseEther("1000.0"));
    await token.transfer(addr2.address, parseEther("750.0"));
    await token.transfer(addr3.address, parseEther("750.0"));
    await token.connect(addr1).approve(dao.getAddress(), parseEther("1000"));
    await token.connect(addr2).approve(dao.getAddress(), parseEther("750"));
    await token.connect(addr3).approve(dao.getAddress(), parseEther("750"));
    await dao.connect(addr1).buyShares(parseEther("100.0"));
    await dao.connect(addr2).buyShares(parseEther("75.0"));
    await dao.connect(addr3).buyShares(parseEther("75.0"));
    await dao.connect(addr1).delegateVote(addr3.address);
    await dao.connect(addr2).delegateVote(addr3.address);
    await dao.connect(addr1).proposeDecision("Proposal 1", "Proposal test 1", hre.ethers.ZeroAddress, 0, 3);

    await dao.connect(addr1).revokeDelegation();
    await dao.connect(addr2).revokeDelegation();

    const delegator = await dao.getDelegator(addr3);
    expect(delegator[0]).to.equal(hre.ethers.ZeroAddress);
    expect(delegator[1]).to.equal(hre.ethers.ZeroAddress);
  });
});
