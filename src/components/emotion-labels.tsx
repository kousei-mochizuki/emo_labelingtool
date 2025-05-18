import { useState, useEffect } from "react"
import styles from "./emotion-labels.module.css"

interface EmotionLabelsProps {
  emotions: Array<{
    id: string
    label: string
    key: string
    color: string
  }>
  onEmotionRecord: (emotionId: string) => void
  isPlaying: boolean
}

export default function EmotionLabels({ emotions, onEmotionRecord, isPlaying }: EmotionLabelsProps) {
  const [activeEmotionId, setActiveEmotionId] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const emotion = emotions.find((e) => e.key === key)

      if (emotion && isPlaying) {
        recordEmotion(emotion.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, emotions, onEmotionRecord])

  const recordEmotion = (emotionId: string) => {
    // Record the emotion immediately
    onEmotionRecord(emotionId)

    // Visual feedback
    setActiveEmotionId(emotionId)
    setTimeout(() => {
      setActiveEmotionId(null)
    }, 300)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>感情ラベル</h2>
      <p className={styles.instruction}>
        {isPlaying ? "キーボードの1-8キーまたはボタンをクリックして感情を記録" : "動画を再生して感情を記録"}
      </p>

      <div className={styles.emotionGrid}>
        {emotions.map((emotion) => (
          <button
            key={emotion.id}
            className={`${styles.emotionButton} ${activeEmotionId === emotion.id ? styles.active : ""}`}
            onClick={() => recordEmotion(emotion.id)}
            disabled={!isPlaying}
            style={{
              borderLeft: `5px solid ${emotion.color}`,
            }}
          >
            <span className={styles.keyHint}>{emotion.key}</span>
            {emotion.label}
          </button>
        ))}
      </div>
    </div>
  )
}
