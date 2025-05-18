"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./video-player.module.css"

interface VideoPlayerProps {
  source: string
  type: "local" | "embed"
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
}

export default function VideoPlayer({
  source,
  type,
  isPlaying,
  setIsPlaying,
  setCurrentTime,
  setDuration,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPipSupported, setIsPipSupported] = useState(false)
  const [isPipActive, setIsPipActive] = useState(false)

  // Check if PiP is supported
  useEffect(() => {
    if (typeof document !== "undefined") {
      // @ts-ignore - TypeScript doesn't know about this API yet
      setIsPipSupported(document.pictureInPictureEnabled && !!HTMLVideoElement.prototype.requestPictureInPicture)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault()
        togglePlayPause()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying])

  useEffect(() => {
    if (type === "local" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, type])

  const togglePlayPause = () => {
    if (type === "local" && videoRef.current) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      // Reset to beginning
      videoRef.current.currentTime = 0
    }
  }

  const handleVideoClick = () => {
    togglePlayPause()
  }

  const setVideoTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Expose the setVideoTime method to the window object so we can call it from outside
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).setVideoTime = setVideoTime
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).setVideoTime
      }
    }
  }, [])

  // Handle Picture-in-Picture
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (error) {
      console.error("Picture-in-Picture failed:", error)
    }
  }

  // Set up PiP event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnterPiP = () => {
      setIsPipActive(true)
    }

    const handleExitPiP = () => {
      setIsPipActive(false)
    }

    video.addEventListener("enterpictureinpicture", handleEnterPiP)
    video.addEventListener("leavepictureinpicture", handleExitPiP)

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP)
      video.removeEventListener("leavepictureinpicture", handleExitPiP)
    }
  }, [videoRef.current])

  if (!source) {
    return (
      <div className={styles.placeholder}>
        <p>動画ファイルを選択するか、埋め込みURLを入力してください</p>
      </div>
    )
  }

  return (
    <div className={styles.videoContainer}>
      {type === "local" ? (
        <video
          ref={videoRef}
          className={styles.video}
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
        >
          <source src={source} type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      ) : (
        <iframe ref={iframeRef} className={styles.iframe} src={source} allowFullScreen title="Embedded video"></iframe>
      )}

      {type === "local" && (
        <div className={styles.controls}>
          <button className={styles.playPauseButton} onClick={togglePlayPause}>
            {isPlaying ? "一時停止" : "再生"}
          </button>

          {videoRef.current && (
            <input
              type="range"
              className={styles.seekBar}
              min={0}
              max={videoRef.current.duration || 100}
              step={0.1}
              value={videoRef.current.currentTime || 0}
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Number(e.target.value)
                }
              }}
            />
          )}

          {isPipSupported && (
            <button
              className={`${styles.pipButton} ${isPipActive ? styles.active : ""}`}
              onClick={togglePictureInPicture}
              title="ピクチャインピクチャモード"
            >
              PiP
            </button>
          )}
        </div>
      )}
    </div>
  )
}
