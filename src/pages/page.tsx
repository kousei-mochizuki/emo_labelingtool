import { useState, useEffect, useRef } from "react"
import VideoPlayer from "../components/video-player"
import EmotionLabels from "../components/emotion-labels"
import EmotionTimeline from "../components/emotion-timeline"
import EmotionDataEditor from "../components/emotion-data-editor"
import ScreenCapture from "../components/screen-capture"
import TimerMode from "../components/timer-mode"
import MiniTimer from "../components/mini-timer"
import styles from "./page.module.css"

export default function EmotionLabelingTool() {
  const [videoSource, setVideoSource] = useState<string>("")
  const [videoType, setVideoType] = useState<"local" | "embed" | "capture" | "timer">("timer") // Default to timer mode
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(3600) // Default 1 hour for timer mode
  const [emotionData, setEmotionData] = useState<
    Array<{
      id: string
      time: number
      timeFormatted: string
      emotionId: string
    }>
  >([])
  const [capturedStream, setCapturedStream] = useState<MediaStream | null>(null)
  const capturedVideoRef = useRef<HTMLVideoElement | null>(null)
  const [showScreenCapture, setShowScreenCapture] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [showMiniTimer, setShowMiniTimer] = useState(false)

  // Define emotions with their colors
  const emotions = [
    { id: "joy", label: "Joy（喜び）", key: "1", color: "#FFD700" },
    { id: "trust", label: "Trust（信頼）", key: "2", color: "#90EE90" },
    { id: "fear", label: "Fear（恐れ）", key: "3", color: "#800080" },
    { id: "surprise", label: "Surprise（驚き）", key: "4", color: "#FF69B4" },
    { id: "sadness", label: "Sadness（悲しみ）", key: "5", color: "#1E90FF" },
    { id: "disgust", label: "Disgust（嫌悪）", key: "6", color: "#32CD32" },
    { id: "anger", label: "Anger（怒り）", key: "7", color: "#FF0000" },
    { id: "anticipation", label: "Anticipation（期待）", key: "8", color: "#FFA500" },
  ]

  // Add global keyboard event listener for PiP mode
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Check if a key 1-8 was pressed
      const key = event.key
      const emotion = emotions.find((e) => e.key === key)

      if (emotion && isPlaying && !showMiniTimer) {
        // Record emotion even in PiP mode (but not when mini timer is active)
        handleEmotionRecord(emotion.id)
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown)
    }
  }, [isPlaying, emotions, showMiniTimer])

  // Handle captured video stream
  useEffect(() => {
    if (capturedStream && capturedVideoRef.current) {
      capturedVideoRef.current.srcObject = capturedStream

      // Set up time update handler for captured video
      const handleTimeUpdate = () => {
        if (capturedVideoRef.current) {
          setCurrentTime(capturedVideoRef.current.currentTime)
        }
      }

      const handleDurationChange = () => {
        if (capturedVideoRef.current) {
          setDuration(capturedVideoRef.current.duration || 0)
        }
      }

      capturedVideoRef.current.addEventListener("timeupdate", handleTimeUpdate)
      capturedVideoRef.current.addEventListener("durationchange", handleDurationChange)

      return () => {
        if (capturedVideoRef.current) {
          capturedVideoRef.current.removeEventListener("timeupdate", handleTimeUpdate)
          capturedVideoRef.current.removeEventListener("durationchange", handleDurationChange)
        }
      }
    }
  }, [capturedStream])

  // Clean up captured stream when component unmounts
  useEffect(() => {
    return () => {
      if (capturedStream) {
        capturedStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [capturedStream])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSource(url)
      setVideoType("local")
      setCapturedStream(null)
    }
  }

  const handleEmbedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoSource(event.target.value)
    setVideoType("embed")
    setCapturedStream(null)
  }

  const handleScreenCaptured = (stream: MediaStream) => {
    setCapturedStream(stream)
    setVideoType("capture")
    setVideoSource("")
    setShowScreenCapture(false) // Hide screen capture UI after successful capture
  }

  const handleEmotionRecord = (emotionId: string) => {
    if (isPlaying) {
      const timeFormatted = formatTime(currentTime)
      const newEmotionEntry = {
        id: generateId(),
        time: currentTime,
        timeFormatted,
        emotionId,
      }
      setEmotionData((prev) => [...prev, newEmotionEntry])
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const handleSeek = (time: number) => {
    if (videoType === "local" && typeof window !== "undefined" && (window as any).setVideoTime) {
      ;(window as any).setVideoTime(time)
    } else if (videoType === "capture" && capturedVideoRef.current) {
      capturedVideoRef.current.currentTime = time
    } else if (videoType === "timer") {
      setCurrentTime(time)
    }
  }

  const handleDeleteEmotion = (id: string) => {
    setEmotionData((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUpdateEmotionTime = (id: string, newTime: number) => {
    setEmotionData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, time: newTime, timeFormatted: formatTime(newTime) } : item)),
    )
  }

  const handleUpdateEmotionType = (id: string, newEmotionId: string) => {
    setEmotionData((prev) => prev.map((item) => (item.id === id ? { ...item, emotionId: newEmotionId } : item)))
  }

  const toggleCapturedVideoPlayback = () => {
    if (capturedVideoRef.current) {
      if (isPlaying) {
        capturedVideoRef.current.pause()
      } else {
        capturedVideoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const exportData = () => {
    // Headers for emotions CSV
    const header = "time,time_formatted,emotion"

    // Convert emotion data to CSV rows
    const rows = emotionData.map((entry) => {
      const emotion = emotions.find((e) => e.id === entry.emotionId)
      const emotionName = emotion ? emotion.label.split("（")[0] : entry.emotionId
      return `${entry.time},${entry.timeFormatted},"${emotionName}"`
    })

    // Create CSV content
    const csv = [header, ...rows].join("\n")

    // Create Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "emotion-data.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleOpenMiniTimer = () => {
    setShowMiniTimer(true)
  }

  const handleCloseMiniTimer = () => {
    setShowMiniTimer(false)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>感情ラベリングツール</h1>

      <div className={styles.compactControls}>
        <div className={styles.fileInputs}>
          <div className={styles.inputGroup}>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="videoFile" className={styles.fileLabel}>
              動画ファイルを選択
            </label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="embedUrl"
              placeholder="YouTube埋め込みURLを入力"
              onChange={handleEmbedChange}
              className={styles.textInput}
            />
          </div>

          <button className={styles.captureButton} onClick={() => setShowScreenCapture(!showScreenCapture)}>
            {showScreenCapture ? "画面キャプチャを隠す" : "画面キャプチャを表示"}
          </button>

          <button
            className={`${styles.modeButton} ${videoType === "timer" ? styles.active : ""}`}
            onClick={() => setVideoType("timer")}
          >
            タイマーモード
          </button>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={exportData} className={styles.exportButton}>
            CSVエクスポート
          </button>
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`${styles.editorToggle} ${showEditor ? styles.active : ""}`}
          >
            {showEditor ? "編集パネルを閉じる" : "編集パネルを開く"}
          </button>
        </div>
      </div>

      {/* Screen Capture Component (Collapsible) */}
      {showScreenCapture && <ScreenCapture onVideoSelected={handleScreenCaptured} />}

      <div className={styles.mainContent}>
        <div className={styles.videoSection}>
          {videoType === "timer" ? (
            <TimerMode
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              setDuration={setDuration}
              onOpenMiniTimer={handleOpenMiniTimer}
            />
          ) : videoType === "capture" ? (
            <div className={styles.capturedVideoContainer}>
              <video
                ref={capturedVideoRef}
                className={styles.capturedVideo}
                autoPlay
                controls
                onClick={toggleCapturedVideoPlayback}
              />
              <div className={styles.captureOverlay}>
                <p>画面キャプチャモード</p>
                <button onClick={toggleCapturedVideoPlayback} className={styles.capturePlayButton}>
                  {isPlaying ? "一時停止" : "再生"}
                </button>
              </div>
            </div>
          ) : (
            <VideoPlayer
              source={videoSource}
              type={videoType}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setCurrentTime={setCurrentTime}
              setDuration={setDuration}
            />
          )}

          {videoType !== "timer" && (
            <div className={styles.timeInfo}>
              <span>現在: {formatTime(currentTime)}</span>
              <span>長さ: {formatTime(duration)}</span>
            </div>
          )}

          <EmotionTimeline
            emotionData={emotionData}
            duration={duration}
            currentTime={currentTime}
            emotions={emotions}
            onSeek={handleSeek}
          />
        </div>

        <div className={styles.controlsSection}>
          <EmotionLabels emotions={emotions} onEmotionRecord={handleEmotionRecord} isPlaying={isPlaying} />
        </div>
      </div>

      {/* Collapsible Editor Section */}
      {showEditor && (
        <div className={styles.editorSection}>
          <EmotionDataEditor
            emotionData={emotionData}
            emotions={emotions}
            onDelete={handleDeleteEmotion}
            onUpdateTime={handleUpdateEmotionTime}
            onUpdateType={handleUpdateEmotionType}
            duration={duration}
          />
        </div>
      )}

      {/* Mini Timer (Floating) */}
      {showMiniTimer && (
        <MiniTimer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          emotions={emotions}
          onEmotionRecord={handleEmotionRecord}
          onClose={handleCloseMiniTimer}
        />
      )}
    </div>
  )
}
