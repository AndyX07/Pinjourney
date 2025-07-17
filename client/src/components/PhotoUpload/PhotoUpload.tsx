import type React from "react"
import { useState, useRef } from "react"
import Button from "../Button/Button"
import { Upload, X, Camera, ImageIcon } from "lucide-react"
import styles from "./PhotoUpload.module.css"

interface PhotoUploadProps {
  photos: File[]
  onPhotosChange: (photos: File[]) => void
  existingPhotos: { id: number; image_url: string }[]
  onDeleteExistingPhoto: (photoId: number) => void
  maxPhotos?: number
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onPhotosChange,
  existingPhotos,
  onDeleteExistingPhoto,
  maxPhotos = 10,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter((file) => {
      // Only allow image files
      return file.type.startsWith("image/")
    })

    const updatedPhotos = [...photos, ...newFiles].slice(0, maxPhotos)
    onPhotosChange(updatedPhotos)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(updatedPhotos)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.container}>
      {/* Upload Area */}
      <div
        className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className={styles.hiddenInput}
        />

        <div className={styles.uploadContent}>
          <div className={styles.uploadIcon}>
            <Upload className={styles.icon} />
          </div>

          <div className={styles.uploadText}>
            <p className={styles.uploadTitle}>Drop photos here or click to upload</p>
            <p className={styles.uploadSubtitle}>PNG, JPG, GIF (max {maxPhotos} photos)</p>
          </div>

          <Button type="button" variant="outline" onClick={openFileDialog}>
            <Camera className={styles.buttonIcon} />
            Choose Photos
          </Button>
        </div>
      </div>

      {/* Existing Photos Preview */}
      {existingPhotos.length > 0 && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h4 className={styles.previewTitle}>Existing Photos</h4>
          </div>

          <div className={styles.previewGrid}>
            {existingPhotos.map((photo) => (
              <div key={photo.id} className={styles.previewItem}>
                <div className={styles.previewImageContainer}>
                  <img
                    src={photo.image_url}
                    alt="Existing"
                    className={styles.previewImage}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onDeleteExistingPhoto(photo.id)}
                >
                  <X className={styles.removeIcon} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Photos Preview */}
      {photos.length > 0 && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h4 className={styles.previewTitle}>
              <ImageIcon className={styles.titleIcon} />
              Uploaded Photos ({photos.length}/{maxPhotos})
            </h4>
          </div>

          <div className={styles.previewGrid}>
            {photos.map((photo, index) => (
              <div key={index} className={styles.previewItem}>
                <div className={styles.previewImageContainer}>
                  <img
                    src={URL.createObjectURL(photo) || "/placeholder.png"}
                    alt={`Upload ${index + 1}`}
                    className={styles.previewImage}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removePhoto(index)}
                >
                  <X className={styles.removeIcon} />
                </button>
                <div className={styles.fileSize}>
                  {(photo.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length >= maxPhotos && (
        <p className={styles.maxPhotosMessage}>
          Maximum number of photos reached ({maxPhotos})
        </p>
      )}
    </div>
  )
}

export default PhotoUpload
