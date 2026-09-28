from flask import Flask, render_template, request, jsonify
from recommender import recommend_movies

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()
    movie_title = data.get("movie")

    if not movie_title:
        return jsonify({
            "success": False,
            "message": "Please select a movie."
        })

    recommendations = recommend_movies(movie_title)

    if not recommendations:
        return jsonify({
            "success": False,
            "message": "Movie not found."
        })

    return jsonify({
        "success": True,
        "recommendations": recommendations
    })


if __name__ == "__main__":
    app.run(debug=True)