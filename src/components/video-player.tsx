"use client"

import { useEffect, useRef } from "react"
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
        </div>
      )}
    </div>
  )
}
