import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("AgentBank", function () {
  async function deployFixture() {
    const [owner, agent1, agent2] = await ethers.getSigners();

    // Deploy mock USDT (6 decimals)
    const MockERC20 = await ethers.getContractFactory("MockUSDT");
    const usdt = await MockERC20.deploy();
    await usdt.waitForDeployment();

    // Deploy AgentScore
    const AgentScore = await ethers.getContractFactory("AgentScore");
    const agentScore = await AgentScore.deploy();
    await agentScore.waitForDeployment();

    // Deploy Lending
    const Lending = await ethers.getContractFactory("AgentBankLending");
    const lending = await Lending.deploy(
      await usdt.getAddress(),
      await agentScore.getAddress()
    );
    await lending.waitForDeployment();

    // Fund pool: mint USDT to owner, approve and fund
    const poolAmount = ethers.parseUnits("1000", 6); // $1000
    await usdt.mint(owner.address, poolAmount);
    await usdt.approve(await lending.getAddress(), poolAmount);
    await lending.fundPool(poolAmount);

    return { owner, agent1, agent2, usdt, agentScore, lending };
  }

  describe("AgentScore", function () {
    it("should start with score 0", async function () {
      const { agentScore, agent1 } = await loadFixture(deployFixture);
      expect(await agentScore.getScore(agent1.address)).to.equal(0);
    });

    it("should update score", async function () {
      const { agentScore, agent1 } = await loadFixture(deployFixture);
      await expect(agentScore.updateScore(agent1.address, 450))
        .to.emit(agentScore, "ScoreUpdated")
        .withArgs(agent1.address, 0, 450);
      expect(await agentScore.getScore(agent1.address)).to.equal(450);
    });

    it("should reject score > 1000", async function () {
      const { agentScore, agent1 } = await loadFixture(deployFixture);
      await expect(agentScore.updateScore(agent1.address, 1001)).to.be.revertedWith("Score must be <= 1000");
    });

    it("should reject non-owner updates", async function () {
      const { agentScore, agent1 } = await loadFixture(deployFixture);
      await expect(agentScore.connect(agent1).updateScore(agent1.address, 500))
        .to.be.revertedWithCustomError(agentScore, "OwnableUnauthorizedAccount");
    });

    it("should batch update scores", async function () {
      const { agentScore, agent1, agent2 } = await loadFixture(deployFixture);
      await agentScore.batchUpdateScores([agent1.address, agent2.address], [300, 500]);
      expect(await agentScore.getScore(agent1.address)).to.equal(300);
      expect(await agentScore.getScore(agent2.address)).to.equal(500);
    });
  });

  describe("AgentBankLending", function () {
    it("should have funded pool", async function () {
      const { lending } = await loadFixture(deployFixture);
      expect(await lending.poolBalance()).to.equal(ethers.parseUnits("1000", 6));
    });

    it("should reject loan for low score", async function () {
      const { lending, agent1 } = await loadFixture(deployFixture);
      await expect(lending.connect(agent1).requestLoan(500_000)).to.be.revertedWith("Score too low");
    });

    it("should issue loan for score 300+", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 350);
      
      const amount = 500_000; // $0.50
      await expect(lending.connect(agent1).requestLoan(amount))
        .to.emit(lending, "LoanRequested");

      const loan = await lending.loans(0);
      expect(loan.borrower).to.equal(agent1.address);
      expect(loan.amount).to.equal(amount);
      expect(loan.fee).to.equal(75_000); // 15% of 500_000
      expect(loan.repaid).to.equal(false);
    });

    it("should reject loan exceeding tier limit", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 350); // Tier 1: max $0.50
      await expect(lending.connect(agent1).requestLoan(1_000_000)).to.be.revertedWith("Amount exceeds tier limit");
    });

    it("should allow tier 2 loan for score 400+", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 450);
      
      await expect(lending.connect(agent1).requestLoan(2_000_000))
        .to.emit(lending, "LoanRequested");
    });

    it("should allow tier 3 loan for score 500+", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 550);
      
      await expect(lending.connect(agent1).requestLoan(5_000_000))
        .to.emit(lending, "LoanRequested");
    });

    it("should repay loan", async function () {
      const { lending, agentScore, agent1, usdt } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 350);
      await lending.connect(agent1).requestLoan(500_000);

      // Give agent USDT to repay
      const totalDue = 500_000 + 75_000; // principal + 15% fee
      await usdt.mint(agent1.address, totalDue);
      await usdt.connect(agent1).approve(await lending.getAddress(), totalDue);

      await expect(lending.connect(agent1).repayLoan(0))
        .to.emit(lending, "LoanRepaid")
        .withArgs(0, agent1.address, totalDue);

      const loan = await lending.loans(0);
      expect(loan.repaid).to.equal(true);
    });

    it("should liquidate overdue loan", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 350);
      await lending.connect(agent1).requestLoan(500_000);

      // Can't liquidate before due
      await expect(lending.liquidate(0)).to.be.revertedWith("Not yet overdue");

      // Advance time past 14 days
      await time.increase(14 * 24 * 60 * 60 + 1);

      await expect(lending.liquidate(0))
        .to.emit(lending, "LoanDefaulted")
        .withArgs(0, agent1.address);

      const loan = await lending.loans(0);
      expect(loan.defaulted).to.equal(true);
    });

    it("should track borrower loans", async function () {
      const { lending, agentScore, agent1 } = await loadFixture(deployFixture);
      await agentScore.updateScore(agent1.address, 500);
      await lending.connect(agent1).requestLoan(500_000);
      await lending.connect(agent1).requestLoan(1_000_000);

      const loanIds = await lending.getBorrowerLoans(agent1.address);
      expect(loanIds.length).to.equal(2);
    });

    it("should allow owner to withdraw from pool", async function () {
      const { lending, owner } = await loadFixture(deployFixture);
      await expect(lending.withdrawPool(ethers.parseUnits("100", 6)))
        .to.emit(lending, "PoolWithdrawn");
    });
  });
});
