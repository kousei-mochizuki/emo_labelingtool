"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import styles from "./mini-timer.module.css"

interface MiniTimerProps {
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  currentTime: number
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>
  duration: number
  emotions: Array<{
    id: string
    label: string
    key: string
    color: string
  }>
  onEmotionRecord: (emotionId: string) => void
  onClose: () => void
}

export default function MiniTimer({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  emotions,
  onEmotionRecord,
  onClose,
}: MiniTimerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [expanded, setExpanded] = useState(false)
  const timerRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      // Start the timer
      lastTickRef.current = Date.now()
      timerRef.current = window.setInterval(() => {
        const now = Date.now()
        const delta = (now - lastTickRef.current) / 1000 // Convert to seconds
        lastTickRef.current = now

        setCurrentTime((prevTime) => {
          const newTime = prevTime + delta
          // If we reach the end of the duration, stop the timer
          if (newTime >= duration) {
            stopTimer()
            return duration
          }
          return newTime
        })
      }, 50) // Update approximately every 50ms for smooth display
    } else if (timerRef.current) {
      // Stop the timer
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, duration, setCurrentTime])

  const stopTimer = () => {
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`
    }
  }

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current && e.target === containerRef.current) {
      setIsDragging(true)
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Keyboard shortcuts for emotions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const emotion = emotions.find((e) => e.key === key)

      if (emotion && isPlaying) {
        onEmotionRecord(emotion.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, emotions, onEmotionRecord])

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${expanded ? styles.expanded : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.header}>
        <div className={styles.dragHandle} />
        <button className={styles.expandButton} onClick={() => setExpanded(!expanded)}>
          {expanded ? "▲" : "▼"}
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.timerDisplay}>
        <span className={styles.currentTime}>{formatTime(currentTime)}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalTime}>{formatTime(duration)}</span>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.controlButton} ${isPlaying ? styles.pause : styles.play}`}
          onClick={togglePlayPause}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div>

      {expanded && (
        <div className={styles.emotionButtons}>
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              className={styles.emotionButton}
              onClick={() => isPlaying && onEmotionRecord(emotion.id)}
              disabled={!isPlaying}
              style={{ backgroundColor: emotion.color }}
              title={emotion.label}
            >
              {emotion.key}
            </button>
          ))}
        </div>
      )}

      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${(currentTime / duration) * 100}%` }} />
      </div>
    </div>
  )
}
