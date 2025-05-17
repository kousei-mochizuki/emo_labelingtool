import { useState } from "react"
import VideoPlayer from "../components/video-player"
import EmotionLabels from "../components/emotion-labels"
import DataDisplay from "../components/data-display"
import styles from "./page.module.css"

export default function EmotionLabelingTool() {
  const [videoSource, setVideoSource] = useState<string>("")
  const [videoType, setVideoType] = useState<"local" | "embed">("local")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [emotionData, setEmotionData] = useState<
    Array<{
      time: number
      timeFormatted: string
      emotions: Record<string, number>
    }>
  >([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSource(url)
      setVideoType("local")
    }
  }

  const handleEmbedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoSource(event.target.value)
    setVideoType("embed")
  }

  const handleEmotionRecord = (emotions: Record<string, number>) => {
    if (isPlaying && Object.values(emotions).some((value) => value === 1)) {
      const timeFormatted = formatTime(currentTime)
      setEmotionData((prev) => [...prev, { time: currentTime, timeFormatted, emotions }])
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const exportData = () => {
    const data = {
      emotionData,
      duration,
      duration_format6: formatTime(duration),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "emotion-labeling-data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>感情ラベリングツール</h1>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label htmlFor="videoFile" className={styles.label}>
            ローカル動画ファイル:
          </label>
          <input type="file" id="videoFile" accept="video/*" onChange={handleFileChange} className={styles.fileInput} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="embedUrl" className={styles.label}>
            埋め込み動画URL:
          </label>
          <input
            type="text"
            id="embedUrl"
            placeholder="YouTube埋め込みURLを入力"
            onChange={handleEmbedChange}
            className={styles.textInput}
          />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.videoSection}>
          <VideoPlayer
            source={videoSource}
            type={videoType}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            setCurrentTime={setCurrentTime}
            setDuration={setDuration}
          />

          <div className={styles.timeInfo}>
            <p>
              現在時間: {formatTime(currentTime)} ({currentTime.toFixed(6)})
            </p>
            <p>
              動画長: {formatTime(duration)} ({duration.toFixed(6)})
            </p>
          </div>
        </div>

        <div className={styles.controlsSection}>
          <EmotionLabels onEmotionRecord={handleEmotionRecord} isPlaying={isPlaying} />
        </div>
      </div>

      <DataDisplay emotionData={emotionData} />

      <button onClick={exportData} className={styles.exportButton}>
        データをエクスポート
      </button>
    </div>
  )
}
