from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
        animes.append({"title": row[1], "image": f"http://localhost:5000/uploads/{row[2]}"})
    return jsonify(animes)

@app.route('/addAnime', methods=['POST'])
def add_anime():
    try:
        title = request.form['title']
        image = request.files['image']
        
        if not title or not image:
            return jsonify({"message": "Title and image are required"}), 400

        image_filename = image.filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
        image.save(image_path)

        cursor.execute("INSERT INTO anime_list (title, image) VALUES (%s, %s)", (title, image_filename))
        db.commit()
        return jsonify({"message": "Anime added successfully"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
