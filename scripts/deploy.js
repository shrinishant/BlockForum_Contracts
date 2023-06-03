// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  //Get the contract to deploy
  const CommentsContract = await hre.ethers.getContractFactory("Comments")
  const contract = await CommentsContract.deploy()

  await contract.deployed()

  const tx1 = await contract.addComment("my-blog-post", "My first comment")
  await tx1.wait()

  const tx2 = await contract.addComment("my-blog-post", "Nishant is sexy")
  await tx2.wait()

  const comments = await contract.getComments("my-blog-post")
  console.log(comments)
  console.log("Contract deployed to: ", contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});