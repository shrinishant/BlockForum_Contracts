require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

console.log(process.env.PRIVATE_KEY)
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
