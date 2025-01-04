import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";

import {
    FutarchyRPCClient,
    AUTOCRAT_VERSIONS,
} from "@metadaoproject/futarchy-sdk";
// import { program } from "@project-serum/anchor/dist/cjs/native/system";

export const maxDuration = 300;

async function getSolanaProvider() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const dummyWallet = {
        publicKey: new PublicKey("11111111111111111111111111111111"),
        signTransaction: () => {
            throw new Error("Read only wallet cannot sign transaction");
        },
        signAllTransactions: () => {
            throw new Error("Read only wallet cannot sign transactions");
        },
    };

    return new AnchorProvider(connection, dummyWallet, {});
}

export async function POST(req) {
    const provider = await getSolanaProvider();
    const programVersion = AUTOCRAT_VERSIONS[0];
    const client = FutarchyRPCClient.make(provider, provider);
    const daosClient = client.daos;
    daosClient.futarchyProtocols = daosClient.futarchyProtocols.filter(
        (p) => p.deploymentVersion == programVersion.label,
    );

    const daos = await daosClient.fetchAllDaos();
    daos.forEach((d) => {
        console.log(d.name);
        console.log(d.daos);
    });
    return Response.json({ message: "success" }, { status: 201 });
}
