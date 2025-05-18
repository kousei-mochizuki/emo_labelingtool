"use client"

import { useState } from "react"
import styles from "./emotion-data-editor.module.css"

interface EmotionDataEditorProps {
  emotionData: Array<{
    id: string
    time: number
    timeFormatted: string
    emotionId: string
  }>
  emotions: Array<{
    id: string
    label: string
    key: string
    color: string
  }>
  onDelete: (id: string) => void
  onUpdateTime: (id: string, newTime: number) => void
  onUpdateType: (id: string, newEmotionId: string) => void
  duration: number
}

export default function EmotionDataEditor({
  emotionData,
  emotions,
  onDelete,
  onUpdateTime,
  onUpdateType,
  duration,
}: EmotionDataEditorProps) {
  const [sortBy, setSortBy] = useState<"time" | "emotion">("time")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTime, setEditingTime] = useState<number>(0)
  const [editingEmotionId, setEditingEmotionId] = useState<string>("")

  const sortedData = [...emotionData].sort((a, b) => {
    if (sortBy === "time") {
      return a.time - b.time
    } else {
      // Sort by emotion name
      const emotionA = emotions.find((e) => e.id === a.emotionId)?.label || ""
      const emotionB = emotions.find((e) => e.id === b.emotionId)?.label || ""
      return emotionA.localeCompare(emotionB)
    }
  })

  const filteredData = sortedData.filter((item) => {
    const emotion = emotions.find((e) => e.id === item.emotionId)
    if (!emotion) return false

    const searchLower = searchTerm.toLowerCase()
    return emotion.label.toLowerCase().includes(searchLower) || item.timeFormatted.includes(searchTerm)
  })

  const handleEditClick = (item: {
    id: string
    time: number
    emotionId: string
  }) => {
    setEditingId(item.id)
    setEditingTime(item.time)
    setEditingEmotionId(item.emotionId)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      onUpdateTime(editingId, editingTime)
      onUpdateType(editingId, editingEmotionId)
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const formatTimeForInput = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  }

  const parseTimeInput = (timeStr: string): number => {
    const parts = timeStr.split(/[:.]/)
    if (parts.length < 3) return 0

    const hours = Number.parseInt(parts[0]) || 0
    const minutes = Number.parseInt(parts[1]) || 0
    const seconds = Number.parseInt(parts[2]) || 0
    const milliseconds = parts.length > 3 ? Number.parseInt(parts[3]) || 0 : 0

    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>感情データ編集</h2>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sortContainer}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "time" | "emotion")}
              className={styles.sortSelect}
            >
              <option value="time">時間順</option>
              <option value="emotion">感情順</option>
            </select>
          </div>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>時間</th>
                <th>感情</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const emotion = emotions.find((e) => e.id === item.emotionId)
                const isEditing = editingId === item.id

                return (
                  <tr key={item.id}>
                    <td>
                      {isEditing ? (
                        <div className={styles.editTimeContainer}>
                          <input
                            type="text"
                            value={formatTimeForInput(editingTime)}
                            onChange={(e) => setEditingTime(parseTimeInput(e.target.value))}
                            className={styles.timeInput}
                          />
                          <input
                            type="range"
                            min={0}
                            max={duration}
                            step={0.1}
                            value={editingTime}
                            onChange={(e) => setEditingTime(Number.parseFloat(e.target.value))}
                            className={styles.timeSlider}
                          />
                        </div>
                      ) : (
                        <div
                          className={styles.timeCell}
                          style={{
                            borderLeft: `4px solid ${emotion?.color || "#ccc"}`,
                          }}
                        >
                          {item.timeFormatted}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          value={editingEmotionId}
                          onChange={(e) => setEditingEmotionId(e.target.value)}
                          className={styles.emotionSelect}
                        >
                          {emotions.map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className={styles.emotionCell}>
                          <span
                            className={styles.emotionColor}
                            style={{ backgroundColor: emotion?.color || "#ccc" }}
                          ></span>
                          {emotion?.label || item.emotionId}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className={styles.editButtons}>
                          <button onClick={handleSaveEdit} className={styles.saveButton}>
                            保存
                          </button>
                          <button onClick={handleCancelEdit} className={styles.cancelButton}>
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <div className={styles.actionButtons}>
                          <button onClick={() => handleEditClick(item)} className={styles.editButton}>
                            編集
                          </button>
                          <button onClick={() => onDelete(item.id)} className={styles.deleteButton}>
                            削除
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.emptyMessage}>
          {emotionData.length === 0 ? "記録された感情データはありません" : "検索条件に一致するデータがありません"}
        </p>
      )}

      <div className={styles.summary}>
        <p>合計: {emotionData.length} 件のデータ</p>
      </div>
    </div>
  )
}
