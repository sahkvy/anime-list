from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234567890",
    database="anime_db"
)
cursor = db.cursor()

@app.route('/getAnimes', methods=['GET'])
def get_animes():
    cursor.execute("SELECT * FROM anime_list")
    result = cursor.fetchall()
    animes = []
    for row in result:
        animes.append({"title": row[1], "image": row[2]})
    return jsonify(animes)

@app.route('/addAnime', methods=['POST'])
def add_anime():
    try:
        data = request.get_json()
        title = data.get('title')
        image = data.get('image')

        if not title or not image:
            return jsonify({"message": "Title and image are required"}), 400

        cursor.execute("INSERT INTO anime_list (title, image) VALUES (%s, %s)", (title, image))
        db.commit()
        return jsonify({"message": "Anime added successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
