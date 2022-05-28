import React, { useEffect, useState } from "react";
import "./App.css";
import { ConnectButton, Modal } from "web3uikit";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin"
import { abouts } from "./about";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";


const App = () => {


  const [btc, setBtc] = useState(50);
  const [eth, setEth] = useState(50);
  const [ada, setAda] = useState(50);
  const [matic, setMatic] = useState(50);
  const [modalPrice, setModalPrice] = useState();
  const Web3Api = useMoralisWeb3Api();
  const { Moralis, isInitialized } = useMoralis();
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState();

  async function getRatio(tick, setPerc) {

    const Votes = Moralis.Object.extend('Votes');
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const results = await query.first();
    let up = Number(results.attributes.up);
    let down = Number(results.attributes.down);
    let ratio = Math.round(up / (up + down) * 100);
    setPerc(ratio);
  }

  useEffect(() => {
    if (isInitialized) {
      getRatio("BTC", setBtc);
      getRatio("ETH", setEth);
      getRatio("ADA", setAda);
      getRatio("MATIC", setMatic);

      async function createLiveQuery() {
        let query = new Moralis.Query('Votes');
        let subs = await query.subscribe();
        subs.on('update', (object) => {
          if (object.attributes.ticker == "BTC") getRatio("BTC", setBtc);
          else if (object.attributes.ticker == "ETH") getRatio("ETH", setEth);
          else if (object.attributes.ticker == "ADA") getRatio("ADA", setAda);
          else if (object.attributes.ticker == "MATIC") getRatio("MATIC", setMatic);
        });
      }
      createLiveQuery();
    }
  }, [isInitialized]);

  useEffect(() => {
    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await Web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(4));
    }

    if (modalToken) { fetchTokenPrice() }
  }, [modalToken]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50px" />
          Market Sentiment
        </div>
        <ConnectButton />
      </div>

      <div className="instructions">
        Analyse.Predict.Vote <br></br>
        Pick a Trend for your favourite coin
      </div>
      <div className="list">
        <Coin
          perc={btc}
          setPerc={setBtc}
          token={"BTC"}
          setModalToken={setModalToken}
          setVisible={setVisible} />
        <Coin
          perc={eth}
          setPerc={setEth}
          token={"ETH"}
          setModalToken={setModalToken}
          setVisible={setVisible} />
        <Coin
          perc={ada}
          setPerc={setAda}
          token={"ADA"}
          setModalToken={setModalToken}
          setVisible={setVisible} />
        <Coin
          perc={matic}
          setPerc={setMatic}
          token={"MATIC"}
          setModalToken={setModalToken}
          setVisible={setVisible} />
      </div>

      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={modalToken}>
        <div>
          <span style={{ color: "silver" }}>{`Price: `}</span>
          {modalPrice}$
        </div>

        <div>
          <span style={{ color: "gold" }}>{`About`}</span>
        </div>
        <div>
          {modalToken &&
            abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>

      </Modal>

    </>


  );
};

export default App;
