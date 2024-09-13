import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './Constant/constant.js';

import Connected from "./Components/Connected.jsx"
import Login from './Components/Login.jsx'
import Finished from './Components/Finished.jsx'

import './App.css';

function App() {
  
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateNo, setCandidateNo] = useState('');
  const [canVote, setCanVote] = useState(true);


  // this function runs whenever the app starts

  useEffect( () => {

    getCandidates();
    getRemainingTime();
    getCurrentStatus();

    if(window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

    }

    return() => {

      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }

  });


  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]); // get all the accounts

    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );

    // add logic to prevent -1 or index out of bound

    const tx = await contractInstance.vote(candidateNo);
    await tx.wait();
    getCanVote();
  }

  // check if the current signer can vote 
  async function getCanVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]); // get all the accounts

    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );

    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);

  }

  // get candidates from contract
  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]); // get all the accounts

    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );

    const candidateList = await contractInstance.getAllVotesOfCandiates();
    
    const formattedCandidates = candidateList.map((candidate, index)=> {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    //console.log(formattedCandidates);
    setCandidates(formattedCandidates);

  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );
    const status = await contractInstance.getVotingStatus();
    //console.log(status);
    setVotingStatus(status);
  }

  async function getRemainingTime(){
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts",[]); // get all the accounts
    
    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );

    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time,16));
  }


  // when the metamask account is changed
  function handleAccountsChanged(accounts) {

    if (accounts.length > 0 && accounts !== accounts[0]) {
      setAccount(accounts[0]);
      getCanVote();
    }

    // if the account is same or no accounts are connected
    else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {

    // add function to check username and account

    if(window.ethereum) {
  
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        await provider.send("eth_requestAccounts",[]); // get all the accounts
        const signer = provider.getSigner(); // current Metamask account
        const address = await signer.getAddress();

        setAccount(address);

        console.log("Metamask Connect: " + address);
        setIsConnected(true);
        getCanVote();

      } catch (err) {
        console.error(err);
      }
    }

    else {
      console.error("Metamask is not detected in the browser");
    }
  }
  
  async function handleCandidateNoChange(e) {
    setCandidateNo(e.target.value);
  }

  // voting status is true means that user can vote
  return (
    <div className="App">

      {votingStatus? (isConnected? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {remainingTime}
                      candidateNo={candidateNo}
                      handleCandidateNoChange = {handleCandidateNoChange}
                      voteFunction = {vote}
                      showButton = {canVote} />)

                      :

                      (<Login connectWallet = {connectToMetamask}/>)) : (<Finished />)}
      
    </div>
  );
}




export default App;
