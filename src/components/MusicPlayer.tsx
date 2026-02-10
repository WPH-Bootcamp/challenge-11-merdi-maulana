"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaMuteButton,
  MediaDurationDisplay,
} from "media-chrome/react";

import {
  MediaProvider,
  useMediaRef,
  useMediaSelector,
  useMediaDispatch,
  MediaActionTypes,
} from "media-chrome/react/media-store";
import SkipBack from "@/assets/Skip_Back.svg";
import Shuffle from "@/assets/Shuffle.svg";
import SkipForward from "@/assets/Skip_Forward.svg";
import Play from "@/assets/Play.svg";
import Pause from "@/assets/Pause.svg";
import Repeat from "@/assets/Repeat.svg";
import SongImg from "@/assets/song_img.png";
const SongAudio = "/music/never-gonna-give-you-up.mp3";

// Motion variants for album artwork
const artworkVariants = {
  playing: {
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  paused: {
    scale: 0.95,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  loading: {
    scale: 0.9,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Motion variants for container
const containerVariants = {
  playing: {
    backgroundColor: "#1A1A1A",
    boxShadow: "0px 0px 40px 0px rgba(139, 92, 246, 0.3)",
    transition: { duration: 0.3 },
  },
  paused: {
    backgroundColor: "#0F0F0F",
    boxShadow: "0px 0px 0px 0px rgba(139, 92, 246, 0)",
    transition: { duration: 0.3 },
  },
  loading: {
    backgroundColor: "#0F0F0F",
    boxShadow: "0px 0px 0px 0px rgba(139, 92, 246, 0)",
    opacity: 0.6,
    transition: { duration: 0.3 },
  },
};

// Equalizer bar variants
const barVariants = {
  playing: (i: number) => ({
    height: [6, 20, 6],
    opacity: 1,
    transition: {
      height: {
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.1,
      },
    },
  }),
  paused: {
    height: 6,
    opacity: 1,
    transition: { duration: 0.3 },
  },
  loading: {
    height: 10,
    opacity: 0.5,
    transition: { duration: 0.3 },
  },
};

function MusicPlayerInner() {
  const mediaRef = useMediaRef();
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused);
  const mediaLoading = useMediaSelector((state) => state.mediaLoading);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const isPlaying = !mediaPaused;
  const isLoading = isTransitioning || !!mediaLoading;

  // Determine current animation state
  const currentState = isLoading ? "loading" : isPlaying ? "playing" : "paused";

  // Custom play/pause handler with 500ms loading delay
  const handlePlayPause = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      const type = mediaPaused
        ? MediaActionTypes.MEDIA_PLAY_REQUEST
        : MediaActionTypes.MEDIA_PAUSE_REQUEST;
      dispatch({ type });
      setIsTransitioning(false);
    }, 500);
  }, [mediaPaused, dispatch, isTransitioning]);

  return (
    <motion.div
      className="w-125 h-88 flex flex-col rounded-2xl justify-between p-4"
      variants={containerVariants}
      animate={currentState}
      initial="paused"
    >
      <div className="h-36 relative">
        <div className="flex gap-5">
          {/* Album artwork with rotation & scale */}
          <motion.div variants={artworkVariants} animate={currentState}>
            <motion.div
              animate={
                isPlaying && !isLoading ? { rotate: 360 } : { rotate: 0 }
              }
              transition={
                isPlaying && !isLoading
                  ? { duration: 20, ease: "linear", repeat: Infinity }
                  : { duration: 0.3 }
              }
            >
              <Image src={SongImg} alt="Song Image" priority />
            </motion.div>
          </motion.div>
          <div className="flex flex-col justify-center gap-5">
            <h1 className="font-semibold text-lg">Awesome Song Title</h1>
            <p className="text-sm opacity-60">Amazing Artist</p>
          </div>
        </div>
        {/* Equalizer bars */}
        <div>
          <div className="boxContainer flex gap-1 px-36 absolute bottom-0 items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 bg-[#8B5CF6]"
                custom={i}
                variants={barVariants}
                animate={currentState}
                initial="paused"
                style={{ minHeight: 6 }}
              />
            ))}
          </div>
        </div>
      </div>
      <MediaController
        audio
        className={isPlaying ? "bg-[#1A1A1A]" : "bg-[#0F0F0F]"}
      >
        <audio
          ref={mediaRef}
          slot="media"
          src={SongAudio}
          controls={false}
          suppressHydrationWarning
        ></audio>

        <MediaControlBar className="w-full">
          <div className="flex flex-col w-full gap-2">
            <MediaControlBar className="">
              <MediaTimeRange
                className={isPlaying ? "bg-[#1A1A1A]" : "bg-[#0F0F0F]"}
              />
            </MediaControlBar>
            <div className="flex justify-between opacity-60">
              <MediaTimeDisplay />
              <MediaDurationDisplay />
            </div>
            <MediaControlBar className="flex gap-5 w-full items-center justify-center">
              {/* Shuffle button */}
              <motion.button
                className="cursor-pointer"
                whileHover={{ scale: 1.1, filter: "brightness(2)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image src={Shuffle} alt="Shuffle" />
              </motion.button>
              {/* Skip Back button */}
              <motion.button
                className="cursor-pointer"
                whileHover={{ scale: 1.1, filter: "brightness(2)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image src={SkipBack} alt="Skip Back" />
              </motion.button>
              {/* Custom Play/Pause button */}
              <motion.button
                className={`rounded-full cursor-pointer h-14 w-14 flex items-center justify-center ${
                  isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[#7C3AED]"
                }`}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={handlePlayPause}
                disabled={isLoading}
              >
                {isPlaying ? (
                  <Image src={Pause} alt="Pause" />
                ) : (
                  <Image src={Play} alt="Play" />
                )}
              </motion.button>
              {/* Skip Forward button */}
              <motion.button
                className="cursor-pointer"
                whileHover={{ scale: 1.1, filter: "brightness(2)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image src={SkipForward} alt="Skip Forward" />
              </motion.button>
              {/* Repeat button */}
              <motion.button
                className="cursor-pointer"
                whileHover={{ scale: 1.1, filter: "brightness(2)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Image src={Repeat} alt="Repeat" />
              </motion.button>
            </MediaControlBar>
            <div className="flex w-full items-center opacity-60">
              <MediaMuteButton>
                <svg slot="icon" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    id="icon-muted-slash"
                    d="M3 2.69434 20.5607 20.255 19.5 21.3157 1.93934 3.755 3 2.69434Z"
                  ></path>
                  <g id="icon-muted">
                    <path
                      id="icon-muted-speaker-small"
                      d="M8.55 6.13531 12 3.38v6.20484L8.55 6.13531Z"
                    ></path>
                    <path
                      id="icon-muted-speaker-big"
                      d="M1.5 15.7503V8.25969h2.83453L12 15.9252V20.63l-6.11016-4.8797H1.5Z"
                    ></path>
                    <path
                      className="volume-low"
                      d="M16.5 12.005c0-1.1512-.2723-2.24437-.832-3.34078l-.3399-.66844-1.3368.6811.3407.66796c.4496.88176.668 1.75176.668 2.66016-.0003.1838-.0101.3675-.0295.5503l1.2806 1.2806c.1638-.5965.2475-1.2122.2489-1.8309Zm0 0c0-1.1512-.2723-2.24437-.832-3.34078l-.3399-.66844-1.3368.6811.3407.66796c.4496.88176.668 1.75176.668 2.66016-.0003.1838-.0101.3675-.0295.5503l1.2806 1.2806c.1638-.5965.2475-1.2122.2489-1.8309Z"
                    ></path>
                    <path
                      className="volume-medium"
                      d="M17.8978 6.37719C18.8869 8.07266 19.5 9.60547 19.5 12.005c0 1.7072-.3192 2.985-.8672 4.2113l-1.1484-1.149c.3333-.8962.5156-1.8468.5156-3.0623 0-2.07047-.5123-3.35437-1.3978-4.87219l-.3778-.64781 1.2956-.75562.3778.64781Z"
                    ></path>
                    <path
                      className="volume-high"
                      d="M22.5 12.005c0-3.48094-.9464-5.67703-2.3677-7.90359l-.4035-.63235-1.2657.80719.4036.63234C20.1478 6.91344 21 8.88781 21 12.005c0 2.2856-.4406 3.9375-1.1634 5.4164l1.1109 1.1109C22.0388 16.4764 22.5 14.4894 22.5 12.005Zm0 0c0-3.48094-.9464-5.67703-2.3677-7.90359l-.4035-.63235-1.2657.80719M22.5 12.005c0-3.48094-.9464-5.67703-2.3677-7.90359l-.4035-.63235-1.2657.80719.4036.63234C20.1478 6.91344 21 8.88781 21 12.005c0 2.2856-.4406 3.9375-1.1634 5.4164"
                    ></path>
                  </g>
                  <g id="icon-volume">
                    <path
                      className="volume-low"
                      d="m15.3268 7.99094.3411.66793C16.1822 9.66585 16.5 10.7636 16.5 12c0 1.2241-.3314 2.3449-.8299 3.3368l-.3368.6701-1.3402-.6736.3368-.6701C14.7445 13.8382 15 12.9471 15 12c0-.9648-.2447-1.8302-.6679-2.65887l-.3412-.66793 1.3359-.68226Z"
                    ></path>
                    <path
                      className="volume-medium"
                      d="m17.5196 5.72417.3781.64772C18.8818 8.05755 19.5 9.58453 19.5 12c0 2.4191-.6451 3.9614-1.5996 5.6235l-.3735.6504-1.3008-.747.3735-.6504C17.4713 15.3586 18 14.0753 18 12c0-2.0789-.5068-3.34567-1.3977-4.87189l-.3781-.64771 1.2954-.75623Z"
                    ></path>
                    <path
                      className="volume-high"
                      d="m19.7287 3.46428.4035.63219C21.5988 6.39414 22.5 8.61481 22.5 12c0 3.3817-.899 5.6514-2.3718 7.9097l-.4097.6282-1.2564-.8194.4097-.6282C20.2115 17.0361 21 15.0467 21 12c0-3.04324-.7863-4.98789-2.1322-7.09647l-.4035-.6322 1.2644-.80705Z"
                    ></path>
                    <path
                      id="icon-volume-speaker"
                      d="M5.88984 8.25469H1.5v7.49061h4.38984L12 20.625V3.375L5.88984 8.25469Z"
                    ></path>
                  </g>
                </svg>
              </MediaMuteButton>
              <MediaControlBar className="w-full">
                <MediaVolumeRange
                  className={`w-full ${isPlaying ? "bg-[#1A1A1A]" : "bg-[#0F0F0F]"}`}
                />
              </MediaControlBar>
            </div>
          </div>
        </MediaControlBar>
      </MediaController>
    </motion.div>
  );
}

export function MusicPlayer() {
  return (
    <MediaProvider>
      <MusicPlayerInner />
    </MediaProvider>
  );
}
