import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers.js"
import {expect} from "chai"
import {Contract} from "ethers"
import {ethers} from "hardhat"

describe('Token', function() {
    let token, owner, otherAccount

    const deployContract =async () => {
        
        const [_owner, _otherAccount] = await ethers.getSigners()

        const Token = await ethers.getContractFactory("Token")
        token = await Token.deploy()

        owner = _owner
        otherAccount = _otherAccount
    }

    beforeEach(async () => {
        await deployContract()
    })

    describe("Deployment", () => {
        it("Should deploy and return correct symbol", async () => {
            expect(await token.symbol()).to.equal("#W3F")
        })
    })
})