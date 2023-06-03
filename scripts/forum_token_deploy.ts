import {Contract, ContractFactory} from "ethers"
import {ethers} from "hardhat"

const makeBig = (value: string | number) => {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return ethers.utils.parseUnits(value);
};

async function main(){
    const [owner, user1] = await ethers.getSigners()

    console.log("With each deploment to the localhost...")
    console.log("...these addresses will stay the same")
    console.log("owner address: ", owner.address)
    console.log("user1 address: ", user1.address)

    const Token: ContractFactory = await ethers.getContractFactory("Token")
    const token: Contract = await Token.deploy()

    console.log("#w3f deployd to : ", token.address)

    const Forum: ContractFactory = await ethers.getContractFactory("Forum")
    const forum: Contract = await Forum.deploy(token.address)

    console.log("Forum deploed to : ", forum.address)

    const qTx = await forum.postQuestion("Are you my Fren? :)")
    await qTx.wait()

    const answerTx = await forum.postAnswer(0, "1st Answer")
    await answerTx.wait()

    const answerTx2 = await forum.postAnswer(0, "2nd Answer")
    await answerTx2.wait()

    const answerTx3 = await forum.postAnswer(0, 'Yes, I am ur fren! 👊');
    await answerTx3.wait();

    const mintTx = await token.connect(user1).mint(makeBig("1000"))
    await mintTx.wait()

    const approve = await token.connect(user1).approve(forum.address, makeBig('1000'))
    await approve.wait()

    const upVote1 = await forum.connect(user1).upvoteAnswer(2)
    await upVote1.wait()
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })