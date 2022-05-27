import React, { useEffect, useState } from "react";
import "./Coin.css";
import { Button } from "web3uikit";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";


function Coin({ perc, setPerc, token, setModalToken, setVisible }) {


  const [color, setColor] = useState();
  const contract = useWeb3ExecuteFunction();
  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    if (perc < 50) {
      setColor("red");
    } else {
      setColor("green");
    }
  }, [perc]);

  async function addVote(updown) {
    let options = {
      contractAddress: "0x85eFFfb71e97F97f268F8C15efcEcF3E8A00D3A6",
      functionName: "addVote",
      abi: [{
        "inputs": [
          {
            "internalType": "string",
            "name": "tickerName",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "vote",
            "type": "bool"
          }
        ],
        "name": "addVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }],
      params: {
        tickerName: token,
        vote: updown
      },
    }

    await contract.fetch({
      params: options,
      onSuccess: () => { console.log("Voting Successfull"); },
      onError: (error) => { alert(error.data.message); }
    });
  }
  return (
    <>
      <div>
        <div className="token">
          {token}
        </div>
        <div className="circle" style={{ boxShadow: `0 0 20px ${color}` }}>
          <div className="wave"
            style={{
              marginTop: `${100 - perc}%`,
              boxShadow: `0 0 20px ${color}`,
              backgroundColor: "black",
            }}>

          </div>
          <div className="percentage">
            {perc}%
          </div>
        </div>
        <div className="votes">
          <Button
            onClick={() => {
              if (isAuthenticated) { addVote(true) }
              else { alert("Authenticate to vote!!") }
              
            }}
            text="•UP•"
            theme="primary"
            type="button"
          />
          <Button
            color="red"
            onClick={() => {
              if (isAuthenticated) { addVote(false) }
              else { alert("Authenticate to vote!!") }

            }}
            text="•DOWN•"
            theme="colored"
            type="button"
          />

        </div>
        <div className="votes">
          <Button
            onClick={() => {
              setModalToken(token)
              setVisible(true);
            }}
            text="•INFO•"
            theme="translucent"
            type="button"
          />

        </div>



      </div>
    </>
  );
}

export default Coin;
