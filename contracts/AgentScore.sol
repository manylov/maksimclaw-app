// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentScore
 * @notice On-chain reputation registry for AI agents (0–1000)
 */
contract AgentScore is Ownable {
    mapping(address => uint256) public scores;

    event ScoreUpdated(address indexed agent, uint256 oldScore, uint256 newScore);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Update an agent's reputation score
     * @param agent The agent's address
     * @param newScore The new score (0–1000)
     */
    function updateScore(address agent, uint256 newScore) external onlyOwner {
        require(newScore <= 1000, "Score must be <= 1000");
        uint256 oldScore = scores[agent];
        scores[agent] = newScore;
        emit ScoreUpdated(agent, oldScore, newScore);
    }

    /**
     * @notice Batch update scores for multiple agents
     */
    function batchUpdateScores(
        address[] calldata agents,
        uint256[] calldata newScores
    ) external onlyOwner {
        require(agents.length == newScores.length, "Length mismatch");
        for (uint256 i = 0; i < agents.length; i++) {
            require(newScores[i] <= 1000, "Score must be <= 1000");
            uint256 oldScore = scores[agents[i]];
            scores[agents[i]] = newScores[i];
            emit ScoreUpdated(agents[i], oldScore, newScores[i]);
        }
    }

    /**
     * @notice Get an agent's score
     */
    function getScore(address agent) external view returns (uint256) {
        return scores[agent];
    }
}
