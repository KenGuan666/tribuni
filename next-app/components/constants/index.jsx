import { clsx } from "clsx";

export const ANIMATE = clsx("duration-200 transition-all ease-in-out");
export const MAX_WIDTH = clsx("max-w-xl");

export function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

// export const BASE_USER = {
//     id: null,
//     chatid: null,
//     bookmarks: [],
//     premium: 0,
//     email: null,
//     subscriptions: [],
//     duration: 86385,
//     alert_hour: 7,
//     alert_minute: 0,
//     alert_offset: 0,
//     alert_time: 54000,
//     alert_timezone: "America/Los_Angeles",
//     pause_alerts: false,
//     telegram_alerts: true,
//     email_alerts: false,
//     last_telegram_alert: 0,
//     last_email_alert: 0,
// };

export const BASE_USER = {
    id: "cgamble23",
    chatid: `6436170412`,
    premium: 1749012881,
    email: "gamble.cooper23@gmail.com",
    bookmarks: [
        "bec819fb27147e00f48bc944dd34dbd71fd5fcac",
        "efb90d5d9e2d469fce0937618208eb9062cb2dc9",
        "c7eb4ac99b5dd34e83e19b49610b62d654bce7e1",
        "7bc31cce20c150eb6b459f23d5cc82a73544793d",
        "c31422cab1b2cb438c6afc238c5a58c91ca3b3ec",
        "3c5d49af055d6e4826deb31d0ed5a1aae1a91833",
        "9c319d8e6276afa2865fa1d1200daa17acf189b6",
        "9762035081557eb6ddf285a25794c2e37ce1717a",
        "2c8443924510bb622ea1a961a070f214edbbb8a6",
        "009a871ac00258e013ccc8ed2f1478e08c725436",
        "f5c0b44faef91bb40889aabce727bad7d3b3aa20",
        "6476906b7370ef47d24de5e6705affac614e36af",
        "3a69b01508cefc99daf38f22f2ef872633426177",
        "20f5d44f3ece73bc8b514310fec9430f8622c6ce",
        "a6cfd357b73e5effb80276bdbb598d38709428da",
        "69277c8b5cf1ffa64bbc522e17cd2f11726659aa",
        "6e1a659f695e1488d8096112c2a1f4098ead8e11",
        "9af379c121759e59494b070d42c9c6d8863e2551",
        "0acae497df892b58c89116d028754cf4b876450c",
        "82812ca6e04a89c3cd2b6b3f699d7379b1379b7b",
        "5c8f5ac0b7ad23c110793ad1fcf4d3c8d41344d5",
        "65b246a75e02fdc2031a2c7a16fc617087b54f99",
    ],
    subscriptions: ["aavegotchi", "arbitrum", "lido", "optimism"],
    duration: 86385,
    alert_hour: 7,
    alert_minute: 0,
    alert_offset: 0,
    alert_time: 54000,
    alert_timezone: "America/Los_Angeles",
    pause_alerts: false,
    telegram_alerts: true,
    email_alerts: false,
    last_telegram_alert: 0,
    last_email_alert: 0,
};

export const TOAST_BASE = clsx(
    "w-full p-1 bg-isWhite text-isLabelLightPrimary rounded-xl min-w-[22rem] shadow-sm border-isSeparatorLight",
);
