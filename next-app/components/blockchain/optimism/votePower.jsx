import { ethers } from "ethers";

const opMainnetURL = "https://mainnet.optimism.io";
const opContractAddr = "0x4200000000000000000000000000000000000042";
const provider = new ethers.providers.JsonRpcProvider(opMainnetURL);

export async function getOpVotePower(address) {
    const governanceTokenAbi = [
        "function getVotes(address account) external view returns (uint256)",
    ];
    const governanceTokenContract = new ethers.Contract(
        opContractAddr,
        governanceTokenAbi,
        provider,
    );
    return await governanceTokenContract.getVotes(address);
}
