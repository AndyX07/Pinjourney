import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import PhotoGallery from "../../components/PhotoGallery/PhotoGallery";
import { MapPin, Calendar, Camera, Plus } from "lucide-react";
import styles from "./Trips.module.css";

const TripsPage: React.FC = () => {
  const navigate = useNavigate();

  type Photo = {
    image_url: string;
  };

  type Location = {
    name: string;
    country: string;
    photos: Photo[];
  };

  type Trip = {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
    locations: Location[];
  };

  type FormattedTrip = {
    id: number;
    title: string;
    date: string;
    description: string;
    locations: {
      name: string;
      country: string;
      photos: number;
    }[];
    coverImage: string;
    totalPhotos: number;
  };

  const [trips, setTrips] = useState<FormattedTrip[]>([]);
  const [nextPage, setNextPage] = useState<string | null>("");

  const [photoGalleryOpen, setPhotoGalleryOpen] = useState({
    isOpen: false,
    startIndex: 0,
    photos: [] as string[],
    locationName: "",
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get<{
          results: Trip[];
          count: number;
          next: string | null;
          previous: string | null;
        }>("/trips/");

        const formattedTrips: FormattedTrip[] = response.data.results.map((trip) => ({
          id: trip.id,
          title: trip.title,
          date: trip.start_date,
          description: trip.description,
          locations: trip.locations.map((loc) => ({
            name: loc.name,
            country: loc.country,
            photos: loc.photos?.length || 0,
          })),
          coverImage: trip.locations[0]?.photos?.[0]?.image_url || "/placeholder.png",
          totalPhotos: trip.locations.reduce((sum, loc) => sum + (loc.photos?.length || 0), 0),
        }));

        setTrips(formattedTrips);
        setNextPage(response.data.next);
        //console.log(response.data.results[0].locations[0]?.photos?.[0]?.image_url)
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const loadMoreTrips = async () => {
    if (!nextPage) return;
    try {
      const response = await api.get<{
        results: Trip[];
        count: Number;
        next: string | null;
        prev: string | null;
      }>(nextPage);
      const formattedTrips: FormattedTrip[] = response.data.results.map((trip) => ({
        id: trip.id,
        title: trip.title,
        date: trip.start_date,
        description: trip.description,
        locations: trip.locations.map((loc) => ({
          name: loc.name,
          country: loc.country,
          photos: loc.photos?.length || 0,
        })),
        coverImage: trip.locations[0]?.photos?.[0]?.image_url || "/placeholder.png",
        totalPhotos: trip.locations.reduce((sum, loc) => sum + (loc.photos?.length || 0), 0),
      }));
      setTrips((prevTrips) => [...prevTrips, ...formattedTrips]);
      setNextPage(response.data.next);
    }
    catch (err) {
      console.log("Failed to load more trips.");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Trips</h1>
          <p className={styles.subtitle}>Explore your travel memories</p>
        </div>
        <Button onClick={() => navigate("/add-trip")}>
          <Plus className={styles.buttonIcon} />
          New Trip
        </Button>
      </header>

      <section className={styles.tripsGrid}>
        {trips.map((trip) => (
          <Card key={trip.id} className={styles.tripCard}>
            <div className={styles.tripImageContainer}>
              <img
                src={trip.coverImage || "/placeholder.svg"}
                alt={trip.title}
                className={styles.tripImage}
                onClick={() =>
                  setPhotoGalleryOpen({
                    isOpen: true,
                    startIndex: 0,
                    photos: [trip.coverImage],
                    locationName: trip.title,
                  })
                }
              />
              <div className={styles.photoBadge}>
                <Camera className={styles.badgeIcon} />
                {trip.totalPhotos}
              </div>
            </div>

            <div className={styles.tripContent}>
              <div className={styles.tripHeader}>
                <h3 className={styles.tripTitle}>{trip.title}</h3>
                <div className={styles.tripDate}>
                  <Calendar className={styles.dateIcon} />
                  {new Date(trip.date).toLocaleDateString()}
                </div>
              </div>
              <p className={styles.tripDescription}>{trip.description}</p>

              <div className={styles.locationsSection}>
                <h4 className={styles.locationsTitle}>
                  <MapPin className={styles.locationsIcon} />
                  Locations ({trip.locations.length})
                </h4>
                <div className={styles.locationsList}>
                  {trip.locations.slice(0, 3).map((location, index) => (
                    <div key={index} className={styles.locationItem}>
                      <span className={styles.locationName}>
                        {location.name}, {location.country}
                      </span>
                      <div className={styles.locationPhotos}>{location.photos} photos</div>
                    </div>
                  ))}
                  {trip.locations.length > 3 && (
                    <p className={styles.moreLocations}>+{trip.locations.length - 3} more locations</p>
                  )}
                </div>
              </div>

              <div className={styles.tripActions}>
                <Button variant="primary" className={styles.viewButton} onClick={() => navigate(`/trips/${trip.id}`)}>
                  View Details
                </Button>
                <Button variant="outline" className={styles.mapButton} onClick={() => navigate(`/trips/${trip.id}/map-view`)}>
                  <MapPin className={styles.buttonIcon} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {trips.length === 0 && (
        <div className={styles.emptyState}>
          <MapPin className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No trips yet</h3>
          <p className={styles.emptyDescription}>Start your travel journey by creating your first trip</p>
          <Button onClick={() => navigate("/add-trip")}>
            <Plus className={styles.buttonIcon} />
            Create Your First Trip
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
      {nextPage && (
        <div className={styles.loadMoreContainer}>
          <Button onClick={loadMoreTrips} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default TripsPage;
