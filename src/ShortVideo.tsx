import { HTMLProps, useContext, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  ShortVideoContext,
  ShortVideoDispatchContext,
} from "./ShortVideoProvider";
import { CarouselState } from "./CarouselProvider";
import styles from "./shortVideo.module.css";

type ShortVideoProps = {
  index: number;
  video: HTMLProps<HTMLVideoElement>;
  image: HTMLProps<HTMLImageElement>;
};

const ShortVideo = ({
  index,
  video: videoProps,
  image: imgProps,
}: ShortVideoProps) => {
  const [isReady, setIsReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const dispatch = useContext(ShortVideoDispatchContext);
  const { jumpToTime } = useContext(ShortVideoContext);
  const { currentItemIndex } = useContext(CarouselState);
  const { src: videoSrc } = videoProps;

  // bind hls
  useEffect(() => {
    let hls: Hls | null = null;
    const video: HTMLVideoElement | null = ref.current;
    if (video && videoSrc) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          setIsReady(true);
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      }
    }
    // return () => {
    //   if (hls) {
    //     hls.detachMedia();
    //     hls.destroy();
    //   }
    // };
  }, [videoSrc, dispatch]);

  // drag progress bar to update the video progress
  useEffect(() => {
    if (jumpToTime !== null) {
      if (ref.current) {
        const video = ref.current as HTMLVideoElement;
        video.currentTime = jumpToTime;
        dispatch({ type: "RESET_JUMP_TIME" });
      }
    }
  }, [jumpToTime, dispatch]);

  useEffect(() => {
    const video = ref.current as HTMLVideoElement;
    if (currentItemIndex === index) {
      if (isReady) {
        video.play();
        dispatch({ type: "PLAY" });
      }
    } else {
      if (video) {
        dispatch({ type: "PAUSE" });
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [isReady, currentItemIndex, index, dispatch]);

  const handleTimeUpdate = () => {
    const video = ref.current as HTMLVideoElement;
    dispatch({
      type: "RECORD",
      payload: {
        currentTime: video.currentTime,
      },
    });
  };

  const handleDurationChange = () => {
    const video = ref.current as HTMLVideoElement;
    dispatch({
      type: "INIT",
      payload: {
        currentTime: video.currentTime,
        duration: video.duration,
      },
    });
  };

  const toggleVideo = () => {
    const video = ref.current as HTMLVideoElement;
    if (video.paused) {
      dispatch({ type: "PLAY" });
      video.play();
    } else {
      dispatch({ type: "PAUSE" });
      video.pause();
    }
  };

  return (
    <>
      <img
        {...imgProps}
        className={styles.thumbnail}
        style={{ opacity: !isReady || currentItemIndex !== index ? 1 : 0 }}
      />
      <video
        {...videoProps}
        playsInline
        loop
        muted
        ref={ref}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onClick={toggleVideo}
      />
    </>
  );
};

export default ShortVideo;
