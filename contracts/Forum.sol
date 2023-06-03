//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Forum {

    struct Question {
        uint questionId;
        string message;
        address creatorAddress;
        uint timeStamp;
    }

    struct Answer {
        uint answerId;
        uint questionId;
        address creatorAddress;
        string message;
        uint timeStamp;
        uint upVotes;
    }

    Question[] public questions;
    Answer[] public answers;

    mapping (uint => uint[]) public answersPerQuestion;
    mapping (uint => mapping(address => bool)) public upVoters;
    mapping (address => uint) public usersUpVoteCount;

    event QuestionAdded(Question question);
    event AnswerAdded(Answer answer);
    event AnswerUpvoted(Answer answer);

    IERC20 public immutable Token;
    uint constant decimals = 18;

    uint amountToPay = 1 * 10 ** decimals;
    uint amountToParticipate = 10 * 10 ** decimals;

    constructor(address _tokenAddress){
        Token = IERC20(_tokenAddress);
    }

    modifier answerExists(uint _answerId){
        require(answers.length >= _answerId, "Answer does not exist");
        _;
    }

    function postQuestion(string calldata _message) external {

        uint questionCounter = questions.length;

        Question memory question = Question({
            questionId: questionCounter,
            message: _message,
            creatorAddress: msg.sender,
            timeStamp: block.timestamp
        });

        questions.push(question);
        emit QuestionAdded(question);
    }

    function postAnswer(uint _questionId, string calldata _message) external {

        uint answerCounter = answers.length;

        Answer memory answer = Answer({
            answerId: answerCounter,
            questionId: _questionId,
            creatorAddress: msg.sender,
            message: _message,
            timeStamp: block.timestamp,
            upVotes: 0
        });

        answers.push(answer);
        answersPerQuestion[_questionId].push(answerCounter);
        emit AnswerAdded(answer);
    }

    function upvoteAnswer(uint _answerId) external answerExists(_answerId){
        
        Answer storage currentAnswer = answers[_answerId];

        require(upVoters[_answerId][msg.sender] != true, "User already upvoted this answer");
        require(answers[_answerId].creatorAddress != msg.sender, "Cannot upvote own answer");
        require(Token.balanceOf(msg.sender) >= amountToPay, "User has insufficient balance");
        require(Token.allowance(msg.sender, address(this)) >= amountToPay, "Account did not approve token successfully");

        bool sent;

        if(Token.balanceOf(currentAnswer.creatorAddress) >= amountToParticipate){
            sent = Token.transferFrom(msg.sender, currentAnswer.creatorAddress, amountToPay);
        }else{
            sent = Token.transferFrom(msg.sender, address(this), amountToPay);
        }

        require(sent, "Token transfer Failed");

        currentAnswer.upVotes++;
        usersUpVoteCount[msg.sender]++;
        upVoters[_answerId][msg.sender] = true;
        
        emit AnswerUpvoted(currentAnswer);
    }

    function getQuestions() external view returns (Question[] memory){
        return questions;
    }

    function getAnswersPerQuestion(uint _questionId) external view returns (uint[] memory){
        return answersPerQuestion[_questionId];
    }

    function getUpVotes(uint _answerId) public view answerExists(_answerId) returns (uint) {
        return answers[_answerId].upVotes;
    }
}