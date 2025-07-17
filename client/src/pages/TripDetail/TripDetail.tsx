import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery"
import { ArrowLeft, MapPin, Calendar, Camera, Plus, Edit } from "lucide-react"
import styles from "./TripDetail.module.css"

const TripDetail: React.FC = () => {

    const navigate = useNavigate();

    const id = useParams().id;

    type Photo = {
        image_url: string;
    }

    type Location = {
        id: number;
        name: string;
        country: string;
        latitude: number;
        longitude: number;
        visited_on: string,
        notes: string;
        photos: Photo[];
    }

    type Trip = {
        id: number;
        title: string;
        start_date: string;
        end_date: string;
        description: string;
        locations: Location[]
    }

    const [tripData, setTripData] = useState<Trip | null>(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await api.get(`/trips/${id}/`);
                setTripData(response.data);
            }
            catch (err) {
                console.log("Get trip failed");
            }
        }
        fetchTrip();
    }, [id])

    const [photoGalleryOpen, setPhotoGalleryOpen] = useState({
        isOpen: false,
        startIndex: 0,
        photos: [] as string[],
        locationName: "",
    })

    if (!tripData) {
        return (<></>)
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backButton} onClick={() => navigate("/trips")}>
                        <ArrowLeft className={styles.backIcon} />
                    </button>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.title}>{tripData.title}</h1>
                        <div className={styles.meta}>
                            <span className={styles.metaItem}>
                                <Calendar className={styles.metaIcon} />
                                {new Date(tripData.start_date).toLocaleDateString()}
                            </span>
                            <span className={styles.metaItem}>
                                <MapPin className={styles.metaIcon} />
                                {tripData.locations.length} locations
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <Button variant="outline" onClick={() => navigate(`/trips/${id}/map-view`)}>
                        <MapPin className={styles.buttonIcon} />
                        Map View
                    </Button>
                    <Button variant="outline" onClick={() => navigate(`/trips/${id}/edit`)}>
                        <Edit className={styles.buttonIcon} />
                        Edit Trip
                    </Button>
                    <Button onClick={() => navigate(`/trips/${id}/add-location`)}>
                        <Plus className={styles.buttonIcon} />
                        Add Location
                    </Button>
                </div>
            </header>

            {/* Trip Description */}
            {tripData.description && (
                <Card className={styles.descriptionCard}>
                    <div className={styles.cardContent}>
                        <p className={styles.description}>{tripData.description}</p>
                    </div>
                </Card>
            )}

            {/* Locations Grid */}
            <section className={styles.locationsGrid}>
                {tripData.locations.map((location) => (
                    <Card key={location.id} className={styles.locationCard}>
                        <div className={styles.locationImageContainer}>
                            <img
                                src={location.photos[0]?.image_url || "/placeholder.png"}
                                alt={location.name}
                                className={styles.locationImage}
                                onClick={() =>
                                    setPhotoGalleryOpen({
                                        isOpen: true,
                                        startIndex: 0,
                                        photos: location.photos.map(photo => photo.image_url),
                                        locationName: location.name,
                                    })
                                }
                            />
                            <div className={styles.photoBadge}>
                                <Camera className={styles.badgeIcon} />
                                {location.photos.length}
                            </div>
                        </div>

                        <div className={styles.locationContent}>
                            <div className={styles.locationHeader}>
                                <h3 className={styles.locationName}>{location.name}</h3>
                                <div className={styles.locationCountry}>{location.country}</div>
                            </div>
                            <div className={styles.locationDate}>
                                <Calendar className={styles.dateIcon} />
                                {new Date(location.visited_on).toLocaleDateString()}
                            </div>

                            {location.notes && (
                                <div className={styles.notesSection}>
                                    <h4 className={styles.notesTitle}>Notes</h4>
                                    <p className={styles.notes}>{location.notes}</p>
                                </div>
                            )}

                            {location.photos.length > 1 && (
                                <div className={styles.photosSection}>
                                    <h4 className={styles.photosTitle}>Photos</h4>
                                    <div className={styles.photosGrid}>
                                        {location.photos.slice(1, 4).map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo.image_url || "/placeholder.png"}
                                                alt={`${location.name} photo ${index + 2}`}
                                                className={styles.photoThumbnail}
                                                onClick={() =>
                                                    setPhotoGalleryOpen({
                                                        isOpen: true,
                                                        startIndex: index + 1,
                                                        photos: location.photos.map(photo => photo.image_url),
                                                        locationName: location.name,
                                                    })
                                                }
                                            />
                                        ))}
                                        {location.photos.length > 4 && (
                                            <div
                                                className={styles.morePhotos}
                                                onClick={() =>
                                                    setPhotoGalleryOpen({
                                                        isOpen: true,
                                                        startIndex: 4,
                                                        photos: location.photos.map(photo => photo.image_url),
                                                        locationName: location.name,
                                                    })
                                                }
                                            >
                                                +{location.photos.length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className={styles.coordinates}>
                                <p>
                                    Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                </p>
                            </div>

                            <div className={styles.locationActions}>
                                <Button variant="primary" className={styles.viewButton} onClick={() => navigate(`/trips/${id}/locations/${location.id}`)}>
                                    View Details
                                </Button>
                                <Button variant="outline" className={styles.editButton} onClick={() => navigate(`/trips/${id}/locations/${location.id}/edit`)}>
                                    <Edit className={styles.buttonIcon} />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </section>

            {tripData.locations.length === 0 && (
                <div className={styles.emptyState}>
                    <MapPin className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No locations yet</h3>
                    <p className={styles.emptyDescription}>Add your first location to this trip</p>
                    <Button onClick={() => navigate("/add-trip")}>
                        <Plus className={styles.buttonIcon} />
                        Add Location
                    </Button>
                </div>
            )}

            <PhotoGallery
                isOpen={photoGalleryOpen.isOpen}
                photos={photoGalleryOpen.photos}
                startIndex={photoGalleryOpen.startIndex}
                locationName={photoGalleryOpen.locationName}
                onClose={() =>
                    setPhotoGalleryOpen({
                        isOpen: false,
                        startIndex: 0,
                        photos: [],
                        locationName: "",
                    })
                }
            />
        </div>
    )
}

export default TripDetail
