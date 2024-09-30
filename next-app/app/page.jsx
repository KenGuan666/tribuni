"use client";

import { useEffect, useState } from "react";
import { fetchAllUsersData } from "@/components/db/user";
import { fetchPostCount } from "@/components/db/op_forum";
import { fetchProposalCountByProtocols } from "@/components/db/proposal";
import { getOpVotePower } from "@/components/blockchain/optimism/votePower";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Logov1 from "@/public/assets/logov1.png";
import Logo3d from "@/public/assets/logo3d.png";
import LandingPoster1 from "@/public/assets/LandingPoster1.png";
import LandingPoster2 from "@/public/assets/LandingPoster2.png";
import LandingPoster3 from "@/public/assets/LandingPoster3.png";
import LogoWithoutCircle from "@/public/assets/IconWithoutCircle.svg";
import LinkIcon from "@/public/assets/LinkIcon.svg";
import launamuAvatar from "@/public/assets/launamu.jpg";
import chaselbAvatar from "@/public/assets/claselb.jpg";
import jonwongAvatar from "@/public/assets/jonwong.jpg";
import coleAvatar from "@/public/assets/cole.jpg";
import callenAvatar from "@/public/assets/callen.jpg";
import liliopAvatar from "@/public/assets/liliop.jpg";
import juanbugAvatar from "@/public/assets/juanbug.jpg";
import batbAvatar from "@/public/assets/batb.png";

import numeral from "numeral";

export default function Page() {
    const [users, setUsers] = useState([]);
    const [votePowerByDelegate, setVotePowerByDelegate] = useState(new Map());
    const [postCount, setPostCount] = useState(0);
    const [proposalCount, setProposalCount] = useState(0);

    const fetchData = async () => {
        let users = await fetchAllUsersData();
        setUsers(users);

        let map = new Map();
        const delegates = users.filter((u) => u.evm_delegate_addresses);
        await Promise.all(
            delegates.map(async (u) =>
                Promise.all(
                    u.evm_delegate_addresses.map(async (addr) => {
                        const voteCount = await getOpVotePower(addr);
                        const voteCountNumber = Number(
                            voteCount.toBigInt() / 10n ** 18n,
                        );
                        if (voteCountNumber) {
                            map.set(addr, voteCountNumber);
                        }
                    }),
                ),
            ),
        );
        setVotePowerByDelegate(map);
        const postCount = await fetchPostCount();
        setPostCount(postCount);
        const proposalCount = await fetchProposalCountByProtocols(["optimism"]);
        setProposalCount(proposalCount[0].count);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const delegatesCount = votePowerByDelegate.size;
    const totalDelegateVotePower = Array.from(
        votePowerByDelegate.values(),
    ).reduce((s, power) => s + power, 0);

    if (!delegatesCount || !postCount || !proposalCount) {
        return null;
    }

    return (
        <>
            <Head>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
                </style>
            </Head>
            <div className="background">
                <div className="content-container">
                    {/* Top bar component with logo and Join button */}
                    <div
                        className="top-bar"
                        style={{
                            marginTop: "8px",
                            marginBottom: "8px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* clickable logo and text */}
                        <div
                            className="top-left-logo"
                            style={{
                                marginLeft: "8px",
                            }}
                        >
                            <Link href="/" passHref>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        src={Logov1}
                                        alt="Tribuni Logo"
                                        width={72}
                                        height={72}
                                        className="top-left-logo-image"
                                    />
                                    <div className="bold-text-logo">
                                        Tribuni
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {/* join button */}
                        <div
                            className="join-button"
                            style={{
                                marginRight: "12px",
                            }}
                        >
                            <LandingPageButton
                                text="Join Now"
                                url="https://t.me/Tribuni_Bot"
                            />
                        </div>
                    </div>

                    {/* The center section of landing page */}
                    <div className="hero-section">
                        {/* Title text */}
                        <div style={{ marginTop: "50px" }}>
                            <div
                                className="bold-text"
                                style={{
                                    lineHeight: "0.9",
                                    margin: 2,
                                    padding: 2,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Find Your
                            </div>
                            <div
                                className="bold-text"
                                style={{
                                    lineHeight: "0.9",
                                    margin: 2,
                                    padding: 2,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Tribe Now.
                            </div>
                            <div
                                className="normal-text"
                                style={{
                                    marginTop: "8px",
                                }}
                            >
                                The easiest way to organize your delegate flow
                            </div>
                        </div>

                        {/* Join button */}
                        <div
                            className="join-button"
                            style={{
                                marginTop: "36px",
                                zIndex: 2,
                                position: "relative",
                            }}
                        >
                            <LandingPageButton
                                text="Start Today"
                                url="https://t.me/Tribuni_Bot"
                            />
                        </div>

                        {/* The 3D logo in background */}
                        <div className="background-image">
                            <Image
                                src={Logo3d}
                                alt="Background Image"
                                layout="fill" // Ensures the image fills the container
                                objectFit="contain" // Ensure it fits properly inside the bounds
                                quality={100}
                                priority
                            />
                        </div>
                    </div>

                    {/* Statistics table */}
                    <StatsTable
                        opDelegateCount={delegatesCount}
                        opForumPostCount={postCount}
                        opProposalCount={proposalCount}
                        opVoteCount={totalDelegateVotePower}
                    />

                    {/* a blank space holder */}
                    <div
                        style={{
                            marginTop: "100px",
                        }}
                    />

                    {/* Horizontally scrolling banners */}
                    <ImageCarousel />

                    {/* Testimonials */}
                    <div
                        className="bold-text-logo"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "80px",
                            marginBottom: "40px",
                        }}
                    >
                        Loved By OP Delegates
                    </div>
                    <TestimonialWall />

                    {/* 2nd Start Today button */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "80px",
                            marginBottom: "100px",
                        }}
                    >
                        <LandingPageButton
                            text="Start Today"
                            url="https://t.me/Tribuni_Bot"
                        />
                    </div>

                    {/* The footer at bottom of screen */}
                    <footer className="footer">
                        <div className="footer-content">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src={LogoWithoutCircle}
                                    alt="Tribuni Logo"
                                    width={30}
                                    height={30}
                                />
                                <div
                                    className="bold-text-logo"
                                    style={{
                                        marginTop: "6px",
                                        marginLeft: "4px",
                                        color: "black",
                                        fontSize: "18px",
                                    }}
                                >
                                    Tribuni
                                </div>
                                <div
                                    className="footer-text"
                                    style={{
                                        marginTop: "4px",
                                        marginLeft: "20px",
                                    }}
                                >
                                    2024 Tribuni. All rights reserved.
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "right",
                                    gap: "20px",
                                }}
                            >
                                <a
                                    className="footer-text"
                                    href="https://https://x.com/0xTribuni"
                                >
                                    X
                                </a>
                                <a
                                    className="footer-text"
                                    href="https://t.me/+GQxcYz_80B40ZGMx"
                                    style={{ color: "black " }}
                                >
                                    Community
                                </a>
                                <a
                                    className="footer-text"
                                    href="https://gov.optimism.io/t/tribuni-alpha-launch-telegram-mini-app-built-by-delegates-for-delegates/8568/13"
                                    style={{ color: "black " }}
                                >
                                    Launch Detail
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
                <style jsx>{`
                    .background {
                        width: 100%;
                        background: linear-gradient(
                            185deg,
                            #000000 0%,
                            #000000 40%,
                            #0b4158 100%
                        );
                    }

                    .content-container {
                        overflow-y: auto;
                        -ms-overflow-style: none; /* IE and Edge */
                        scrollbar-width: none; /* Firefox */
                    }

                    .content-container::-webkit-scrollbar {
                        display: none; /* Chrome, Safari, Opera */
                    }

                    .content-container {
                        padding-left: 12px;
                        padding-right: 12px;
                        padding-top: 12px;
                        color: white;
                        overflow-x: hidden;
                    }

                    .hero-section {
                        position: relative;
                        height: 70vh;
                        display: flex;
                        text-align: center;
                        flex-direction: column;
                        color: white;
                        overflow: hidden;
                    }

                    .background-image {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 60vw;
                        height: 60vh;
                        transform: translate(-50%, -50%);
                        z-index: 1;
                    }

                    .bold-text {
                        z-index: 2;
                        position: relative;
                        font-size: 72px;
                        font-weight: 600;
                        color: #e9e9e9;
                        font-family: "Instrument Sans", system-ui;
                        margin: 0;
                        padding: 0;
                    }

                    .normal-text {
                        z-index: 2;
                        font-size: 24px;
                        position: relative;
                        color: #e9e9e9;
                        font-family: "Instrument Sans", system-ui;
                    }

                    .bold-text-logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #e9e9e9;
                        font-family: "Arial", sans-serif;
                    }

                    .footer {
                        background-color: #f5f7fa; /* Light background */
                        margin-left: 100px;
                        margin-right: 100px;
                        padding: 20px 40px;
                        border-radius: 20px 20px 0 0; /* Rounded top corners */
                        display: flex;
                        justify-content: center;
                    }

                    .footer-content {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        max-width: 1200px; /* Limit footer width */
                    }

                    .footer-text {
                        font-size: 16px;
                        color: black;
                        font-family: "Instrument Sans", system-ui;
                    }
                `}</style>
            </div>
        </>
    );
}

const LandingPageButton = ({ text, url }) => {
    return (
        <a href={url} className="button">
            {text}
            <style jsx>{`
                .button {
                    padding: 10px 20px;
                    background-color: #00eaff; /* Bright blue background */
                    color: black; /* Text color */
                    border-radius: 20px;
                    text-decoration: none;
                    font-weight: bold;
                    display: inline-block;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .button:hover {
                    background-color: #00aaff; /* Darken the blue on hover */
                }
            `}</style>
        </a>
    );
};

function StatsTable({
    opVoteCount,
    opProposalCount,
    opForumPostCount,
    opDelegateCount,
}) {
    const stats = [
        {
            number: numeral(opVoteCount).format("0.0a"),
            label: "OP Votes combined",
        },
        {
            number: numeral(opProposalCount).format("0a"),
            label: "Gov Topics covered",
        },
        {
            number: numeral(opForumPostCount).format("0.0a"),
            label: "OP Gov post analyzed",
        },
        {
            number: numeral(opDelegateCount).format("0a"),
            label: "OP delegates supported",
        },
    ];

    return (
        <div className="stats-table">
            {stats.map((stat, index) => (
                <div className="stat-container" key={index}>
                    {/* Stat Entry */}
                    <div className="stat-item">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>

                    {/* Divider, not rendered for the last item */}
                    {index < stats.length - 1 && <div className="divider" />}
                </div>
            ))}

            {/* Styles */}
            <style jsx>{`
                .stats-table {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #1c1c1e;
                    padding: 20px;
                    border-radius: 10px;
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .stat-container {
                    display: flex;
                    align-items: center;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: left;
                    padding: 0 28px;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #ffffff;
                }

                .stat-label {
                    font-size: 1rem;
                    color: #a0a0a0;
                }

                .divider {
                    width: 1px;
                    height: 40px;
                    background-color: #a0a0a0;
                }

                @media (max-width: 768px) {
                    .stats-table {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .divider {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

// The split section which goes into image carousel
function SplitSection({ idx }) {
    let imgs = [LandingPoster1, LandingPoster2, LandingPoster3];

    let boldTexts = [
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <div className="highlight-text-split"> Receive Alerts </div>
                <div className="normal-text-split"> , Get </div>
            </div>
            <div className="normal-text-split"> Proposal Insights, </div>
            <div className="normal-text-split"> And Stay Updated. </div>
        </div>,
        <div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                }}
            >
                <div className="normal-text-split"> Receive Alerts, </div>
                <div className="highlight-text-split"> Get </div>
            </div>
            <div className="highlight-text-split"> Proposal Insights, </div>
            <div className="normal-text-split"> And Stay Updated. </div>
        </div>,
        <div>
            <div className="normal-text-split"> Receive Alerts, Get </div>
            <div className="normal-text-split"> Proposal Insights, </div>
            <div className="highlight-text-split"> And Stay Updated. </div>
        </div>,
    ];

    return (
        <section className="split-section">
            <div className="split-section-text">
                <div
                    style={{
                        display: "flex",
                        alignItems: "left",
                        flexDirection: "column",
                    }}
                >
                    {boldTexts[idx]}
                    <div
                        className="small-text-split"
                        style={{ marginTop: "24px" }}
                    >
                        {" "}
                        Seamless updates without app-switching,{" "}
                    </div>
                    <div className="small-text-split">
                        {" "}
                        reducing tooling silos in governance.{" "}
                    </div>
                </div>
            </div>
            <div className="image-block">
                <Image
                    src={imgs[idx]} // Replace with your image path
                    alt="Right side image"
                    layout="fill"
                    objectFit="cover" // Ensures the image covers the area
                    quality={100}
                />
            </div>

            <style jsx global>{`
                .split-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 97vw; /* Full viewport width */
                    height: 75vh; /* Full viewport height */
                }

                .split-section-text {
                    flex: 1; /* Takes up 50% of the width */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .highlight-text-split {
                    font-size: 36px;
                    color: #e9e9e9;
                    font-weight: 600;
                    font-family: "Instrument Sans", system-ui;
                    line-height: 1.1;
                }

                .normal-text-split {
                    font-size: 36px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.5);
                    font-family: "Instrument Sans", system-ui;
                    line-height: 1.1;
                }

                .small-text-split {
                    font-size: 20px;
                    color: rgba(255, 255, 255, 0.7);
                    font-family: "Instrument Sans", system-ui;
                    line-height: 1.1;
                }

                .image-block {
                    flex: 1; /* Takes up 50% of the width */
                    position: relative; /* Required for Next.js Image layout="fill" */
                    height: 100%;
                }

                @media (max-width: 768px) {
                    .split-section {
                        flex-direction: column; /* Stack the text and image on mobile */
                    }

                    .image-block {
                        height: 50vh; /* Adjust height for smaller screens */
                    }
                }
            `}</style>
        </section>
    );
}

function TestimonialCard({
    avatar,
    name,
    association,
    text,
    delegateURL,
    attestationURL,
}) {
    return (
        <div className="testimonial-card">
            <Link href={delegateURL}>
                <div className="header">
                    <Image
                        src={avatar}
                        alt={`${name}'s avatar`}
                        width={50}
                        height={50}
                        className="avatar"
                        style={{
                            borderRadius: "50%",
                        }}
                    />

                    <div className="user-info">
                        <div
                            className="testimonial-card-white-text"
                            style={{
                                fontWeight: "500",
                                fontSize: "18px",
                            }}
                        >
                            {name}
                        </div>
                        <div className="testimonial-card-gray-text">
                            {association}
                        </div>
                    </div>
                </div>
            </Link>

            <div
                className="testimonial-card-white-text"
                style={{
                    marginTop: "20px",
                    marginBottom: "12px",
                }}
            >
                {text}
            </div>

            <Link href={attestationURL}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "right",
                        gap: "12px",
                        marginRight: "12px",
                    }}
                >
                    <Image src={LinkIcon} alt="EAS" width={18} height={18} />
                    <div className="testimonial-card-gray-text"> EAS </div>
                </div>
            </Link>

            <style jsx>{`
                .testimonial-card {
                    padding: 24px;
                    border-radius: 12px;
                    max-width: 350px;
                    margin: 0 auto;
                    text-align: left;
                    background: linear-gradient(
                        45deg,
                        #000000 0%,
                        #0b4158 100%
                    );
                }

                .header {
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                }

                .testimonial-card-white-text {
                    color: rgba(236, 236, 236, 1);
                }

                .testimonial-card-gray-text {
                    color: rgba(236, 236, 236, 0.7);
                }
            `}</style>
        </div>
    );
}

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageCarousel() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
    };

    return (
        <div>
            <Slider {...settings}>
                <SplitSection idx={0} />
                <SplitSection idx={1} />
                <SplitSection idx={2} />
            </Slider>
        </div>
    );
}

function TestimonialWall() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 9000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        pauseOnHover: true,
    };

    const testimonials = [
        {
            avatar: launamuAvatar,
            name: "launamu",
            text: "I recently started using Tribuni's Telegram bot to stay up-to-date with any OP Token House votes, I haven't found another tool that reminds me of this. I don't use the summary feature much though.",
            association: "",
            delegateURL:
                "https://vote.optimism.io/delegates/0x5d36a202687fd6bd0f670545334bf0b4827cc1e2",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0xb8b6bf5458a2f89a1b318817fecc5a9ec6696388bd56ef299cc159615f009bea",
        },
        {
            avatar: chaselbAvatar,
            name: "chaselb",
            text: "There are no other notification systems that I can use as a delegate across protocols. Tribuni then goes the extra mile by providing proposal summaries.",
            association: "Blockchain@USC",
            delegateURL:
                "https://vote.optimism.io/delegates/0x995013b47ef3a2b07b9e60da6d1fff8fa9c53cf4",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0x07325b942e18dce9469543e0cfa3d95813907a15e596e7ed6b23e1a12bcf5620",
        },
        {
            avatar: jonwongAvatar,
            name: "jonwong",
            text: "It aggregates a bunch of different governance forums and sends alerts about them. It even shows summaries, has links to vote, and its all in one place. Previously, I had to build my own custom bots.",
            association: "Franklin DAO",
            delegateURL:
                "https://vote.optimism.io/delegates/0x070341aa5ed571f0fb2c4a5641409b1a46b4961b",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0xf6c473e541b459d7d1437d586b9141f7f209066ed148d334ca2f1cfc4dd6259f",
        },
        {
            avatar: batbAvatar,
            name: "Derrick",
            text: "Tribuni has become a core part of the governance decision making process at Blockchain at Berkeley because of its ease of installation and interaction. Instead of complicated apps, websites, and platforms, Tribuni seamlessly integrates into our existing communication Telegram channels to inform all relevant voters of updates on all chains we participate in. Tribuni has become an invaluable tool to reduce the friction of governance voting.",
            association: "Blockchain @ Berkeley",
            delegateURL:
                "https://vote.optimism.io/delegates/0x7ae109a63ff4dc852e063a673b40bed85d22e585",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0x1be2e9e6948056b38de6c819f9f71817da4966faae10fe3a4fd459bd82150dbd",
        },
        {
            avatar: coleAvatar,
            name: "Cole @ 404 DAO",
            text: "Great app - Has been very useful for governance accessibility and streamlining information",
            association: "404 DAO",
            delegateURL:
                "https://vote.optimism.io/delegates/0xe93d59cc0bcecfd4ac204827ef67c5266079e2b5",
            attestationURL:
                "https://optimism.easscan.org/offchain/url/#attestation=eNq9U0uqHDEMvEuvh4f%2Bspdhpt8lQha2bB0gJJDjR90h%2B8BABP5KKpW6y18P%2FIAPPB4HQk3wSwj%2BwQjv4N7GTodhiNIaay7NmU2Sxu4eaEJzt9l0KWUYQyxzRssxV5%2FCN4gGT90O1naDaCwqAJOC69p80%2BLOCJo98JoEMlTdOmYy5LbjQX7hnJ1f2p9PmHE%2BP18ygkAa%2Bf40DyUz8H7S1LsoYNMBxRALS3oMrDKme3ccY9scCj5nVhtjrM2WadbW7MP3mo3iBlnVPWFA%2BhbYlphLRu6WCwYN4YZus74FM2%2Fx7KzVwR6BMjAmjhvkXK%2Bu3mghd6AvW1mZi%2BaLmEHwFB8v62e1iU6O3XqTB1Tm8fjx%2Fee%2Bm3nLDN40fS99vFvfVZysG7natg7%2F2TTEq74aej2emsGBgNalvjpx3V3e4kbgZlp%2FsddOnevOinPp1MzSqVav9Y6pTrBGxVyYtdbOuXKqzxph3eXCuaOqbvnkDwtbl%2Ff6EjW8mMC9uyuUr1jWOS82f%2B0oPdElpMAorQfNkidd6l9BukIKk4PFKimkIVE91NQEmjyyGUsAyOh0fPsNXJL79Q%3D%3D",
        },
        {
            avatar: liliopAvatar,
            name: "liliop.eth",
            text: "I'll be using Tribuni to keep update me on all the proposal in Optimism. Would be nice to recognise them in RF6.",
            association: "Optimism",
            delegateURL: "https://vote.optimism.io/delegates/liliop.eth",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0x3b2dc4b165a26cbde6c6a08332157a5eb93011136e85e0055c458083c7847997",
        },
        {
            avatar: juanbugAvatar,
            name: "juanbug",
            text: "Genuinely really useful and use it daily to track and record all of the protocols that we are delegates for",
            association: "pgov",
            delegateURL:
                "https://vote.optimism.io/delegates/0x3fb19771947072629c8eee7995a2ef23b72d4c8a",
            attestationURL:
                "https://optimism.easscan.org/attestation/view/0xe51ed02acd2644b80979ee892202b0f5866fad9fc9c58990de89f3e2749b20b2",
        },
        {
            avatar: callenAvatar,
            name: "Callen",
            text: "As an active Delegate, Tribuni has been a great addition to our day-to-day helping us keep on top of and have easy access to Optimism proposals & votes.",
            association: "Wintermute Governance",
            delegateURL:
                "https://vote.optimism.io/delegates/0xb933aee47c438f22de0747d57fc239fe37878dd1",
            attestationURL:
                "https://optimism.easscan.org/offchain/attestation/view/0x63e11ecc91080c6c8bd7f1aa1cf56062ffcd900cb0b76b451b300b218beccf4a",
        },
    ];

    return (
        <div className="testimonial-wall">
            <Slider {...settings}>
                {testimonials.map((testimonial, idx) => (
                    <TestimonialCard key={idx} {...testimonial} />
                ))}
            </Slider>

            <style jsx>{`
                .testimonial-wall {
                    width: 100%;
                    padding: 20px;
                    background-color: transparent;
                }
            `}</style>
        </div>
    );
}
