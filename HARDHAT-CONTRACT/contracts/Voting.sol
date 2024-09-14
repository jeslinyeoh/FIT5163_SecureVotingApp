// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    // Define event for audit trail
    event Voted(address voter, string candidateName, uint256 timestamp);

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);

        // Emit event when voting starts
        //emit VotingStarted(votingStart, votingEnd);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );
        require(
            block.timestamp >= votingStart && block.timestamp < votingEnd,
            "Voting is not active."
        );

        candidates[_candidateIndex].voteCount++;

        // Emit event when a vote is casted
        if (!voters[msg.sender]) {
            emit Voted(
                msg.sender,
                candidates[_candidateIndex].name,
                block.timestamp
            );
        }

        voters[msg.sender] = true;
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}
