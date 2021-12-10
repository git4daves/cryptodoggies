import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../css/ribbon.css";
import "../css/card.css";
import { generateDoggyImage } from "../js/doggies";

import { ethers, utils } from "ethers";
import CryptoDoggies from "../contracts/CryptoDoggies.json";

const contractAddress = "0xAc6EBdd3058d9d441aF9ACDE51CFec81c1D4C6Ab";

const DoggyCard = ({ doggy, userAddress }) => {
  const canvasRef = useRef();
  const [doggyInfo, setDoggyInfo] = useState(doggy);

  const locallyOwned = userAddress === doggyInfo.ownerAddress;
  const ownerHref = `https://ropsten.etherscan.io/address/${doggyInfo.ownerAddress}`;

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function onPurchase() {
    // setDoggyInfo({
    //   doggyId: 7,
    //   doggyName: "Hugo",
    //   doggyDna: "0x00e52bab7d",
    //   doggyPrice: "0.500",
    //   doggyNextPrice: "3.211",
    //   ownerAddress: "0x000000",
    // });
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        CryptoDoggies.abi,
        signer
      );
      const doggyPrice = await contract.priceOf(doggyInfo.doggyId);
      const overrides = { value: doggyPrice };
      const transaction = await contract.purchase(doggyInfo.doggyId, overrides);
      await transaction.wait();
      const doggyToken = await contract.getToken(doggyInfo.doggyId);
      console.log(utils.formatEther(doggyToken._nextPrice.toString()));
      const newDoggyInfo = {
        ...doggyInfo,
        doggyPrice: parseFloat(
          utils.formatEther(doggyToken._price.toString()),
          4
        ).toFixed(4),
        doggyNextPrice: parseFloat(
          utils.formatEther(doggyToken._nextPrice.toString()),
          4
        ).toFixed(4),
        ownerAddress: doggyToken._owner,
      };
      setDoggyInfo(newDoggyInfo);
    }
  }

  useEffect(() => {
    generateDoggyImage(doggyInfo.doggyDna, 3, canvasRef.current);
  }, [doggyInfo.doggyDna]);

  return (
    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
      <div id="card-template">
        <div
          className="ribbon doggy-card card shadow-1"
          style={{ paddingBottom: "10px" }}
        >
          <div>
            <h4
              className="card-title doggy-name"
              style={{ display: "inline-block" }}
            >
              {doggyInfo.doggyName}
            </h4>
            <a href className="text-muted">
              <canvas
                className="card-img-top doggy-canvas"
                id="doggy-canvas-id"
                style={{ width: "100%" }}
                ref={canvasRef}
              />
            </a>
            <div className="card-block">
              <div className="doggy-text">
                <small>DNA: </small>
                <a href className="doggy-dna">
                  {doggyInfo.doggyDna}
                </a>
              </div>
              <div className="doggy-text">
                <small>Next Price: </small>
                <a href className="doggy-next-price">
                  {doggyInfo.doggyNextPrice}
                </a>
              </div>
              <hr />
              <Form className="doggy-purchase">
                <div className="form-group input-group">
                  <input
                    className="form-control doggy-price"
                    type="text"
                    disabled
                    value={doggyInfo.doggyPrice}
                  />
                  <Button
                    className="btn btn-primary btn-buy"
                    id="doggyBuyButton"
                    disabled={locallyOwned}
                    onClick={onPurchase}
                  >
                    Buy
                  </Button>
                </div>
              </Form>
            </div>
            <div className="card-footer">
              <small>Owner: </small>
              <a href={ownerHref} className="text-muted doggy-owner" target="_">
                {doggyInfo.ownerAddress}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoggyCard;
