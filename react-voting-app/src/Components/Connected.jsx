import React from "react";

const Connected = (props) => {
    //console.log(props.candidates)
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are connected to Metamask</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {props.remainingTime}</p>

            <div>
                <input type="candidateNo" placeholder="Enter Candidate No" value ={props.candidateNo} onClick={props.handleCandidateNoChange} ></input>
                <button className="login-button" onClick={props.voteFunction}>Vote</button>
            </div>

            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate name</th>
                    <th>Candidate votes</th>
                </tr>
                </thead>
                <tbody>
                {props.candidates && props.candidates.map((candidate, index) => (
                    <tr key={index}>
                    <td>{candidate.index}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            

        </div>
    )
}

export default Connected