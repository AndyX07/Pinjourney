from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.trips.models import Trip
from api.locations.models import Location
from collections import defaultdict, Counter

class TravelStatsView(APIView):

    def get(self, request):
        user = request.user
        trips = Trip.objects.filter(user=user).order_by('-start_date')
        locations = Location.objects.filter(trip__user=user)

        total_days = sum([trip.trip_duration() for trip in trips])
        countries = [location.country for location in locations if location.country]

        trips_by_year = defaultdict(int)
        trips_by_month = defaultdict(int)

        for trip in trips:
            if trip.start_date:
                year = trip.start_date.year
                month = trip.start_date.strftime('%Y-%m')
                trips_by_year[year] += 1
                trips_by_month[month] += 1

        favorite_country = None
        if countries:
            country_counts = Counter(countries)
            favorite_country, _ = country_counts.most_common(1)[0]

        recent_trips = []
        for trip in trips[:3]:
            trip_locations = Location.objects.filter(trip=trip)
            recent_trips.append({
                "title": trip.title,
                "date": trip.start_date,
                "locations": trip_locations.count(),
                "country": trip_locations.first().country if trip_locations.exists() else None,
            })
        
        stats = {
            "total_days_traveled": total_days,
            "countries_visited": len(set(countries)),
            "total_trips": trips.count(),
            "total_locations": locations.count(),
            "trips_by_year": dict(sorted(trips_by_year.items())),
            "trips_by_month": dict(sorted(trips_by_month.items())),
            "favorite_country": favorite_country,
            "recent_trips": recent_trips
        }

        return Response(stats)