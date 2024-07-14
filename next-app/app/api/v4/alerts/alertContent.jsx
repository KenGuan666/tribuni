import { fetchProposalsByIds } from "@/components/db/proposal";
import { fetchProtocolsByIds } from "@/components/db/protocol";
import { isInThePast } from "@/utils/time";

/*
    alertContentForUsers: return a list of alertContent, representing bookmarked proposals by each user

    alertContent is an object, which contains a protocol's metadata which goes into an alert, and the recipient's metadata
    {
        protocolInfo: {...},
        proposalsData: [
            {...},
            {...},
        ],
        user: {...},
    }
*/
export async function alertContentForUsers(users) {
    // fetch proposals bookmarked by at least one user
    let proposalIdsWithRepeat = [];
    users.forEach((user) => {
        user.bookmarks.forEach((proposalId) =>
            proposalIdsWithRepeat.push(proposalId),
        );
    });
    const proposalIds = Array.from(new Set(proposalIdsWithRepeat));

    var proposalsData;
    try {
        proposalsData = await fetchProposalsByIds(proposalIds);
    } catch (err) {
        console.log(err);
        return null;
    }

    // filter out completed proposals
    proposalsData = proposalsData.filter(
        (proposal) => !isInThePast(proposal.endtime),
    );
    return alertContentWithProposals(users, proposalsData);
}

/*
    alertContentWithProposals: return a list of alertContent, representing specified proposals
*/
export async function alertContentWithProposals(users, proposalsData) {
    // fetch protocols of which at least one proposal is specified
    let protocolIdsWithRepeat = [];
    proposalsData.forEach((proposalData) =>
        protocolIdsWithRepeat.push(proposalData.protocol),
    );
    const protocolIds = Array.from(new Set(protocolIdsWithRepeat));

    var protocolsInfo;
    try {
        protocolsInfo = await fetchProtocolsByIds(protocolIds);
    } catch (err) {
        console.log(err);
        return null;
    }

    // proposalId => proposalData map
    const proposalsById = proposalsData.reduce(
        (map, proposalData) => map.set(proposalData.id, proposalData),
        new Map(),
    );

    // protocolId => protocolInfo map
    const protocolsById = protocolsInfo.reduce(
        (map, protocolInfo) => map.set(protocolInfo.id, protocolInfo),
        new Map(),
    );

    // construct alertContent for each user
    let alertContents = [];
    users.forEach((user) => {
        // protocolId => proposalIds map for current user
        const proposalsByProtocolId = user.bookmarks.reduce(
            (map, proposalId) => {
                const proposalData = proposalsById.get(proposalId);
                if (!proposalData) return map;
                const protocolId = proposalData.protocol;
                let proposalsData = map.get(protocolId) || [];
                proposalsData.push(proposalData);
                return map.set(protocolId, proposalsData);
            },
            new Map(),
        );

        proposalsByProtocolId.forEach((proposalsData, protocolId) => {
            const protocolInfo = protocolsById.get(protocolId);
            alertContents.push({
                protocolInfo,
                proposalsData,
                user,
            });
        });
    });
    return alertContents;
}
