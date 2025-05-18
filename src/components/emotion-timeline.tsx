import { useRef, useState } from "react"
import styles from "./emotion-timeline.module.css"

interface EmotionTimelineProps {
  emotionData: Array<{
    id: string
    time: number
    timeFormatted: string
    emotionId: string
  }>
  duration: number
  currentTime: number
  emotions: Array<{
    id: string
    label: string
    key: string
    color: string
  }>
  onSeek: (time: number) => void
}

export default function EmotionTimeline({
  emotionData,
  duration,
  currentTime,
  emotions,
  onSeek,
}: EmotionTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hoveredEmotion, setHoveredEmotion] = useState<{
    id: string
    time: number
    emotionId: string
    position: { x: number; y: number }
  } | null>(null)

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || duration <= 0) return

    const rect = timelineRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = offsetX / rect.width
    const newTime = percentage * duration

    onSeek(newTime)
  }

  const formatTimeDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`
    }
  }

  // Get current active emotions
  const getCurrentEmotions = (): string => {
    if (emotionData.length === 0) return "なし"

    // Find emotions near the current time (within 0.5 seconds)
    const nearbyEmotions = emotionData
      .filter((data) => Math.abs(data.time - currentTime) < 0.5)
      .map((data) => {
        const emotion = emotions.find((e) => e.id === data.emotionId)
        return emotion ? emotion.label.split("（")[0] : data.emotionId
      })

    return nearbyEmotions.length > 0 ? nearbyEmotions.join(", ") : "なし"
  }

  const handleMarkerMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    emotion: {
      id: string
      time: number
      emotionId: string
    },
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHoveredEmotion({
      ...emotion,
      position: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      },
    })
  }

  const handleMarkerMouseLeave = () => {
    setHoveredEmotion(null)
  }

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineTitle}>タイムライン</div>
        <div className={styles.currentEmotions}>現在の感情: {getCurrentEmotions()}</div>
      </div>

      <div className={styles.timeline} ref={timelineRef} onClick={handleTimelineClick}>
        <div className={styles.timelineBg}></div>

        {/* Emotion markers */}
        {emotionData.map((data) => {
          const emotion = emotions.find((e) => e.id === data.emotionId)
          if (!emotion) return null

          const position = (data.time / duration) * 100

          return (
            <div
              key={data.id}
              className={styles.emotionMarker}
              style={{
                left: `${position}%`,
                backgroundColor: emotion.color,
              }}
              title={`${emotion.label} - ${data.timeFormatted}`}
              onMouseEnter={(e) => handleMarkerMouseEnter(e, data)}
              onMouseLeave={handleMarkerMouseLeave}
            >
              <span className={styles.markerLabel}>{emotion.key}</span>
            </div>
          )
        })}

        {/* Current time indicator */}
        <div className={styles.currentTimeIndicator} style={{ left: `${(currentTime / duration) * 100}%` }}></div>
      </div>

      <div className={styles.timelineTimes}>
        <div className={styles.startTime}>{formatTimeDisplay(0)}</div>
        <div className={styles.endTime}>{formatTimeDisplay(duration)}</div>
      </div>

      {/* Tooltip for hovered emotion */}
      {hoveredEmotion && (
        <div
          className={styles.emotionTooltip}
          style={{
            left: `${hoveredEmotion.position.x}px`,
            top: `${hoveredEmotion.position.y - 40}px`,
          }}
        >
          <div className={styles.tooltipContent}>
            {emotions.find((e) => e.id === hoveredEmotion.emotionId)?.label || hoveredEmotion.emotionId}
            <div className={styles.tooltipTime}>{formatTimeDisplay(hoveredEmotion.time)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
