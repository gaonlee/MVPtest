from flask import Flask, request, jsonify, send_from_directory, render_template
from werkzeug.utils import secure_filename
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import pymongo
from functools import wraps
import logging
from flask import send_from_directory



logging.basicConfig(level=logging.DEBUG)

# .env 파일의 환경 변수 로드
load_dotenv()

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# MongoDB 설정
mongo_uri = os.getenv("MONGO_URI")
jwt_secret_key = os.getenv("JWT_SECRET_KEY")

if not mongo_uri:
    raise ValueError("MONGO_URI 환경 변수를 설정해주세요.")
else:
    print(f"Connecting to MongoDB with URI: {mongo_uri}")

if not jwt_secret_key:
    raise ValueError("JWT_SECRET_KEY 환경 변수를 설정해주세요.")

app.config["MONGO_URI"] = mongo_uri
app.config["JWT_SECRET_KEY"] = jwt_secret_key

# MongoDB 연결 테스트
try:
    print("MongoDB 연결 시도 중...")
    client = pymongo.MongoClient(mongo_uri)
    db_names = client.list_database_names()
    print("MongoDB 연결 성공. 사용 가능한 데이터베이스 목록:", db_names)
    mongo = PyMongo(app)
    db = mongo.db
except Exception as e:
    db = None
    print(f"MongoDB 연결 실패: {e}")

if db is None:
    raise ValueError("MongoDB 연결에 실패했습니다.")

# JWT 설정
jwt = JWTManager(app)

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        if not current_user.get('isAdmin', False):
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

@app.route('/admin/users', methods=['GET'])
@admin_required
def get_all_users():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    users = list(db.users.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@app.route('/admin/users/<user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.get_json()
    db.users.update_one({'_id': ObjectId(user_id)}, {'$set': data})
    updated_user = db.users.find_one({'_id': ObjectId(user_id)})
    updated_user['_id'] = str(updated_user['_id'])
    return jsonify(updated_user)

@app.route('/admin/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    db.users.delete_one({'_id': ObjectId(user_id)})
    return jsonify({"msg": "User deleted successfully"}), 200

@app.route('/admin/images', methods=['GET'])
@admin_required
def get_all_images():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    images = list(db.images.find())
    for image in images:
        image['_id'] = str(image['_id'])
    return jsonify(images)

@app.route('/admin/images/<image_id>', methods=['PUT'])
@admin_required
def update_image_admin(image_id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.get_json()
    db.images.update_one(
        {'_id': ObjectId(image_id)},
        {'$set': {'interpretation': data['interpretation'], 'title': data.get('title', '')}}
    )
    updated_image = db.images.find_one({'_id': ObjectId(image_id)})
    updated_image['_id'] = str(updated_image['_id'])
    return jsonify(updated_image)

@app.route('/images/<image_id>', methods=['GET'])
@jwt_required()
def get_image(image_id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    image = db.images.find_one({"_id": ObjectId(image_id)})
    if not image:
        return jsonify({"error": "Image not found"}), 404

    image['_id'] = str(image['_id'])
    return jsonify(image)


@app.route('/admin/images_with_users', methods=['GET'])
@admin_required
def get_images_with_users():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    images = list(db.images.find())
    user_ids = [image['user_id'] for image in images]
    users = db.users.find({'username': {'$in': user_ids}})  # Fetch users by username

    user_map = {user['username']: user for user in users}
    for image in images:
        image['_id'] = str(image['_id'])
        user_info = user_map.get(image['user_id'], None)
        if user_info:
            image['username'] = user_info['username']
        else:
            image['username'] = 'Unknown'
    
    return jsonify(images)

@app.route('/register', methods=['POST'])
def register():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Register attempt: {username}")
        print(f"Database: {db}")

        # Check if the username already exists
        existing_user = db.users.find_one({"username": username})
        if existing_user:
            print("User already exists")
            return jsonify({"error": "User already exists"}), 400

        # Insert the new user
        hashed_password = generate_password_hash(password)
        db.users.insert_one({"username": username, "password": hashed_password, "role": "user"})

        print("User registered successfully")
        return jsonify({"msg": "User registered successfully"}), 201

    except Exception as e:
        print(f"Error during registration: {e}")  # 디버깅 로그 추가
        return jsonify({"error": "An error occurred during registration"}), 500

@app.route('/create_admin', methods=['POST'])
def create_admin():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        username = "admin"
        password = "12345"

        # Check if the admin user already exists
        existing_user = db.users.find_one({"username": username})
        if existing_user:
            print("Admin user already exists")
            return jsonify({"error": "Admin user already exists"}), 400

        # Insert the admin user
        hashed_password = generate_password_hash(password)
        db.users.insert_one({"username": username, "password": hashed_password, "role": "admin"})

        print("Admin user created successfully")
        return jsonify({"msg": "Admin user created successfully"}), 201

    except Exception as e:
        print(f"Error during admin creation: {e}")
        return jsonify({"error": "An error occurred during admin creation"}), 500

@app.route('/login', methods=['POST'])
def login():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = db.users.find_one({"username": username})

    if user and check_password_hash(user['password'], password):
        isAdmin = user.get("role") == "admin"
        access_token = create_access_token(identity={"username": username, "isAdmin": isAdmin})
        return jsonify(access_token=access_token, isAdmin=isAdmin), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    current_user = get_jwt_identity()
    user_id = current_user['username']  # 사용자 이름을 ID로 사용

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        image_id = db.images.insert_one({
            'filename': filename,
            'path': file_path,
            'interpretation': "This is a sample interpretation of the image.",
            'user_id': user_id  # 사용자 이름을 저장
        }).inserted_id

        new_image = db.images.find_one({'_id': image_id})
        new_image['_id'] = str(new_image['_id'])
        return jsonify(new_image), 201

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/images', methods=['GET'])
@jwt_required()
def get_images():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    user_id = get_jwt_identity()['username']
    images = list(db.images.find({"user_id": user_id}))
    for image in images:
        image['_id'] = str(image['_id'])
    return jsonify(images)

@app.route('/search', methods=['GET'])
@jwt_required()
def search_images():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    user_id = get_jwt_identity()['username']
    query = request.args.get('q')
    result = list(db.images.find({
        "user_id": user_id, 
        '$or': [
            {'title': {'$regex': query, '$options': 'i'}}, 
            {'interpretation': {'$regex': query, '$options': 'i'}}
        ]
    }))
    for image in result:
        image['_id'] = str(image['_id'])
    return jsonify(result)

@app.route('/images/<image_id>', methods=['PUT'])
@jwt_required()
def update_image(image_id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    user_id = get_jwt_identity()['username']
    interpretation = request.json.get('interpretation')
    db.images.update_one({'_id': ObjectId(image_id), 'user_id': user_id}, {'$set': {'interpretation': interpretation}})
    updated_image = db.images.find_one({'_id': ObjectId(image_id)})
    updated_image['_id'] = str(updated_image['_id'])
    return jsonify(updated_image)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], path)):
        return send_from_directory(app.config['UPLOAD_FOLDER'], path)
    else:
        return send_from_directory(app.config['UPLOAD_FOLDER'], 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
