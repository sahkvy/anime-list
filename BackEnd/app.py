from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app, resources={
    r"/addAnime": {"origins": "http://127.0.0.1:5500"},
    r"/updateAnime/*": {"origins": "http://127.0.0.1:5500"},
    r"/deleteAnime/*": {"origins": "http://127.0.0.1:5500"},
    r"/getAnimes": {"origins": "http://127.0.0.1:5500"}
})

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
    cursor.execute("SELECT id, title, image, rating FROM anime_list")
    result = cursor.fetchall()
    animes = []
    for row in result:
        image_name = str(row[2])
        if image_name.startswith("b'") and image_name.endswith("'"):
            image_name = image_name[2:-1]
        animes.append({
            "id": row[0],
            "title": row[1],
            "image": f"http://localhost:5000/uploads/{image_name}",
            "rating": row[3] if row[3] is not None else 0
        })
    return jsonify(animes)

@app.route('/addAnime', methods=['POST'])
def add_anime():
    title = request.form['title']
    rating = request.form.get('rating', 0)
    image = request.files.get('image')
    
    if image:
        image_filename = image.filename
        if image_filename.startswith("b'") and image_filename.endswith("'"):
            image_filename = image_filename[2:-1]
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
    else:
        image_filename = "default.jpg"

    cursor.execute("INSERT INTO anime_list (title, image, rating) VALUES (%s, %s, %s)", 
                  (title, image_filename, rating))
    db.commit()
    return jsonify({"message": "Anime added successfully"}), 201

@app.route('/updateAnime/<int:id>', methods=['PUT'])
def update_anime(id):
    title = request.form['title']
    rating = request.form.get('rating', 0)
    image = request.files.get('image')
    
    if image:
        image_filename = image.filename
        if image_filename.startswith("b'") and image_filename.endswith("'"):
            image_filename = image_filename[2:-1]
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], image_filename))
        cursor.execute("UPDATE anime_list SET title = %s, image = %s, rating = %s WHERE id = %s", 
                      (title, image_filename, rating, id))
    else:
        cursor.execute("UPDATE anime_list SET title = %s, rating = %s WHERE id = %s", 
                      (title, rating, id))

    db.commit()
    return jsonify({"message": "Anime updated successfully"})

@app.route('/deleteAnime/<int:id>', methods=['DELETE'])
def delete_anime(id):
    cursor.execute("DELETE FROM anime_list WHERE id = %s", (id,))
    db.commit()
    return jsonify({"message": "Anime deleted successfully"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    if filename.startswith("b'") and filename.endswith("'"):
        filename = filename[2:-1]
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)