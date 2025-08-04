# Pinjourney

Pinjourney is a full-stack travel tracker and journal web app where users can **pin locations to a map**, **write trip logs** and **upload photos**. It uses **AI-powered semantic search** to recommend cities based on user interests.

## Features

- Interactive map for pinning visited or desired locations (Leaflet.js)
- Personal travel logs with rich-text entries and photo uploads
- AI-powered city recommendations using semantic embeddings
- Stats tracking: number of trips, countries visited, categories explored
- JWT-based authentication
- Image storage and vector search using Supabase

## Tech Stack

### Frontend
- **React.js + TypeScript**
- **Leaflet.js** (for interactive maps)
- **JWT Authentication**

### Backend
- **Django + Django REST Framework**
- **Docker** (containerized backend)
- **Supabase** (PostgreSQL, Storage Buckets, Vector Search)
- **pgvector** extension for cosine similarity
- **Sentence Transformers (MiniLM-L6-v2)**

## Setup

### 1. Backend (Django + Supabase)

1. Ensure Supabase is set up and pgvector extension is enabled:

```
create extension if not exists vector;
```

2. Create travel-cities table and set-up cosine distance function in Supabase:

```
Create travel-cities
create table travel_cities (
  id bigint generated always as identity primary key,
  city text not null,
  country text not null,
  category text not null,
  embedding vector(384)  -- 384 is the dimension used by all-MiniLM-L6-v2
);
```

Create cosine distance function
```
CREATE OR REPLACE FUNCTION match_travel_cities(
    query_embedding vector(384),  -- match your embedding dimension
    match_threshold float,
    match_count int
)
RETURNS SETOF travel_cities AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM travel_cities
    WHERE embedding <=> query_embedding < match_threshold
    ORDER BY embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

3. Load travel_cities with embedding data:

Run the notebook cells to embed city data and upload to Supabase: https://colab.research.google.com/drive/1qxr3GrVo3G42sL-RRxb_G-HSDZCUKf6d?usp=sharing

4. Environment variables (in server/.env):

```
DJANGO_SECRET_KEY=your-django-secret-key

DB_HOST=your-db-host.supabase.com
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_BUCKET_NAME=your-supabase-bucket-name
```

Option 1 (Docker)

5. Run docker setup

```
docker-compose up --build -d
```

6. Apply migrations:

```
docker exec -it pinjourney_backend python manage.py migrate
```

Option 2 (without Docker)

5. 

```
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend (React + TypeScript)

1. Install dependencies:

```
cd client
npm install
```

2. Start the frontend:

```
npm start
```
