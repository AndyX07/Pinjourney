import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from sentence_transformers import SentenceTransformer
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

model = SentenceTransformer("all-MiniLM-L6-v2")

class RecommendView(APIView):
    
    def post(self, request):
        query = request.data.get("query")
        if not query:
            return Response({"error": "Missing 'query' in request body."}, status=status.HTTP_400_BAD_REQUEST)
        
        query_embedding = model.encode([query])[0].tolist()
        try:
            response = supabase.rpc(
                "match_travel_cities",
                {
                    "query_embedding": query_embedding,
                    "match_threshold": 0.5,
                    "match_count": 5
                }
            ).execute()
        except Exception as e:
            return Response({"error": f"Supabase RPC call failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        data = getattr(response, "data", None)
        if data is None:
            return Response({"error": "No data returned from Supabase"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        filtered_results = [
            {k: v for k, v in item.items() if k != "embedding"} for item in data
        ]

        return Response({"results": filtered_results}, status=status.HTTP_200_OK)