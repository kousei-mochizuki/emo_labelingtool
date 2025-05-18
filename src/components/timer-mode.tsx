"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import styles from "./timer-mode.module.css"

interface TimerModeProps {
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  currentTime: number
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>
  setDuration: (duration: number) => void
  onOpenMiniTimer: () => void
}

export default function TimerMode({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  setDuration,
  onOpenMiniTimer,
}: TimerModeProps) {
  const [manualDuration, setManualDuration] = useState(3600) // Default 1 hour
  const [hours, setHours] = useState("1")
  const [minutes, setMinutes] = useState("0")
  const [seconds, setSeconds] = useState("0")
  const [customDuration, setCustomDuration] = useState(false)
  const timerRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)

  // Initialize hours, minutes, seconds from manualDuration
  useEffect(() => {
    if (!customDuration) {
      const h = Math.floor(manualDuration / 3600)
      const m = Math.floor((manualDuration % 3600) / 60)
      const s = Math.floor(manualDuration % 60)
      setHours(h.toString())
      setMinutes(m.toString())
      setSeconds(s.toString())
    }
  }, [manualDuration, customDuration])

  useEffect(() => {
    // Set the duration when component mounts
    setDuration(manualDuration)
  }, [manualDuration, setDuration])

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
          if (newTime >= manualDuration) {
            stopTimer()
            return manualDuration
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
  }, [isPlaying, manualDuration, setCurrentTime])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const stopTimer = () => {
    setIsPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    setCurrentTime(0)
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDuration = Number.parseInt(e.target.value, 10)
    setManualDuration(newDuration)
    setDuration(newDuration)
    setCustomDuration(false)
  }

  const applyCustomDuration = () => {
    const h = Number.parseInt(hours) || 0
    const m = Number.parseInt(minutes) || 0
    const s = Number.parseInt(seconds) || 0
    const newDuration = h * 3600 + m * 60 + s

    if (newDuration > 0) {
      setManualDuration(newDuration)
      setDuration(newDuration)
    } else {
      // Reset to 1 minute if invalid
      setManualDuration(60)
      setDuration(60)
      setHours("0")
      setMinutes("1")
      setSeconds("0")
    }
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
  }

  return (
    <div className={styles.container}>
      <div className={styles.timerDisplay}>
        <span className={styles.currentTime}>{formatTime(currentTime)}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalTime}>{formatTime(manualDuration)}</span>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.controlButton} ${isPlaying ? styles.pause : styles.play}`}
          onClick={togglePlayPause}
        >
          {isPlaying ? "一時停止" : "開始"}
        </button>

        <button className={`${styles.controlButton} ${styles.reset}`} onClick={resetTimer}>
          リセット
        </button>

        <button className={`${styles.controlButton} ${styles.miniTimer}`} onClick={onOpenMiniTimer}>
          ミニタイマー
        </button>
      </div>

      <div className={styles.seekBarContainer}>
        <input
          type="range"
          min={0}
          max={manualDuration}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className={styles.seekBar}
        />
      </div>

      <div className={styles.durationSetting}>
        <div className={styles.presetDuration}>
          <label htmlFor="duration" className={styles.durationLabel}>
            プリセット:
          </label>
          <select
            id="duration"
            value={customDuration ? "custom" : manualDuration.toString()}
            onChange={handleDurationChange}
            className={styles.durationSelect}
          >
            <option value="300">5分</option>
            <option value="600">10分</option>
            <option value="1800">30分</option>
            <option value="3600">1時間</option>
            <option value="7200">2時間</option>
            <option value="10800">3時間</option>
            <option value="custom">カスタム...</option>
          </select>
        </div>

        <div className={styles.customDuration}>
          <label className={styles.durationLabel}>カスタム時間:</label>
          <div className={styles.timeInputs}>
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value)
                setCustomDuration(true)
              }}
              onBlur={applyCustomDuration}
              className={styles.timeInput}
            />
            <span className={styles.timeUnit}>時間</span>

            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => {
                setMinutes(e.target.value)
                setCustomDuration(true)
              }}
              onBlur={applyCustomDuration}
              className={styles.timeInput}
            />
            <span className={styles.timeUnit}>分</span>

            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => {
                setSeconds(e.target.value)
                setCustomDuration(true)
              }}
              onBlur={applyCustomDuration}
              className={styles.timeInput}
            />
            <span className={styles.timeUnit}>秒</span>

            <button className={styles.applyButton} onClick={applyCustomDuration}>
              適用
            </button>
          </div>
        </div>
      </div>

      <div className={styles.instructions}>
        <p>
          別ウィンドウで再生中の動画に合わせて、タイマーを開始してください。 キーボードの1-8キーで感情を記録できます。
        </p>
      </div>
    </div>
  )
}
