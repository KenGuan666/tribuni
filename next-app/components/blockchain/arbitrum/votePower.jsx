import { ethers } from "ethers";

const arbOneMainnetURL = "https://arbitrum.drpc.org";
const arbitrumContractAddr = "0x912CE59144191C1204E64559FE8253a0e49E6548";
const provider = new ethers.providers.JsonRpcProvider(arbOneMainnetURL);

export async function getArbVotePower(address) {
    const governanceTokenAbi = [
        "function getVotes(address account) external view returns (uint256)",
    ];
    const governanceTokenContract = new ethers.Contract(
        arbitrumContractAddr,
        governanceTokenAbi,
        provider,
    );
    return await governanceTokenContract.getVotes(address);
}
