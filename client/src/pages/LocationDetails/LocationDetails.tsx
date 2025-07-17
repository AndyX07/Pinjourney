import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery"
import Map from "../../components/Map/Map"
import { ArrowLeft, Calendar, Camera, Edit, Trash2 } from "lucide-react"
import styles from "./LocationDetails.module.css"

// Mock data for demonstration
/*
const locationData = {
  id: 1,
  name: "Paris",
  country: "France",
  lat: 48.8566,
  lng: 2.3522,
  visitDate: "2024-06-15",
  notes:
    "Amazing city with incredible architecture. Visited the Eiffel Tower, Louvre Museum, and enjoyed wonderful French cuisine.",
  photos: [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ],
}
*/

const LocationDetails: React.FC = () => {

    const navigate = useNavigate();
    const id = useParams().id;
    const locationId = useParams().locationId;

    type Photo = {
        image_url: string;
    }

    type Location = {
        id: number;
        name: string;
        country: string;
        latitude: number;
        longitude: number;
        visited_on: string;
        notes: string;
        photos: Photo[]
    }

    const [locationData, setLocationData] = useState<Location | null>(null);

    const [photoGalleryOpen, setPhotoGalleryOpen] = useState({
        isOpen: false,
        startIndex: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/locations/${locationId}/`);
                setLocationData(response.data);
            }
            catch (error) {
                console.log("Get location failed");
            }
        }
        fetchData();
    }, [locationId])

    if (!locationData) {
        return (<></>)
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/locations/${locationData.id}/`);
            navigate(`/trips/${id}`)
        }
        catch (error) {
            console.log("Location deletion failed")
        }
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => navigate(`/trips/${id}`)}>
                        <ArrowLeft className={styles.backIcon} />
                    </button>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.title}>{locationData.name}</h1>
                        <div className={styles.meta}>
                            <div className={styles.countryBadge}>{locationData.country}</div>
                            <span className={styles.metaItem}>
                                <Calendar className={styles.metaIcon} />
                                {new Date(locationData.visited_on).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="outline" onClick={() => navigate(`/trips/${id}/locations/${locationId}/edit`)}>
                        <Edit className={styles.buttonIcon} />
                        Edit Location
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete()}>
                        <Trash2 className={styles.buttonIcon} />
                        Delete
                    </Button>
                </div>
            </header>

            <main className={styles.content}>
                <section className={styles.leftColumn}>
                    <Card>
                        <header className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Location Map</h3>
                            <p className={styles.cardDescription}>
                                Coordinates: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                            </p>
                        </header>
                        <div className={styles.cardContent} style={{ height: "400px" }}>
                            <Map locations={[{ longitude: locationData.longitude, latitude: locationData.latitude, name: locationData.name }]} zoom={5} />
                        </div>
                    </Card>

                    {/* Notes */}
                    {locationData.notes && (
                        <Card>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Notes</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <p className={styles.notes}>{locationData.notes}</p>
                            </div>
                        </Card>
                    )}
                </section>

                {/* Right Column - Photos */}
                <section className={styles.rightColumn}>
                    <Card>
                        <header className={styles.cardHeader}>
                            <div className={styles.photosHeader}>
                                <h3 className={styles.cardTitle}>Photos</h3>
                                <div className={styles.photoBadge}>
                                    <Camera className={styles.badgeIcon} />
                                    {locationData.photos.length}
                                </div>
                            </div>
                        </header>
                        <div className={styles.cardContent}>
                            <div className={styles.photosGrid}>
                                {locationData.photos.map((photo, index) => (
                                    <div
                                        key={index}
                                        className={styles.photoContainer}
                                        onClick={() => setPhotoGalleryOpen({ isOpen: true, startIndex: index })}
                                    >
                                        <img
                                            src={photo.image_url || "/placeholder.png"}
                                            alt={`${locationData.name} photo ${index + 1}`}
                                            className={styles.photo}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className={styles.viewAllButton}
                                onClick={() => setPhotoGalleryOpen({ isOpen: true, startIndex: 0 })}
                            >
                                <Camera className={styles.buttonIcon} />
                                View All Photos
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Additional Information</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Visit Date:</span>
                                    <span>{new Date(locationData.visited_on).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Country:</span>
                                    <span>{locationData.country}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Coordinates:</span>
                                    <span>
                                        {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Photos:</span>
                                    <span>{locationData.photos.length}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

            <PhotoGallery
                isOpen={photoGalleryOpen.isOpen}
                photos={locationData.photos.map((photo) => photo.image_url)}
                startIndex={photoGalleryOpen.startIndex}
                locationName={locationData.name}
                onClose={() => setPhotoGalleryOpen({ isOpen: false, startIndex: 0 })}
            />
        </div>
    )
}

export default LocationDetails
