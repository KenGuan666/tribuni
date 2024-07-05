import { BASE_USER } from "@/components/constants";
import { create } from "zustand";

export const useStore = create((set, get) => ({
    tele: null,
    setTele: (tele) => set({ tele }),
    user: BASE_USER,
    setUser: (user) => set({ user }),
    pageLoading: true,
    setPageLoading: (pageLoading) => set({ pageLoading }),
    expanded: false,
    setExpanded: (expanded) => set({ expanded }),
    refreshUser: false,
    setRefreshUser: (refreshUser) => set({ refreshUser }),
    protocolFilter: "all",
    setProtocolFilter: (protocolFilter) => set({ protocolFilter }),

    cachedProtocols: new Map(),
    getCachedProtocol: (protocolId) => get().cachedProtocols.get(protocolId),
    cacheProtocol: (protocolInfo) =>
        set((state) => {
            const newMap = new Map(state.cachedProtocols);
            newMap.set(protocolInfo.id, protocolInfo);
            return { cachedProtocols: newMap };
        }),

    cacheProtocols: (protocolsInfo) =>
        set((state) => {
            const newMap = new Map(state.cachedProtocols);
            protocolsInfo.forEach((protocolInfo) => {
                newMap.set(protocolInfo.id, protocolInfo);
            });
            return { cachedProtocols: newMap };
        }),

    cachedProposals: new Map(),
    getCachedProposal: (proposalId) => get().cachedProposals.get(proposalId),
    cacheProposal: (proposalData) =>
        set((state) => {
            const newMap = new Map(state.cachedProposals);
            newMap.set(proposalData.id, proposalData);
            return { cachedProposals: newMap };
        }),
    cacheProposals: (proposalsData) =>
        set((state) => {
            const newMap = new Map(state.cachedProposals);
            proposalsData.forEach((proposalData) => {
                newMap.set(proposalData.id, proposalData);
            });
            return { cachedProposals: newMap };
        }),

    cachedProposalsByProtocol: new Map(),
    getCachedProposalsByProtocol: (protocolId) =>
        get()
            .cachedProposalsByProtocol.get(protocolId)
            ?.map((proposalId) => get().cachedProposals.get(proposalId)),
    cacheProposalsByProtocol: (protocolId, proposalsData) =>
        set((state) => {
            const newMap = new Map(state.cachedProposalsByProtocol);
            newMap.set(
                protocolId,
                proposalsData.map((proposal) => proposal.id),
            );

            const newProposalMap = new Map(state.cachedProposals);
            proposalsData.forEach((proposal) =>
                newProposalMap.set(proposal.id, proposal),
            );
            return {
                cachedProposalsByProtocol: newMap,
                cachedProposals: newProposalMap,
            };
        }),
}));
