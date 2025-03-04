from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

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
    cursor.execute("SELECT id, title, image FROM anime_list")
    result = cursor.fetchall()
    animes = [{"id": row[0], "title": row[1], "image": f"http://localhost:5000/uploads/{row[2]}"} for row in result]
    return jsonify(animes)

@app.route('/addAnime', methods=['POST'])
def add_anime():
    title = request.form['title']
    image = request.files.get('image')
    image_filename = image.filename if image else "default.jpg"
    if image:
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))

    cursor.execute("INSERT INTO anime_list (title, image) VALUES (%s, %s)", (title, image_filename))
    db.commit()
    return jsonify({"message": "Anime added successfully"}), 201

@app.route('/updateAnime/<int:id>', methods=['PUT'])
def update_anime(id):
    title = request.form['title']
    image = request.files.get('image')
    
    if image:
        image_filename = image.filename
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
        cursor.execute("UPDATE anime_list SET title = %s, image = %s WHERE id = %s", (title, image_filename, id))
    else:
        cursor.execute("UPDATE anime_list SET title = %s WHERE id = %s", (title, id))

    db.commit()
    return jsonify({"message": "Anime updated successfully"})

@app.route('/deleteAnime/<int:id>', methods=['DELETE'])
def delete_anime(id):
    cursor.execute("DELETE FROM anime_list WHERE id = %s", (id,))
    db.commit()
    return jsonify({"message": "Anime deleted successfully"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
