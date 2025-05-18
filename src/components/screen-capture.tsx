"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./screen-capture.module.css"

interface ScreenCaptureProps {
  onVideoSelected: (videoStream: MediaStream) => void
}

export default function ScreenCapture({ onVideoSelected }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startScreenCapture = async () => {
    try {
      setError(null)

      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })

      streamRef.current = stream

      // Show preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
      }

      setIsCapturing(true)

      // Handle stream ending (user stops sharing)
      stream.getVideoTracks()[0].onended = () => {
        setIsCapturing(false)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }
    } catch (err) {
      console.error("Error capturing screen:", err)
      setError("画面キャプチャの開始に失敗しました。ブラウザの権限を確認してください。")
    }
  }

  const stopScreenCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const useCurrentCapture = () => {
    if (streamRef.current) {
      onVideoSelected(streamRef.current)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>画面キャプチャ</h2>
      <p className={styles.description}>ピクチャインピクチャで再生中の動画を含む画面領域を選択してください。</p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.controls}>
        {!isCapturing ? (
          <button onClick={startScreenCapture} className={styles.captureButton}>
            画面キャプチャを開始
          </button>
        ) : (
          <>
            <button onClick={stopScreenCapture} className={styles.stopButton}>
              キャプチャを停止
            </button>
            <button onClick={useCurrentCapture} className={styles.useButton}>
              このキャプチャを使用
            </button>
          </>
        )}
      </div>

      {isCapturing && (
        <div className={styles.previewContainer}>
          <p className={styles.previewLabel}>プレビュー:</p>
          <video ref={videoPreviewRef} autoPlay muted className={styles.preview} />
          <p className={styles.hint}>ピクチャインピクチャウィンドウが含まれていることを確認してください。</p>
        </div>
      )}
    </div>
  )
}
