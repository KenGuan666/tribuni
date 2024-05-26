"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
// import { toast } from "sonner";
import toast from "react-hot-toast";
import clsx from "clsx";
import { ANIMATE, MAX_WIDTH, TOAST_BASE } from "@/components/constants";
import { ChevronForwardCircleFill } from "@/components/ios";
import { useSearchParams } from "next/navigation";
import { AccountCircle, VerifiedUser } from "@/components/material-rounded";
import { Cancel } from "@/components/material-rounded/Cancel";
import { CheckCircle } from "@/components/material-rounded/CheckCircle";
import { Spinner } from "@/components/loaders";
import { RegisterUser } from "./RegisterUser";
import { redirect } from "next/navigation";
import { CheckUserStatus } from "./CheckUserStatus";
import { useStore } from "@/store";

const RegistrationFormPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { refreshUser, setRefreshUser } = useStore();

  const username = params.get("username");
  const chatid = params.get("chatid");

  const [inviteCode, setInviteCode] = useState("");
  const [status, setStatus] = useState("NONE");
  const [inputValid, setInputValid] = useState(false);
  const [userStatus, setUserStatus] = useState("LOADING");

  const INPUT_CONTAINER = clsx(
    "outline-none focus:outline-none font-500 px-2 py-2 leading-tight w-full border-2 border-isSystemLightSecondary focus-within:border-isBlueLight rounded-xl bg-isSystemLightSecondary flex flex-row space-x-2 items-center text-base",
    ANIMATE
  );

  const INPUT_ICON = clsx("w-6 h-6 fill-isLabelLightSecondary");
  const INPUT = clsx(
    "outline-none focus:outline-none font-400 text-isLabelLightPrimary bg-transparent grow truncate text-ellipsis",
    ANIMATE
  );

  const CLEAR_ICON = clsx("w-5 h-5 fill-isLabelLightSecondary");

  const checkInput = () => {
    if (inviteCode !== "") {
      setInputValid(true);
    } else {
      setInputValid(false);
    }
  };

  useEffect(() => {
    checkInput();
  }, [inviteCode]);

  const checkUserStatus = async () => {
    try {
      const newStatus = await CheckUserStatus({ username });

      setUserStatus(newStatus.status);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const Welcome = () => {
    if (userStatus === true) {
      setStatus("REDIRECTING");
      router.push(`/protocols?username=${username}&chatid=${chatid}`);
    }
  };

  useEffect(() => {
    Welcome();
  }, [userStatus]);

  return (
    <form
      id="register"
      onSubmit={async (e) => {
        e.preventDefault();

        const inputContainer = document.getElementById("inviteCode");
        if (inputContainer) {
          inputContainer.blur();
        }

        let res = await RegisterUser({
          username: username,
          chatid: chatid,
          inviteCode: inviteCode,
        });

        if (res.code === 201) {
          setStatus("REDIRECTING");

          // toast.custom(
          //   (t) => (
          //     <div className={TOAST_BASE}>
          //       <div className="flex flex-row items-center w-full space-x-1">
          //         <div className="px-1 text-sm rounded-lg bg-isGreenLight text-isWhite font-500">
          //           Success
          //         </div>
          //         <div className="px-1 text-base leading-tight rounded-lg grow text-isLabelLightPrimary font-400">
          //           Welcome to Tribuni.
          //         </div>

          //         <button
          //           className={clsx(
          //             "leading-tight px-2 py-[0.1rem] text-sm rounded-md bg-isSystemLightSecondary text-isLabelLightSecondary flex flex-row items-center font-500 hover:bg-isSystemLightSecondary/50",
          //             ANIMATE
          //           )}
          //           onClick={() => toast.dismiss(t)}
          //         >
          //           <div>Dismiss</div>
          //           <Cancel
          //             classes={clsx(
          //               "w-4 h-4 fill-isLabelLightSecondary -mr-1 ml-1"
          //             )}
          //           />
          //         </button>
          //       </div>
          //     </div>
          //   ),
          //   {
          //     duration: 3000,
          //   }
          // );

          toast.success("Registration successful.");

          setUserStatus(true);
          setRefreshUser(!refreshUser);
        } else if (res.code === 401) {
          // toast.custom(
          //   (t) => (
          //     <div className={TOAST_BASE}>
          //       <div className="flex flex-row items-center w-full space-x-1">
          //         <div className="px-1 text-sm rounded-lg bg-isRedLight text-isWhite font-500">
          //           Error
          //         </div>
          //         <div className="px-1 text-base leading-tight rounded-lg grow text-isLabelLightPrimary font-400">
          //           Invalid Invite Code!
          //         </div>

          //         <button
          //           className={clsx(
          //             "leading-tight px-2 py-[0.1rem] text-sm rounded-md bg-isSystemLightSecondary text-isLabelLightSecondary flex flex-row items-center font-500 hover:bg-isSystemLightSecondary/50",
          //             ANIMATE
          //           )}
          //           onClick={() => toast.dismiss(t)}
          //         >
          //           <div>Dismiss</div>
          //           <Cancel
          //             classes={clsx(
          //               "w-4 h-4 fill-isLabelLightSecondary -mr-1 ml-1"
          //             )}
          //           />
          //         </button>
          //       </div>
          //     </div>
          //   ),
          //   {
          //     duration: 3000,
          //   }
          // );

          toast.error("Invalid invite code.");
        } else {
          // toast.custom(
          //   (t) => (
          //     <div className={TOAST_BASE}>
          //       <div className="flex flex-row items-center w-full space-x-1">
          //         <div className="px-1 text-sm rounded-lg bg-isRedLight text-isWhite font-500">
          //           Error
          //         </div>
          //         <div className="px-1 text-base leading-tight rounded-lg grow text-isLabelLightPrimary font-400">
          //           Something Went Wrong!
          //         </div>

          //         <button
          //           className={clsx(
          //             "leading-tight px-2 py-[0.1rem] text-sm rounded-md bg-isSystemLightSecondary text-isLabelLightSecondary flex flex-row items-center font-500 hover:bg-isSystemLightSecondary/50",
          //             ANIMATE
          //           )}
          //           onClick={() => toast.dismiss(t)}
          //         >
          //           <div>Dismiss</div>
          //           <Cancel
          //             classes={clsx(
          //               "w-4 h-4 fill-isLabelLightSecondary -mr-1 ml-1"
          //             )}
          //           />
          //         </button>
          //       </div>
          //     </div>
          //   ),
          //   {
          //     duration: 3000,
          //   }
          // );

          toast.error("Something went wrong.");
        }

        setStatus("NONE");
      }}
      className={clsx(
        "flex flex-col items-center w-full mt-8 place-content-center px-2"
      )}
    >
      <div className={clsx("w-full flex flex-col space-y-3 mt-4", MAX_WIDTH)}>
        <div className={INPUT_CONTAINER}>
          <AccountCircle classes={clsx(INPUT_ICON)} />

          {userStatus !== "LOADING" && userStatus !== "ERROR" && (
            <div className={INPUT}>{username}</div>
          )}

          {(userStatus === "LOADING" || userStatus === "ERROR") && (
            <div className="flex flex-col items-center grow place-content-center">
              <Spinner classes={clsx("w-5 h-5 border-isBlueLight")} />
            </div>
          )}

          <CheckCircle
            classes={clsx("w-5 h-5 fill-isGreenLight rounded-full")}
          />
        </div>

        <div className={INPUT_CONTAINER}>
          <VerifiedUser classes={INPUT_ICON} />

          <input
            id="inviteCode"
            type="text"
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
            }}
            value={inviteCode}
            placeholder="Invite Code"
            className={clsx(INPUT, "placeholder-isLabelLightSecondary")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                document.getElementById("submit").click();
              }
            }}
          />

          {inviteCode !== "" && (
            <button
              onClick={() => {
                setInviteCode("");
                const div = document.getElementById("inviteCode");
                if (div) {
                  div.focus();
                }
              }}
            >
              <Cancel classes={CLEAR_ICON} />
            </button>
          )}
        </div>

        {/* <div className="w-full text-xs italic text-center text-isLabelLightSecondary font-400 !mt-1">
          Don't have invite code? Request one{" "}
          <span className="underline text-isBlueLight underline-offset-2 font-500">
            here
          </span>
        </div> */}

        {/* <hr className="w-full rounded-full bg-isSeparatorLight !mt-5 !mb-3" /> */}

        <button
          id="submit"
          type="submit"
          disabled={!inputValid}
          onClick={() => {
            setStatus("REGISTERING");
          }}
          className={clsx(
            "!mt-8 text-center w-full bg-isBlueLight rounded-xl text-isWhite font-500 hover:bg-isBlueLightEmphasis h-10 flex flex-row items-center place-content-center",
            ANIMATE,
            !inputValid && "cursor-not-allowed"
          )}
        >
          {status === "REGISTERING" && (
            <Spinner classes={clsx("w-5 h-5 border-isWhite")} />
          )}

          {status === "NONE" && "Register"}
          {status === "NONE" && (
            <ChevronForwardCircleFill
              classes={clsx("w-6 h-6 ml-[0.1rem] fill-isWhite shrink-0")}
            />
          )}

          {status === "REDIRECTING" && "Redirecting..."}
        </button>
      </div>
    </form>
  );
};

export const RegistrationForm = () => {
  <Suspense fallback={<div>Loading...</div>}>
    <RegistrationFormPage />
  </Suspense>
};
