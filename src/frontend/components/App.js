import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import Navigation from './Navbar';
import Home from './Home';
import Create from './Create';
import MyListedItem from './MyListedItem';
import MyPurchases from './MyPurchases';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Spinner } from "react-bootstrap";
import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'

function App() {
const [loading, setLoading] = useState(true)
const [account, setAccount] = useState(null)
const [nft, setNFT] = useState({})
const [marketplace, setMarketplace] = useState({});

  const web3Handler = async() => {
    console.log(window.ethereum,"1");
    if(window.ethereum){
     await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
       console.log(window.ethereum,"2");
    console.log(window.ethereum,"2");
    setAccount(accounts[0])
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log(window.ethereum,"3");
        const signer = provider.getSigner()
     
        loadContracts(signer)
    }
  }

  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
  }
  return (
    <BrowserRouter>
    <div className="App">
      <Navigation web3Handler={web3Handler} account={account}/>
      <div>
      {loading ? (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh'}}>
        <Spinner annimation="border" style={{ display:'flex'}} />
        <p className="mx-3 my-0">Awaiting Metamask connection...</p>
        </div>
      ):(
      <Routes>
        <Route path="/" element={<Home  marketplace={marketplace} nft={nft}/>} />
        <Route path="/create" element={ <Create marketplace={marketplace} nft={nft} /> } />
        <Route path="/my-listed-items" element={ <MyListedItem marketplace={marketplace} nft={nft} account={account} />} />
        <Route path="/my-purchases" element={ <MyPurchases marketplace={marketplace} nft={nft} account={account} /> } />
      </Routes>
      )}
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
