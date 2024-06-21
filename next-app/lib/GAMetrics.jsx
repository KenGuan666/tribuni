import ReactGA from 'react-ga4';

export const initGA = () => {
  console.log('Google Analytics initialized');
  ReactGA.initialize("G-E01KYBXTBW");
};

export const GALogEvent = ({
    action, // "ENTER PAGE", "CLICK BUTTON", "SETUP ALERT"...
    label, // "Proposal", "Vote Now", "Bookmarks"...
    username,
    protocol_id, // protocol_id is all lower case
    proposal_id, // proposal_id as defined by "id" column of proposal DB
}) => {
    console.log("LOGS!")
    ReactGA.event({
        action,
        label,
        username,
        protocol_id,
        proposal_id,
        debug_mode: true
    });
};
