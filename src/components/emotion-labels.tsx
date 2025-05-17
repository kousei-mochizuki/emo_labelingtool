"use client"

import { useState, useEffect } from "react"
import styles from "./emotion-labels.module.css"

interface EmotionLabelsProps {
  onEmotionRecord: (emotions: Record<string, number>) => void
  isPlaying: boolean
}

export default function EmotionLabels({ onEmotionRecord, isPlaying }: EmotionLabelsProps) {
  const emotions = [
    { id: "joy", label: "Joy（喜び）", key: "1" },
    { id: "trust", label: "Trust（信頼）", key: "2" },
    { id: "fear", label: "Fear（恐れ）", key: "3" },
    { id: "surprise", label: "Surprise（驚き）", key: "4" },
    { id: "sadness", label: "Sadness（悲しみ）", key: "5" },
    { id: "disgust", label: "Disgust（嫌悪）", key: "6" },
    { id: "anger", label: "Anger（怒り）", key: "7" },
    { id: "anticipation", label: "Anticipation（期待）", key: "8" },
  ]

  const [activeEmotions, setActiveEmotions] = useState<Record<string, number>>(
    emotions.reduce((acc, emotion) => ({ ...acc, [emotion.id]: 0 }), {}),
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const emotion = emotions.find((e) => e.key === key)

      if (emotion && isPlaying) {
        toggleEmotion(emotion.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeEmotions, isPlaying])

  const toggleEmotion = (emotionId: string) => {
    setActiveEmotions((prev) => {
      const newState = {
        ...prev,
        [emotionId]: prev[emotionId] === 1 ? 0 : 1,
      }

      // Record the emotion state
      onEmotionRecord(newState)

      return newState
    })
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
            className={`${styles.emotionButton} ${activeEmotions[emotion.id] === 1 ? styles.active : ""}`}
            onClick={() => toggleEmotion(emotion.id)}
            disabled={!isPlaying}
          >
            <span className={styles.keyHint}>{emotion.key}</span>
            {emotion.label}
          </button>
        ))}
      </div>
    </div>
  )
}
