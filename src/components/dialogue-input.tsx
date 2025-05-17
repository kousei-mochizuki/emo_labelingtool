"use client"

import type React from "react"

import { useState } from "react"
import styles from "./dialogue-input.module.css"

interface DialogueInputProps {
  onDialogueRecord: (character: string, text: string, type: "dialogue" | "action") => void
  isPlaying: boolean
}

export default function DialogueInput({ onDialogueRecord, isPlaying }: DialogueInputProps) {
  const [characters, setCharacters] = useState<string[]>([""])
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [dialogueText, setDialogueText] = useState<string>("")
  const [inputType, setInputType] = useState<"dialogue" | "action">("dialogue")

  const addCharacter = () => {
    setCharacters([...characters, ""])
  }

  const updateCharacter = (index: number, value: string) => {
    const newCharacters = [...characters]
    newCharacters[index] = value
    setCharacters(newCharacters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (dialogueText.trim() && (selectedCharacter.trim() || inputType === "action")) {
      onDialogueRecord(inputType === "dialogue" ? selectedCharacter : "ト書き", dialogueText, inputType)
      setDialogueText("")
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>セリフ／ト書き入力</h2>

      <div className={styles.charactersSection}>
        <h3 className={styles.subtitle}>キャラクター</h3>

        {characters.map((character, index) => (
          <div key={index} className={styles.characterInput}>
            <input
              type="text"
              value={character}
              onChange={(e) => updateCharacter(index, e.target.value)}
              placeholder={`キャラクター ${index + 1}`}
              className={styles.input}
            />
          </div>
        ))}

        <button type="button" onClick={addCharacter} className={styles.addButton}>
          キャラクターを追加
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputTypeToggle}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="inputType"
              checked={inputType === "dialogue"}
              onChange={() => setInputType("dialogue")}
            />
            セリフ
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="inputType"
              checked={inputType === "action"}
              onChange={() => setInputType("action")}
            />
            ト書き
          </label>
        </div>

        {inputType === "dialogue" && (
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className={styles.select}
            required={inputType === "dialogue"}
          >
            <option value="">キャラクターを選択</option>
            {characters
              .filter((char) => char.trim() !== "")
              .map((char, index) => (
                <option key={index} value={char}>
                  {char}
                </option>
              ))}
          </select>
        )}

        <div className={styles.textareaWrapper}>
          <textarea
            value={dialogueText}
            onChange={(e) => setDialogueText(e.target.value)}
            placeholder={inputType === "dialogue" ? "セリフを入力" : "ト書きを入力"}
            className={styles.textarea}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={!isPlaying}>
          {isPlaying ? "記録" : "動画再生中のみ記録可能"}
        </button>
      </form>
    </div>
  )
}
