import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load movie dataset
movies = pd.read_csv("movies.csv")

# Combine genre and description
movies["features"] = (
    movies["genre"].fillna("") + " " +
    movies["description"].fillna("")
)

# Convert text into numerical vectors
vectorizer = TfidfVectorizer(stop_words="english")
feature_matrix = vectorizer.fit_transform(movies["features"])

# Calculate similarity between movies
similarity = cosine_similarity(feature_matrix)


def recommend_movies(movie_title, number_of_recommendations=5):

    matches = movies[movies["title"].str.lower() == movie_title.lower()]

    if matches.empty:
        return []

    movie_index = matches.index[0]

    similarity_scores = list(
        enumerate(similarity[movie_index])
    )

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    recommended_movies = []

    for index, score in similarity_scores[1:number_of_recommendations + 1]:

        recommended_movies.append({
            "title": movies.iloc[index]["title"],
            "genre": movies.iloc[index]["genre"],
            "rating": movies.iloc[index]["rating"],
            "description": movies.iloc[index]["description"],
            "score": round(score * 100, 1),
            "reason": "Similar genre and story elements were found."
        })

    return recommended_movies