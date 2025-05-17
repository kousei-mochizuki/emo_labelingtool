"use client"

import { useState } from "react"
import styles from "./data-display.module.css"

interface EmotionDataItem {
  time: number
  timeFormatted: string
  emotions: Record<string, number>
}

interface DialogueDataItem {
  time: number
  timeFormatted: string
  character: string
  text: string
  type: "dialogue" | "action"
}

interface DataDisplayProps {
  emotionData: EmotionDataItem[]
  dialogueData: DialogueDataItem[]
}

export default function DataDisplay({ emotionData, dialogueData }: DataDisplayProps) {
  const [activeTab, setActiveTab] = useState<"emotions" | "dialogue">("emotions")

  const getEmotionNames = (emotions: Record<string, number>): string => {
    return Object.entries(emotions)
      .filter(([_, value]) => value === 1)
      .map(([key, _]) => key)
      .join(", ")
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "emotions" ? styles.active : ""}`}
          onClick={() => setActiveTab("emotions")}
        >
          感情データ ({emotionData.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "dialogue" ? styles.active : ""}`}
          onClick={() => setActiveTab("dialogue")}
        >
          セリフ／ト書きデータ ({dialogueData.length})
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "emotions" ? (
          emotionData.length > 0 ? (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>時間</th>
                  <th>感情</th>
                </tr>
              </thead>
              <tbody>
                {emotionData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.timeFormatted}</td>
                    <td>{getEmotionNames(item.emotions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.emptyMessage}>記録された感情データはありません</p>
          )
        ) : dialogueData.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>時間</th>
                <th>キャラクター</th>
                <th>テキスト</th>
                <th>タイプ</th>
              </tr>
            </thead>
            <tbody>
              {dialogueData.map((item, index) => (
                <tr key={index}>
                  <td>{item.timeFormatted}</td>
                  <td>{item.character}</td>
                  <td>{item.text}</td>
                  <td>{item.type === "dialogue" ? "セリフ" : "ト書き"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.emptyMessage}>記録されたセリフ／ト書きデータはありません</p>
        )}
      </div>
    </div>
  )
}
