from flask import Flask, jsonify, send_from_directory, request
from models import db, Vet, User, Pets, Listing, ReportListing, Pet_Owner
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://us3r:1234@localhost/pawfecthome'
db.init_app(app)

# @app.route('/api/login', methods=['POST'])
# def login():
#     userEmail = request.json['user_email']
#     password = request.json['password']
    
#     # Fetch the user by email
#     user = User.query.filter(User.user_email == userEmail).first()
#     if user and user.user_password == password: # Compare plain text passwords
#         # Return user details if email and password are correct
#         return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200
#     else:
#         return jsonify({'message': 'Invalid credentials'}), 401

# @app.route('/api/register', methods=['POST'])
# def register():
#     # Get the required information from the request body
#     user_name = request.json['user_name']
#     user_email = request.json['user_email']
#     user_password = request.json['user_password']  # Front-end sends the field as user_password
#     contact_number = request.json['contact_number']
#     user_status = 'unverified'

#     # Check if the email is already registered
#     existing_user = User.query.filter_by(user_email=user_email).first()
#     if existing_user:
#         return jsonify({'message': 'Email address already registered'}), 400

#     # Hash the password
#     hashed_password = generate_password_hash(user_password, method='sha256')

#     # Create the User object
#     new_user = User(
#         user_name=user_name,
#         user_email=user_email,
#         user_password=hashed_password,
#         contact_number=contact_number,
#         user_status=user_status
#     )

#     # Add the new user to the database
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({'message': 'User registered successfully'}), 200

SECRET_KEY = 'YOUR_SECRET_KEY'

# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    userEmail = request.json['user_email']
    password = request.json['password']

    # Fetch the user by email
    user = User.query.filter(User.user_email == userEmail).first()
    if user and user.user_password == password:
        # Generate a token containing the user's ID
        token = jwt.encode({'user_id': user.userID}, SECRET_KEY, algorithm='HS256')
        # Return the token along with the user's details
        return jsonify({'token': token, 'user': user.to_dict()}), 200
    else:
        return jsonify({'message': 'Email and Password not match'}), 401

# User Details Route
@app.route('/api/get-user-details', methods=['GET'])
def get_user_details():
    user_id = get_user_id()
    user = User.query.filter(User.userID == user_id).first()
    if user:
        return jsonify({'user': user.to_dict()}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

def get_user_id():
    token = request.headers['Authorization'].split(' ')[1] # Assuming token is in 'Bearer token' format
    decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    return decoded_token['user_id']

@app.route('/api/register', methods=['POST'])
def register():
    # Get the required information from the request body
    user_name = request.json['user_name']
    user_email = request.json['user_email']
    user_password = request.json['user_password']  # Front-end sends the field as user_password
    contact_number = request.json['contact_number']
    user_status = 'unverified'

    # Check if the email is already registered
    existing_user = User.query.filter_by(user_email=user_email).first()
    if existing_user:
        return jsonify({'message': 'Email address already registered'}), 400

    # No need to hash the password, store as plain text
    # Create the User object
    new_user = User(
        user_name=user_name,
        user_email=user_email,
        user_password=user_password,  # Storing the password in plain text
        contact_number=contact_number,
        user_status=user_status
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 200


@app.route('/api/vets', methods=['GET'])
def get_vets():
    vets = Vet.query.all()
    return jsonify([vet.to_dict() for vet in vets]), 200

@app.route('/api/vets/<int:vetID>', methods=['GET'])
def get_vet(vetID):
    vet = Vet.query.get(vetID)
    if vet is None:
        return jsonify({'error': 'Vet not found'}), 404
    return jsonify([vet.to_dict()]), 200

@app.route('/api/listings/update-status/<int:listingID>', methods=['PUT'])
def update_listing_status(listingID):
    listing_status = request.json['listing_status']
    
    # Get the listing by listingID
    listing = Listing.query.filter(Listing.listingID == listingID).first()
    if listing:
        # Update the listing_status
        listing.listing_status = listing_status
        # Update the listing_delist_date with the current date
        listing.listing_delist_date = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Listing status updated successfully'}), 200
    else:
        return jsonify({'message': 'Listing not found'}), 404
    
@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email').lower() # Get email and convert to lowercase
    user = User.query.filter_by(user_email=email).first()
    return jsonify(exists=bool(user)), 200

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/api/pets', methods=['GET'])
def get_pets():
    pets = Pets.query.all()
    return jsonify([pet.to_dict() for pet in pets]), 200

@app.route('/api/pets/<int:petID>', methods=['GET'])
def get_pet(petID):
    pet = Pets.query.get(petID)
    if pet is None:
        return jsonify({'error': 'Pet not found'}), 404
    return jsonify([pet.to_dict()]), 200

@app.route('/api/pets/pet_image/<path:filename>')
def serve_pet_image(filename):
    return send_from_directory('C:\\Users\\kean5\\OneDrive\\Desktop\\Degree\\FYP\\React\\PawfectHomeTest\\assets\\pet_image', filename)

@app.route('/api/listings', methods=['GET'])
def get_listings():
    listings = Listing.query.filter(Listing.listing_status == 'active', Listing.listing_type != 'missing').all()
    result = []
    for listing in listings:
        pet = Pets.query.get(listing.petID)  # assuming listing has petID attribute
        if pet is None:
            continue  # you can decide how you want to handle this scenario
        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
        })
    return jsonify(result), 200


@app.route('/api/listings/active', methods=['GET'])
def get_active_listings():
    user_id = request.args.get('userID')  # Changed 'user_id' to 'userID'
    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400  # Return an error if no user_id

    print(user_id)
    # Filter listings by the provided user_id and listing_status as 'active'
    listings = Listing.query.filter_by(userID=user_id, listing_status='active').all()

    result = []
    for listing in listings:
        pet = Pets.query.get(listing.petID)  # assuming listing has petID attribute
        if pet is None:
            return jsonify({'error': 'pet not found'}), 404
        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
        })
    return jsonify(result), 200

@app.route('/api/listings/history', methods=['GET'])
def get_history_listings():
    user_id = request.args.get('userID')
    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400

    print(user_id)
    # Filter listings by the provided user_id and listing_status not equal to 'active'
    listings = Listing.query.filter(Listing.userID == user_id, Listing.listing_status != 'active').all()

    result = []
    for listing in listings:
        pet = Pets.query.get(listing.petID)
        if pet is None:
            return jsonify({'error': 'pet not found'}), 404
        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
        })
    return jsonify(result), 200

from werkzeug.security import generate_password_hash

@app.route('/api/change-password', methods=['POST'])
def change_password():
    user_id = get_user_id()  # Assuming you have this function from earlier
    new_password = request.json['new_password']

    user = User.query.filter(User.userID == user_id).first()
    if user:
        #hashed_password = generate_password_hash(new_password, method='sha256')
        #user.user_password = hashed_password
        user.user_password = new_password
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404


@app.route('/api/listings/missing', methods=['GET'])
def get_missing_listings():
    listings = Listing.query.filter_by(listing_type='missing').all()
    result = []
    for listing in listings:
        pet = Pets.query.get(listing.petID)  # assuming listing has petID attribute
        if pet is None:
            continue  # you can decide how you want to handle this scenario
        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
        })
    return jsonify(result), 200

@app.route('/api/validate-password', methods=['POST'])
def validate_password():
    user_id = get_user_id() 
    current_password = request.json['current_password']

    user = User.query.filter(User.userID == user_id).first()
    if user and (user.user_password == current_password):
        return jsonify({'valid': True}), 200
    else:
        return jsonify({'valid': False, 'message': 'Current password does not match'}), 400

@app.route('/api/listings/<int:listingID>', methods=['GET'])
def get_listing(listingID):
    listing = Listing.query.get(listingID)
    if listing is None:
        return jsonify({'error': 'Listing not found'}), 404
    pet = Pets.query.get(listing.petID)  # assuming listing has petID attribute
    if pet is None:
        return jsonify({'error': 'Pet not found'}), 404
    user = User.query.get(listing.userID) 
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'listing': listing.to_dict(),
        'pet': pet.to_dict(),
        'user': user.to_dict()
}), 200

@app.route('/')
def home():
    return 'Server is working!', 200


if __name__ == '__main__':
    app.run(debug=True)
