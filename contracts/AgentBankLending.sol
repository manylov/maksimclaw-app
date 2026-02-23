// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AgentScore.sol";

/**
 * @title AgentBankLending
 * @notice Tier 1 microloan contract — undercollateralized USDT lending for AI agents
 * @dev Loans are scored by AgentScore. USDT has 6 decimals on Arbitrum.
 */
contract AgentBankLending is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdt;
    AgentScore public immutable agentScore;

    uint256 public constant FEE_BPS = 1500; // 15% flat fee
    uint256 public constant LOAN_DURATION = 14 days;
    uint256 public constant USDT_DECIMALS = 6;

    // Tier thresholds (score => max loan in USDT micro-units, 6 decimals)
    uint256 public constant TIER1_SCORE = 300;
    uint256 public constant TIER1_MAX = 500_000;    // $0.50
    uint256 public constant TIER2_SCORE = 400;
    uint256 public constant TIER2_MAX = 2_000_000;  // $2.00
    uint256 public constant TIER3_SCORE = 500;
    uint256 public constant TIER3_MAX = 5_000_000;  // $5.00

    struct Loan {
        address borrower;
        uint256 amount;
        uint256 fee;
        uint256 dueDate;
        bool repaid;
        bool defaulted;
        bool feeClaimed;
    }

    Loan[] public loans;
    mapping(address => uint256[]) public borrowerLoans;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 fee, uint256 dueDate);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 totalPaid);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event FeeTokensClaimed(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event PoolFunded(address indexed funder, uint256 amount);
    event PoolWithdrawn(address indexed owner, uint256 amount);

    constructor(address _usdt, address _agentScore) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
        agentScore = AgentScore(_agentScore);
    }

    /**
     * @notice Owner deposits USDT into the lending pool
     */
    function fundPool(uint256 amount) external onlyOwner {
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        emit PoolFunded(msg.sender, amount);
    }

    /**
     * @notice Owner withdraws USDT from the pool
     */
    function withdrawPool(uint256 amount) external onlyOwner {
        usdt.safeTransfer(msg.sender, amount);
        emit PoolWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Get the maximum loan amount for a given score
     */
    function getMaxLoan(uint256 score) public pure returns (uint256) {
        if (score >= TIER3_SCORE) return TIER3_MAX;
        if (score >= TIER2_SCORE) return TIER2_MAX;
        if (score >= TIER1_SCORE) return TIER1_MAX;
        return 0;
    }

    /**
     * @notice Request a loan. Amount must be within tier limit.
     */
    function requestLoan(uint256 amount) external returns (uint256 loanId) {
        uint256 score = agentScore.getScore(msg.sender);
        uint256 maxLoan = getMaxLoan(score);
        require(maxLoan > 0, "Score too low");
        require(amount > 0 && amount <= maxLoan, "Amount exceeds tier limit");
        require(usdt.balanceOf(address(this)) >= amount, "Insufficient pool");

        uint256 fee = (amount * FEE_BPS) / 10_000;
        uint256 dueDate = block.timestamp + LOAN_DURATION;

        loanId = loans.length;
        loans.push(Loan({
            borrower: msg.sender,
            amount: amount,
            fee: fee,
            dueDate: dueDate,
            repaid: false,
            defaulted: false,
            feeClaimed: false
        }));
        borrowerLoans[msg.sender].push(loanId);

        usdt.safeTransfer(msg.sender, amount);
        emit LoanRequested(loanId, msg.sender, amount, fee, dueDate);
    }

    /**
     * @notice Repay a loan (principal + fee)
     */
    function repayLoan(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(!loan.repaid, "Already repaid");
        require(!loan.defaulted, "Loan defaulted");

        uint256 totalDue = loan.amount + loan.fee;
        usdt.safeTransferFrom(msg.sender, address(this), totalDue);

        loan.repaid = true;
        emit LoanRepaid(loanId, msg.sender, totalDue);
    }

    /**
     * @notice Claim fee tokens (testnet faucet) — borrower gets USDT equal to loan fee
     */
    function claimFeeTokens(uint256 loanId) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not your loan");
        require(!loan.repaid, "Already repaid");
        require(!loan.defaulted, "Loan defaulted");
        require(!loan.feeClaimed, "Fee already claimed");
        require(usdt.balanceOf(address(this)) >= loan.fee, "Insufficient pool");

        loan.feeClaimed = true;
        usdt.safeTransfer(msg.sender, loan.fee);
        emit FeeTokensClaimed(loanId, msg.sender, loan.fee);
    }

    /**
     * @notice Owner marks an overdue loan as defaulted
     */
    function liquidate(uint256 loanId) external onlyOwner {
        Loan storage loan = loans[loanId];
        require(!loan.repaid, "Already repaid");
        require(!loan.defaulted, "Already defaulted");
        require(block.timestamp > loan.dueDate, "Not yet overdue");

        loan.defaulted = true;
        emit LoanDefaulted(loanId, loan.borrower);
    }

    /**
     * @notice Get total number of loans
     */
    function totalLoans() external view returns (uint256) {
        return loans.length;
    }

    /**
     * @notice Get all loan IDs for a borrower
     */
    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return borrowerLoans[borrower];
    }

    /**
     * @notice Get pool balance
     */
    function poolBalance() external view returns (uint256) {
        return usdt.balanceOf(address(this));
    }
}
