import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import LocationPickerMap from "../../components/LocationPickerMap/LocationPickerMap"
import PhotoUpload from "../../components/PhotoUpload/PhotoUpload"
import { ArrowLeft, MapPin, Calendar, Camera, Search } from "lucide-react"
import styles from "./AddLocation.module.css"

const AddLocation: React.FC = () => {
    const navigate = useNavigate();
    const id = useParams().id;

    const [locationData, setLocationData] = useState({
        name: "",
        country: "",
        latitude: 0,
        longitude: 0,
        visited_on: "",
        notes: "",
        photos: [] as File[],
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const locationResponse = await api.post("/locations/", {
                trip: id,
                name: locationData.name,
                country: locationData.country,
                longitude: locationData.longitude,
                latitude: locationData.latitude,
                visited_on: locationData.visited_on,
                notes: locationData.notes
            })
            await Promise.all(
                locationData.photos.map((photo) => {
                    const formData = new FormData();
                    formData.append("image", photo);
                    formData.append("location", locationResponse.data.id);
                    return api.post("/photos/", formData);
                })
            )
        }
        catch (error) {
            console.log("Adding location failed");
        }
        navigate(`/trips/${id}`)
    }

    const handleInputChange = (field: string, value: string | number) => {
        setLocationData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleLocationSelect = async (latitude: number, longitude: number) => {
        setLocationData((prev) => ({
            ...prev,
            latitude,
            longitude,
        }))
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            if (data && data.address) {
                setLocationData((prev) => ({
                    ...prev,
                    name: data.name || data.address.city || data.address.town || data.address.village || data.display_name.split(",")[0],
                    country: data.address.country || "",
                }));
            }
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    }

    const handlePhotosChange = (photos: File[]) => {
        setLocationData((prev) => ({
            ...prev,
            photos,
        }))
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data.length > 0) {
                const result = data[0];
                setLocationData((prev) => ({
                    ...prev,
                    name: result.display_name.split(",")[0],
                    country: result.display_name.split(",").pop()?.trim() || "",
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon)
                }))
            }
        }
        catch (error) {
            console.log("Geocoding failed")
        }
        setIsSearching(false)
    }

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(`/trips/${id}`)}>
                    <ArrowLeft className={styles.backIcon} />
                </button>
                <div>
                    <h1 className={styles.title}>Add New Location</h1>
                    <p className={styles.subtitle}>Add a place you visited to your trip</p>
                </div>
            </header>

            <div className={styles.content}>
                <section className={styles.formSection}>
                    <Card>
                        <header className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <Search className={styles.titleIcon} />
                                Search Location
                            </h3>
                            <p className={styles.cardDescription}>Search for a place or drop a pin on the map</p>
                        </header>
                        <div className={styles.cardContent}>
                            <div className={styles.searchContainer}>
                                <Input
                                    placeholder="Search for a city or landmark..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                                <Button onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? "..." : <Search className={styles.buttonIcon} />}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <header className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <MapPin className={styles.titleIcon} />
                                Location Details
                            </h3>
                        </header>
                        <div className={styles.cardContent}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" className={styles.label}>
                                            Location Name *
                                        </label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Eiffel Tower"
                                            value={locationData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="country" className={styles.label}>
                                            Country *
                                        </label>
                                        <Input
                                            id="country"
                                            placeholder="e.g., France"
                                            value={locationData.country}
                                            onChange={(e) => handleInputChange("country", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="visited_on" className={styles.label}>
                                        Visit Date *
                                    </label>
                                    <div className={styles.inputWithIcon}>
                                        <Calendar className={styles.inputIcon} />
                                        <Input
                                            id="visited_on"
                                            type="date"
                                            className={styles.iconInput}
                                            value={locationData.visited_on}
                                            onChange={(e) => handleInputChange("visited_on", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="latitude" className={styles.label}>
                                            Latitude
                                        </label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            placeholder="48.8566"
                                            value={locationData.latitude || ""}
                                            onChange={(e) => handleInputChange("latitude", Number.parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="longitude" className={styles.label}>
                                            Longitude
                                        </label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            placeholder="2.3522"
                                            value={locationData.longitude || ""}
                                            onChange={(e) => handleInputChange("longitude", Number.parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="notes" className={styles.label}>
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        placeholder="Share your thoughts, experiences, or memories from this place..."
                                        rows={4}
                                        value={locationData.notes}
                                        onChange={(e) => handleInputChange("notes", e.target.value)}
                                        className={styles.textarea}
                                    />
                                </div>
                            </form>
                        </div>
                    </Card>

                    <Card>
                        <header className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <Camera className={styles.titleIcon} />
                                Photos
                            </h3>
                            <p className={styles.cardDescription}>Upload photos from this location</p>
                        </header>
                        <div className={styles.cardContent}>
                            <PhotoUpload
                                photos={locationData.photos}
                                onPhotosChange={handlePhotosChange}
                                existingPhotos={[]}
                                onDeleteExistingPhoto={() => { }}
                            />
                        </div>
                    </Card>

                    <div className={styles.formActions}>
                        <Button onClick={handleSubmit} className={styles.submitButton}>
                            <MapPin className={styles.buttonIcon} />
                            Add Location
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate(`/trips/${id}`)}>
                            Cancel
                        </Button>
                    </div>
                </section>

                <section className={styles.mapSection}>
                    <Card>
                        <header className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Location on Map</h3>
                            <p className={styles.cardDescription}>Click on the map to set the exact location</p>
                        </header>
                        <div className={styles.cardContent}>
                            <LocationPickerMap
                                selectedLocation={
                                    locationData.latitude && locationData.longitude
                                        ? { lat: locationData.latitude, lng: locationData.longitude }
                                        : null
                                }
                                onLocationSelect={handleLocationSelect}
                            />
                        </div>
                    </Card>

                    {locationData.latitude && locationData.longitude && (
                        <Card>
                            <header className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>Selected Coordinates</h3>
                            </header>
                            <div className={styles.cardContent}>
                                <div className={styles.coordinatesInfo}>
                                    <p>
                                        <strong>Latitude:</strong> {locationData.latitude.toFixed(6)}
                                    </p>
                                    <p>
                                        <strong>Longitude:</strong> {locationData.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </section>
            </div>
        </main>
    )
}

export default AddLocation
