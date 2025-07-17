import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Globe, Camera, BookHeart } from "lucide-react";
import styles from "./Dashboard.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>({});
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  const allMonths = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  const monthlyData = allMonths.map((monthName, i) => {
    const monthKey = Object.keys(stats.tripsByMonth || {}).find((key) => {
      return new Date(key + "-01").getMonth() === i;
    });
    const trips = monthKey ? Number(stats.tripsByMonth[monthKey]) : 0;
    return { month: monthName, trips };
  });

  const currentYear = new Date().getFullYear();
  const past10Years = Array.from({ length: 10 }, (_, i) => (currentYear - 9 + i).toString());

  const yearlyData = past10Years.map((year) => {
    const trips = stats.tripsByYear && stats.tripsByYear[year] ? Number(stats.tripsByYear[year]) : 0;
    return { year, trips };
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/");
        const data = res.data;
        setStats({
          totalTrips: data.total_trips,
          totalLocations: data.total_locations,
          countriesVisited: data.countries_visited,
          daysTravel: data.total_days_traveled,
          favoriteCountry: data.favorite_country,
          tripsByYear: data.trips_by_year,
          tripsByMonth: data.trips_by_month,
        });
        setRecentTrips(data.recent_trips);
      } catch (err) {

      }
    };
    fetchStats();
  }, [navigate]);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Travel Dashboard</h1>
        <p className={styles.subtitle}>Your journey at a glance</p>
      </header>

      {/* Stats Section */}
      <section className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <header className={styles.statHeader}>
            <span className={styles.statLabel}>Total Trips</span>
            <Calendar className={styles.statIcon} />
          </header>
          <p className={styles.statValue}>{stats.totalTrips}</p>
        </Card>

        <Card className={styles.statCard}>
          <header className={styles.statHeader}>
            <span className={styles.statLabel}>Locations</span>
            <MapPin className={styles.statIcon} />
          </header>
          <p className={styles.statValue}>{stats.totalLocations}</p>
        </Card>

        <Card className={styles.statCard}>
          <header className={styles.statHeader}>
            <span className={styles.statLabel}>Countries</span>
            <Globe className={styles.statIcon} />
          </header>
          <p className={styles.statValue}>{stats.countriesVisited}</p>
        </Card>

        <Card className={styles.statCard}>
          <header className={styles.statHeader}>
            <span className={styles.statLabel}>Days Traveled</span>
            <Calendar className={styles.statIcon} />
          </header>
          <p className={styles.statValue}>{stats.daysTravel}</p>
        </Card>

        <Card className={styles.statCard}>
          <header className={styles.statHeader}>
            <span className={styles.statLabel}>Favorite Country</span>
            <BookHeart className={styles.statIcon} />
          </header>
          <p className={styles.statValue}>{stats.favoriteCountry}</p>
        </Card>
      </section>

      {/* Charts Section */}
      <section className={styles.chartsGrid}>
        <Card>
          <header className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Monthly Travel Activity</h3>
            <p className={styles.cardDescription}>Number of trips per month this year</p>
          </header>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <header className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Yearly Travel Activity</h3>
            <p className={styles.cardDescription}>Number of trips per year</p>
          </header>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trips" fill="#388e3c" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Recent Trips Section */}
      <section>
        <Card>
          <header className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Trips</h3>
            <p className={styles.cardDescription}>Your latest travel adventures</p>
          </header>
          <ul className={styles.tripsList}>
            {recentTrips.map((trip, index) => (
              <li key={index} className={styles.tripItem}>
                <div className={styles.tripInfo}>
                  <h4 className={styles.tripTitle}>{trip.title}</h4>
                  <div className={styles.tripMeta}>
                    <span className={styles.tripDate}>
                      <Calendar className={styles.tripIcon} />
                      {new Date(trip.date).toLocaleDateString()}
                    </span>
                    <span className={styles.tripLocations}>
                      <MapPin className={styles.tripIcon} />
                      {trip.locations} locations
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
