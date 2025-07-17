import React, { useState } from "react";
import api from "../../services/api";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import { Search } from "lucide-react";
import styles from "./Recommendation.module.css";

interface RecommendationResult {
  id: number;
  city: string;
  country: string;
  category: string;
}

const Recommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await api.post("/recommendations/", { "query": query });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Travel Recommendations</h1>
        <p className={styles.subtitle}>Enter your interests to get personalized travel suggestions</p>
      </header>

      <Card>
        <div className={styles.cardContent}>
          <div className={styles.searchContainer}>
            <Input
              placeholder="Enter your travel interests (e.g., history, beaches). More interests gives better results."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
              disabled={loading}
            />
            <Button onClick={handleGetRecommendations} disabled={loading}>
              {loading ? "..." : <Search />}
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.cardContent}>
          {results.length === 0 && !loading && <p>No recommendations yet. Try entering a query.</p>}
          {results.length > 0 && (
            <ul className={styles.resultsList}>
              {results.map(({ id, city, country, category }) => (
                <li key={id} className={styles.resultItem}>
                  <strong>
                    {city}, {country}
                  </strong>
                  <p className={styles.resultCategory}>{category}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Recommendation;