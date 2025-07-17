import React from "react";
import { useEffect, useState } from "react";
import Map from "../../components/Map/Map";
import api from "../../services/api";
import styles from "./AllLocationMap.module.css"

const AllLocationMap: React.FC = () => {
    type Location = {
        tripName: string;
        latitude: number;
        longitude: number;
        name: string;
    }
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
        const fetchData = async() => {
            try{
                let allLocations: any[] = [];
                let url = "/locations/";
                while (url) {
                    const res = await api.get(url);
                    allLocations = allLocations.concat(res.data.results);
                    url = res.data.next;
                }
                const tripIds = Array.from(new Set(allLocations.map((loc: any)=>loc.trip)))as number[];
                const tripTitles: Record<number, string> = {};
                await Promise.all(
                    tripIds.map(async(tripId: number) => {
                        try{
                            const tripRes = await api.get(`/trips/${tripId}/`);
                            tripTitles[tripId] = tripRes.data.title;
                        }
                        catch(error){
                            console.log(`Failed to fetch trip ${tripId}`);
                            tripTitles[tripId] = "Unknown Trip";
                        }
                    })
                )
                const mappedLocations: Location[] = allLocations.map((loc: any)=>({
                    tripName: tripTitles[loc.trip],
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    name: loc.name
                }))
                setLocations(mappedLocations);
            }
            catch(error){
                console.log("Fetching location data failed");
            }
        }
        fetchData();
        setLoading(false);
    }, [])
    if(loading) return(
        <p className = {styles.loading}>Map is loading...</p>
    )
    return(
        <main className={styles.mapContainer}>
            <Map locations={locations.map((loc) => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
                name: `${loc.tripName}: ${loc.name}`
            }))} zoom = {2}/>
        </main>
    )
}

export default AllLocationMap