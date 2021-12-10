import React, { useEffect, useState, useCallback } from "react";
import "../css/main.css";
import DoggyCard from "./DoggyCard";

import { ethers, utils } from "ethers";
import CryptoDoggies from "../contracts/CryptoDoggies.json";

const contractAddress = "0xAc6EBdd3058d9d441aF9ACDE51CFec81c1D4C6Ab";

const Marketplace = () => {
  const [doggies, setDoggies] = useState([]);
  const [userAddress, setUserAddress] = useState([]);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const getUserAddress = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const _userAddress = await signer.getAddress();
      setUserAddress(_userAddress);
    }
  }, []);

  const getDoggies = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        CryptoDoggies.abi,
        provider
      );
      const doggiesPromises = [];
      await contract.totalSupply().then((result) => {
        for (let i = 0; i < result.toNumber(); i++) {
          doggiesPromises.push(contract.getToken(i));
        }
      });
      const _doggies = await Promise.all(doggiesPromises);
      setDoggies(_doggies);
    } else {
      const provider = ethers.getDefaultProvider("ropsten");
      const contract = new ethers.Contract(
        contractAddress,
        CryptoDoggies.abi,
        provider
      );
      const doggiesPromises = [];
      await contract.totalSupply().then((result) => {
        for (let i = 0; i < result.toNumber(); i++) {
          doggiesPromises.push(contract.getToken(i));
        }
      });
      const _doggies = await Promise.all(doggiesPromises);
      setDoggies(_doggies);
    }
  }, []);

  useEffect(() => {
    getDoggies();
    getUserAddress();
  }, [getDoggies, getUserAddress]);

  return (
    <div className="card-container">
      <div className="row mt centered">
        <div className="col-sm-12">
          <h1>Marketplace</h1>
        </div>
      </div>
      <div id="card-row" className="row card-columns card-deck">
        {doggies.map((currElement, index) => {
          const doggy = {
            doggyId: index,
            doggyName: currElement._tokenName,
            doggyDna: currElement._dna,
            doggyPrice: parseFloat(
              utils.formatEther(currElement._price.toString())
            ).toFixed(4),
            doggyNextPrice: parseFloat(
              utils.formatEther(currElement._nextPrice.toString())
            ).toFixed(4),
            ownerAddress: currElement._owner,
          };
          return (
            <DoggyCard
              key={doggy.doggyId}
              doggy={{ ...doggy }}
              userAddress={userAddress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
