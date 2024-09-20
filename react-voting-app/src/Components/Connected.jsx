import React from "react";



const Connected = (props) => {

    function handleLogout() {
        // Your existing logout logic here (e.g., clearing user session, etc.)
      
        // Refresh the browser
        window.location.reload();
    }

    //console.log(props.candidates)
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are connected to Metamask</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {props.remainingTime}</p>
    
            {props.isAuditor ? ( // if user is admin
                <div>
                    <table id="myTable" className="candidates-table">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Voter's Public Address</th>
                                <th>Candidate name</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.voteAuditTrail.map((event, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{event.voter}</td>
                                    <td>{event.candidateName}</td>
                                    <td>{event.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> 
            ) : props.showButton ? ( // if user is not admin && already voted
                <div>
                    <p className="connected-header">You have already voted</p>
                    <table id="myTable" className="candidates-table">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Candidate name</th>
                                <th>Candidate votes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{candidate.name}</td>
                                    <td>{candidate.voteCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            ) : ( // if user is not admin && haven't voted
                <div>
                    <input
                        type="number"
                        placeholder="Enter Candidate Index"
                        value={props.candidateNo}
                        onChange={props.handleCandidateNoChange}
                    />
                    <button className="login-button" onClick={props.voteFunction}>Vote</button>
    
                    <table id="myTable" className="candidates-table">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Candidate name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{candidate.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
    
            <button className="login-button" onClick={handleLogout}>Logout</button>
        </div>
    );
    
}

export default Connected