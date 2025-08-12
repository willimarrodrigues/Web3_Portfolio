// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct Request {
    uint id;
    string title;
    string description;
    string contact;
    address author;
    uint timestamp;
    uint goal;
    uint balance;
    bool open;
}

contract FloodHelp
{
    uint public lastId = 0;
    
    mapping ( uint => Request ) public requests;

    function openRequest(string memory title, string memory description, string memory contact, uint goal) public {
        require(goal > 0, "Goal must be greater than 0");
        require(bytes(title).length > 0, "Title must not be empty");
        require(bytes(description).length > 0, "Description must not be empty");
        require(bytes(contact).length > 0, "Contact must not be empty");

        lastId++;
        requests[lastId] = Request({
            id: lastId, 
            title: title, 
            description: description, 
            contact: contact, 
            author: msg.sender, 
            timestamp: block.timestamp, 
            goal: goal, 
            balance: 0, 
            open: true
        });
    }

    function closeRequest(uint id) public {
        uint balance = requests[id].balance;
        address author = requests[id].author;

        require(id <= lastId, unicode"Requisição não existe");
        require(requests[id].open, unicode"Requisição já está fechada");
        require(requests[id].author == msg.sender || balance >= requests[id].goal, unicode"Somente o Autor pode fechar a requisição");                

        requests[id].open = false;

        if (balance > 0) {
            requests[id].balance = 0;
            payable(author).transfer(balance);
        }
    }

    function donate(uint id) public payable {
        require(id <= lastId, unicode"Requisição não existe");
        require(requests[id].open, unicode"Requisição já está fechada");
        require(msg.value > 0, unicode"Valor deve ser maior que 0");

        requests[id].balance += msg.value;


        if (requests[id].balance >= requests[id].goal) {
            closeRequest(id);
        }
    }

    function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory) {
        Request[] memory openRequests = new Request[](quantity);
        uint count = 0;
        uint id = startId;

        do {
            if (requests[id].open) {
                openRequests[count] = requests[id];
                count++;
            }

            id++;
        } 
        while (count < quantity && id <= lastId);

        return openRequests;
    }
}