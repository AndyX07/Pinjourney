import { useState, useEffect } from "react"
import Button from "../Button/Button"
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react"
import styles from "./PhotoGallery.module.css"

interface PhotoGalleryProps {
  isOpen: boolean
  photos: string[]
  startIndex: number
  locationName: string
  onClose: () => void
}

const PhotoGallery = ({ isOpen, photos, startIndex, locationName, onClose }: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (isOpen) setCurrentIndex(startIndex);
  }, [isOpen, startIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
    setIsZoomed(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
    setIsZoomed(false)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(photos[currentIndex]);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${locationName}-photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={styles.title}>{locationName}</h3>
            <p className={styles.subtitle}>
              Photo {currentIndex + 1} of {photos.length}
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="ghost" className={styles.headerButton} onClick={() => setIsZoomed(!isZoomed)}>
              {isZoomed ? <ZoomOut className={styles.buttonIcon} /> : <ZoomIn className={styles.buttonIcon} />}
            </Button>
            <Button variant="ghost" className={styles.headerButton} onClick={handleDownload}>
              <Download className={styles.buttonIcon} />
            </Button>
            <Button variant="ghost" className={styles.headerButton} onClick={onClose}>
              <X className={styles.buttonIcon} />
            </Button>
          </div>
        </div>
      </header>
      {photos.length > 1 && (
        <>
          <Button variant="ghost" className={`${styles.navButton} ${styles.navButtonLeft}`} onClick={goToPrevious}>
            <ChevronLeft className={styles.navIcon} />
          </Button>
          <Button variant="ghost" className={`${styles.navButton} ${styles.navButtonRight}`} onClick={goToNext}>
            <ChevronRight className={styles.navIcon} />
          </Button>
        </>
      )}
      <div className={styles.imageContainer}>
        <img
          src={photos[currentIndex] || "/placeholder.png"}
          alt={`${locationName} photo ${currentIndex + 1}`}
          className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ""}`}
          onClick={() => setIsZoomed(!isZoomed)}
          draggable={false}
        />
      </div>

      {photos.length > 1 && (
        <div className={styles.thumbnailStrip}>
          <div className={styles.thumbnailContainer}>
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ""}`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsZoomed(false)
                }}
              >
                <img
                  src={photo || "/placeholder.png"}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.backdrop} onClick={onClose} />
    </div>
  )
}

export default PhotoGallery;