import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import LocationPickerMap from "../../components/LocationPickerMap/LocationPickerMap";
import PhotoUpload from "../../components/PhotoUpload/PhotoUpload";
import { ArrowLeft, MapPin, Calendar, Camera, Search } from "lucide-react";
import styles from "./EditLocation.module.css";

interface ExistingPhoto {
  id: number;
  image_url: string;
}

interface LocationData {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  visited_on: string;
  notes: string;
  existingPhotos: ExistingPhoto[];
  newPhotos: File[];
}

const EditLocation: React.FC = () => {
  const navigate = useNavigate();
  const { id: tripId, locationId } = useParams<{ id: string; locationId: string }>();

  const [locationData, setLocationData] = useState<LocationData>({
    name: "",
    country: "",
    latitude: 0,
    longitude: 0,
    visited_on: "",
    notes: "",
    existingPhotos: [],
    newPhotos: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId || !locationId) return;

    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/locations/${locationId}/`);
        const loc = res.data;
        setLocationData({
          name: loc.name || "",
          country: loc.country || "",
          latitude: loc.latitude || 0,
          longitude: loc.longitude || 0,
          visited_on: loc.visited_on || "",
          notes: loc.notes || "",
          existingPhotos: loc.photos || [],
          newPhotos: [],
        });
      } catch (err) {
        setError("Failed to load location data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [tripId, locationId]);

  const handleInputChange = (field: keyof LocationData, value: any) => {
    setLocationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = async (latitude: number, longitude: number) => {
    setLocationData((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      if (data && data.address) {
        setLocationData((prev) => ({
          ...prev,
          name:
            data.name ||
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.display_name.split(",")[0],
          country: data.address.country || "",
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handlePhotosChange = (newPhotos: File[]) => {
    setLocationData((prev) => ({
      ...prev,
      newPhotos,
    }));
  };

  const handleDeleteExistingPhoto = async (photoId: number) => {
    try {
      await api.delete(`/photos/${photoId}/`);
      setLocationData((prev) => ({
        ...prev,
        existingPhotos: prev.existingPhotos.filter((p) => p.id !== photoId),
      }));
    } catch (error) {
      console.error("Failed to delete existing photo", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const result = data[0];
        setLocationData((prev) => ({
          ...prev,
          name: result.display_name.split(",")[0],
          country: result.display_name.split(",").pop()?.trim() || "",
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
        }));
      }
    } catch (error) {
      console.error("Geocoding failed");
    }
    setIsSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !locationId) return;

    setLoading(true);
    setError(null);

    try {
      await api.patch(`/locations/${locationId}/`, {
        trip: tripId,
        name: locationData.name,
        country: locationData.country,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        visited_on: locationData.visited_on,
        notes: locationData.notes,
      });

      if (locationData.newPhotos.length > 0) {
        await Promise.all(
          locationData.newPhotos.map((photo) => {
            const formData = new FormData();
            formData.append("image", photo);
            formData.append("location", locationId);
            return api.post("/photos/", formData);
          })
        );
      }

      navigate(`/trips/${tripId}`);
    } catch (err) {
      console.error("Updating location failed", err);
      setError("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/trips/${tripId}`)}
          aria-label="Back to trip"
        >
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div>
          <h1 className={styles.title}>Edit Location</h1>
          <p className={styles.subtitle}>Update details for this location</p>
        </div>
      </header>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <main className={styles.content}>
        {/* Search */}
        <section className={styles.formSection}>
          <Card>
            <header className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>
                <Search className={styles.titleIcon} />
                Search Location
              </h3>
              <p className={styles.cardDescription}>
                Search for a place or drop a pin on the map
              </p>
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

          {/* Location Details Form */}
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
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
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
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
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

          {/* Photo Upload */}
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
                photos={locationData.newPhotos}
                onPhotosChange={handlePhotosChange}
                existingPhotos={locationData.existingPhotos}
                onDeleteExistingPhoto={handleDeleteExistingPhoto}
              />
            </div>
          </Card>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Button
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={loading}
            >
              <MapPin className={styles.buttonIcon} />
              Save Location
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/trips/${tripId}/locations/${locationId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </section>

        {/* Map Section */}
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
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Selected Coordinates</h3>
              </div>
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
      </main>
    </div>
  );
};

export default EditLocation;
