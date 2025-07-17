import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Map from "../../components/Map/Map";
import Button from "../../components/Button/Button";
import { ArrowLeft, MapPin, Calendar, Edit, Plus } from "lucide-react";
import styles from './TripMapView.module.css';

const TripMapView: React.FC = () => {
    const id = useParams().id;
    const navigate = useNavigate();
    type location = {
        latitude: number;
        longitude: number;
        name: string;
    }
    type trip = {
        title: string;
        date: string;
        locations: location[];
        start_date: string;
    }
    const [tripData, setTripData] = useState<trip>({
        title: "",
        date: "",
        locations: [],
        start_date: "",
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/trips/${id}/`);
                setTripData(response.data);
            }
            catch (error) {
                console.log("Getting trip data failed");
            }
        }
        fetchData();
    }, [id])
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
                    <Button variant="outline" onClick={() => navigate("/")}>
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
            <section className={styles.mapContainer}>
                {tripData.locations.length > 0 && (
                    <Map locations={tripData.locations} zoom={3} />
                )}
            </section>
        </div>
    )
}

export default TripMapView;