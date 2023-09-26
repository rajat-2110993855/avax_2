# Function-Frontend-Metacrafters
This is a project with a smart contract that contains  4 functions and values of the functions is displayed in frontend app , made for Eth + Avax Intermediate Assesment 2 on the Metacrafters learning platform.

## Description

This program is written in solidity, react.js and ether.js . The program has the following functions :-

(1) You can connect your Metamask wallet to the app and view its balance in the frontend

(2) You can deposit and withdraw ETH in quantities of 1, 2, 5, 10.

(3) You can multiply the ATM balance by 2x, 3x, 4x, 5x.

(4) You can Change the Owner of the contract

## Getting Started

### Executing program

(1) Cloning the github repository : 

```bash
git clone https://github.com/Spydiecy/Function-Frontend-Metacrafters.git
```

(2) Install the required dependencies

```bash
cd Function-Frontend-Metacrafters
npm i
```

(3) Open two extra terminals in your VS code, 
 
(4) In the second terminal type:
```bash
cd Function-Frontend-Metacrafters
npx hardhat node
```
   
(5) In the third terminal, type:
```bash
cd Function-Frontend-Metacrafters
npx hardhat run --network localhost scripts/deploy.js.
```
  
(6) Now, go back to the first terminal and type:
```bash
npm run dev
```

(7) Great you are done, now open the url below in your browser and enjoy interacting the program

```bash
http://localhost:3000
```

## Authors

Tanishq

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
