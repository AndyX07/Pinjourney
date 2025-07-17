import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"
import Card from "../../components/Card/Card"
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"
import { ArrowLeft, Calendar, MapPin, Save, Trash2 } from "lucide-react"
import styles from "./EditTrip.module.css"

const EditTrip: React.FC = () => {
  const navigate = useNavigate();
  const id = useParams().id;

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

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}/`);
        const { title, start_date, end_date, description } = response.data;
        setTripData({ title, start_date, end_date, description });
      } catch (error) {
        console.log("Failed to fetch trip");
      }
    }
    fetchTrip();
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/trips/${id}/`, tripData);
      navigate("/trips");
    } catch (error) {
      console.log("Trip update failed");
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/trips/${id}/`);
      navigate("/trips");
    }
    catch (error) {
      console.log("Trip delete failed");
    }
  }

  const handleInputChange = (field: keyof Trip, value: string) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(`/trips/${id}`)}>
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div>
          <h1 className={styles.title}>Edit Trip</h1>
          <p className={styles.subtitle}>Update details of your trip</p>
        </div>
      </header>
      <Card>
        <header className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            <MapPin className={styles.titleIcon} />
            Trip Details
          </h3>
          <p className={styles.cardDescription}>
            Update your trip's title, dates, or description.
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
                value={tripData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="start_date" className={styles.label}>
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
              <label htmlFor="end_date" className={styles.label}>
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
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe your trip..."
                value={tripData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" className={styles.submitButton}>
                <Save className={styles.buttonIcon} />
                Save Changes
              </Button>
              <Button type="button" className={styles.submitButton} onClick={() => handleDelete()}>
                <Trash2 className={styles.buttonIcon} />
                Delete
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/trips")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default EditTrip
