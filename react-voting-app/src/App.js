import { useState, useEffect, useRef } from 'react';
import {ethers} from 'ethers';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import {contractAbi, contractAddress} from './Constant/constant.js';


import Connected from "./Components/Connected.jsx"
import Login from './Components/Login.jsx'
import Finished from './Components/Finished.jsx'
import RegistrationForm from './Components/RegistrationForm.jsx';

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
  const [isAuditor, setIsAuditor] = useState(false);


  const [voteAuditTrail, setVoteAuditTrail] = useState([]);

  const [publicKey, setPublicKey] = useState('');
  const callConnect = useRef(true);

  useEffect(() => {
    console.log("checking");
    // ensure that the public key is updated before displaying voting page
    if (publicKey !== '' && callConnect.current === true) { 
      // Trigger MetaMask connection once publicKey state is updated
      callConnect.current = false; 
      console.log("public key state changed " + publicKey);
      connectToMetamask();
    }
  }, [publicKey]);

  // this function runs whenever the app starts
  useEffect( () => {

    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    getAuditTrail();

    if(window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);

    }


    return() => {

      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }

  });


  async function getAuditTrail() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]); // get all the accounts

    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    )

    // get all "Voted" events
    const filter = contractInstance.filters.Voted();
    const events = await contractInstance.queryFilter(filter);

    // events.forEach(event => {
    //   //console.log(`Voter: ${event.args.voter}, Candidate: ${event.args.candidateName}, Timestamp: ${event.args.timestamp}`);
    // });

    const formattedEvents = events.map((event, index)=> {
      return {
        index: index,
        voter: event.args.voter,
        candidateName: event.args.candidateName,
        timestamp: parseInt(event.args.timestamp,16)
      }
    });
    
    setVoteAuditTrail(formattedEvents);
    //setIsAuditor(true);
    //setIsAuditor(true);
    //console.log(formattedEvents);  
  }


  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts",[]); // get all the accounts

    const signer = provider.getSigner(); // current Metamask account

    const contractInstance = new ethers.Contract (
      contractAddress, contractAbi, signer
    );

    // add logic to prevent -1 or index out of bound
    const totalCandidates = await contractInstance.getCandidatesCount();
    
    if (candidateNo < 0 || candidateNo >= totalCandidates) {
      alert("Invalid candidate number. Please select a valid candidate.");
      return; // Exit the function if the candidateNo is invalid
    }

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
    setRemainingTime(formatTime(parseInt(time,16)));

  }


  // format time from seconds to HH:MM:SS
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(secs).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
   
  // when the metamask account is changed
  function handleAccountsChanged(accounts) {

    alert("Current Metamask account has changed, please log in again using the correct Metamask account.");
    window.location.reload();
  }


  async function connectToMetamask() {

    if(window.ethereum) {
  
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        await provider.send("eth_requestAccounts",[]); // get all the accounts
        const signer = provider.getSigner(); // current Metamask account
        const address = await signer.getAddress();

        if (publicKey !== address) {
          console.log("Logged in to this address: " + address);
          console.log("public key retrieved is: " + publicKey);
          alert("Current Metamask account is not registered, please log in using the correct Metamask account.");
          window.location.reload();
        }

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

  // if voting status is true, users can vote
  return (
    <div className="App">

      {votingStatus? (isConnected? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {remainingTime}
                      candidateNo = {candidateNo}
                      voteAuditTrail = {voteAuditTrail}
                      handleCandidateNoChange = {handleCandidateNoChange}
                      voteFunction = {vote}
                      showButton = {canVote} 
                      isAuditor = {isAuditor} />)

                      : (

                        <Router>
                          <div>
                            <Routes>
                              <Route path="/" element={<Login connectToMetamask = {connectToMetamask} setIsAuditor={setIsAuditor} setPublicKey={setPublicKey} />} />
                              <Route path="/registrationForm" element={<RegistrationForm />} />   {/* Registration form page */}
                              <Route path="/login" element={<Login connectToMetamask = {connectToMetamask} setIsAuditor={setIsAuditor} setPublicKey={setPublicKey}/>} />
                            </Routes>
                          </div>
                        </Router>

                    )) 

                      : (<Finished />)}
      
    </div>
  );
}




export default App;