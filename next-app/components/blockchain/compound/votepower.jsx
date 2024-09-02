import { ethers } from "ethers";

const ethMainnetURL = "https://ethereum-rpc.publicnode.com";
const compoundContractAddr = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
const provider = new ethers.providers.JsonRpcProvider(ethMainnetURL);

export async function getCompoundVotePower(address) {
    const governanceTokenAbi = [
        "function getCurrentVotes(address account) external view returns (uint96)",
    ];
    const governanceTokenContract = new ethers.Contract(
        compoundContractAddr,
        governanceTokenAbi,
        provider,
    );
    return await governanceTokenContract.getCurrentVotes(address);
}
