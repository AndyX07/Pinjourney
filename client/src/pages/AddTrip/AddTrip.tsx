import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import { ArrowLeft, Calendar, MapPin, Save } from "lucide-react"
import styles from "./AddTrip.module.css"

const AddTrip: React.FC = () => {

    const navigate = useNavigate();

    type Trip = {
        title: string;
        start_date: string;
        end_date: string;
        description: string;
    }

    const [tripData, setTripData] = useState<Trip>({
        title: "",
        start_date: "",
        end_date: "",
        description: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            api.post("/trips/", tripData);
            navigate("/trips");
        }
        catch (error) {
            console.log("Trip creation failed");
        }
    }

    const handleInputChange = (field: keyof Trip, value: string) => {
        setTripData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <main className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/trips")}>
                    <ArrowLeft className={styles.backIcon} />
                </button>
                <div>
                    <h1 className={styles.title}>Create New Trip</h1>
                    <p className={styles.subtitle}>Start documenting your next adventure</p>
                </div>
            </header>

            {/* Form */}
            <Card>
                <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                        <MapPin className={styles.titleIcon} />
                        Trip Details
                    </h3>
                    <p className={styles.cardDescription}>
                        Provide basic information about your trip. You can add locations later.
                    </p>
                </header>
                <div className={styles.cardContent}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.label}>
                                Trip Title *
                            </label>
                            <Input
                                id="title"
                                placeholder="e.g., European Adventure, Asian Discovery"
                                value={tripData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="date" className={styles.label}>
                                Start Date *
                            </label>
                            <div className={styles.inputWithIcon}>
                                <Calendar className={styles.inputIcon} />
                                <Input
                                    id="start_date"
                                    type="date"
                                    className={styles.iconInput}
                                    value={tripData.start_date}
                                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="date" className={styles.label}>
                                End Date *
                            </label>
                            <div className={styles.inputWithIcon}>
                                <Calendar className={styles.inputIcon} />
                                <Input
                                    id="end_date"
                                    type="date"
                                    className={styles.iconInput}
                                    value={tripData.end_date}
                                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                placeholder="Describe your trip, what you're looking forward to, or any special notes..."
                                rows={4}
                                value={tripData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <Button type="submit" className={styles.submitButton}>
                                <Save className={styles.buttonIcon} />
                                Create Trip
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate("/trips")}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Next Steps */}
            <Card className={styles.nextStepsCard}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>What's Next?</h3>
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.stepsList}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <div>
                                <p className={styles.stepTitle}>Create your trip</p>
                                <p className={styles.stepDescription}>Fill out the form above with your trip details</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <div>
                                <p className={styles.stepTitle}>Add locations</p>
                                <p className={styles.stepDescription}>Add the places you visited or plan to visit</p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <div>
                                <p className={styles.stepTitle}>Upload photos and notes</p>
                                <p className={styles.stepDescription}>Document your memories with photos and personal notes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </main>
    )
}

export default AddTrip