import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0xA141389657B35f8e76f6d8e063349067A45D407e";

export async function doLogin() {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length) throw new Error("No accounts found. Please connect your MetaMask wallet.");

    const account = accounts[0].toLowerCase();
    localStorage.setItem("wallet", account);

    return account;
}

function getContract(showErrors = false) {
    if (!window.ethereum) throw new Error("MetaMask is not installed");

    const wallet = localStorage.getItem("wallet");
    if (!wallet) 
    {
        if (showErrors) throw new Error("Wallet not authenticated. Please log in with MetaMask.");  
        console.error("Wallet not authenticated. Please log in with MetaMask.");
        return null; // Return null if wallet is not authenticated
    }        

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from: wallet });

    if (!contract) 
    {
        if (showErrors) throw new Error("Contract not found. Please check the contract address and ABI.");
        console.error("Contract not found. Please check the contract address and ABI.");
        return null; // Return null if contract is not found
    }

    return contract;
}

export async function getOpenRequests(lastId = 0) {
    const contract = getContract();

    if (!contract) return;

    const requests = await contract.methods.getOpenRequests(lastId + 1, 5).call();
    return requests.filter(req => req.title !== "");
}

export async function openRequest({ title, description, contact, goal }) {
    const contract = getContract(true);

    if (!contract) throw new Error("Wallet not authenticated");

    const result = await contract.methods.openRequest(title, description, contact, Web3.utils.toWei(goal, "ether")).send();
    if (!result || !result.transactionHash) throw new Error("Failed to create request");
}

export async function closeRequest(id) {
    const contract = getContract(true);

    if (!contract) throw new Error("Wallet not authenticated");

    const result = await contract.methods.closeRequest(id).send();
    if (!result || !result.transactionHash) throw new Error("Failed to close request");
}

export async function donate(id, donationInBNB) {
    const contract = getContract(true);

    const result = await contract.methods.donate(id).send(
        {
            value: Web3.utils.toWei(donationInBNB, "ether")
        });
    if (!result || !result.transactionHash) throw new Error("Failed to donate");
}