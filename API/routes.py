from flask import Flask, jsonify, send_from_directory, request
from models import db, UserVerification, ListingLocation, Vet, User, Pets, Listing, Report_Listing, Pet_Owner
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
from flask_mail import Mail, Message
import random
from flask_bcrypt import Bcrypt
import math

app = Flask(__name__)
SECRET_KEY = 'YOUR_SECRET_KEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://us3r:1234@localhost/pawfecthome'
db.init_app(app)
bcrypt = Bcrypt(app)

app.config['MAIL_SERVER'] = 'smtp-mail.outlook.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'pawfectHome@hotmail.com'
app.config['MAIL_PASSWORD'] = 'pawfectFYP123.'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

# app.config['MAIL_SERVER'] = 'imap.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = 'kemonomimikawaiides@gmail.com'
# app.config['MAIL_PASSWORD'] = 'Iamkeanfong<3.'
# app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True

mail = Mail(app)


@app.route('/api/forgotPassword/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email').lower() # Get email and convert to lowercase
    user = User.query.filter_by(user_email=email).first()
    return jsonify(exists=bool(user)), 200

@app.route('/api/check-email', methods=['POST'])
def forgotPassword_check_email():
    data = request.get_json()
    email = data.get('email').lower()
    user = User.query.filter_by(user_email=email).first()
    if user:
        return jsonify(exists=True), 200
    else:
        return jsonify(exists=False), 200

#Register account
@app.route('/api/register', methods=['POST'])
def register():
    # Get the required information from the request body
    user_name = request.json['user_name']
    user_email = request.json['user_email']
    user_password = request.json['user_password']
    contact_number = request.json['contact_number']
    user_status = 'unverified'

    hashed_password = bcrypt.generate_password_hash(user_password).decode('utf-8')
    
    # Check if the email is already registered
    existing_user = User.query.filter_by(user_email=user_email).first()
    if existing_user:
        # If the user is active or banned, return an error message
        if existing_user.user_status in ['active', 'banned']:
            return jsonify({'message': 'Email is already registered and verified.'}), 400
        # If the user is unverified, update the existing record
        else:
            return jsonify({'message': 'Something went wrong, Please try again.'}), 400

    # If no existing user, create the User object
    new_user = User(
        user_name=user_name,
        user_email=user_email,
        user_password=hashed_password,  # Store the hashed password
        contact_number=contact_number,
        user_status=user_status
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 200



@app.route('/api/check-contactNumber', methods=['POST'])
def check_contactNumber():
    data = request.get_json()
    contactNumber = data.get('contactNumber') # Get contact number
    user = User.query.filter_by(contact_number = contactNumber).first()
    print(user)
    return jsonify(exists=bool(user)), 200

@app.route('/api/upload-image', methods=['POST'])
def upload_file():
    uploaded_file = request.files['photo']
    print(uploaded_file.filename)

    if uploaded_file.filename != '':
        image_path = "C:\\Users\\kean5\\OneDrive\\Desktop\\Degree\\FYP\\React\\PawfectHomeTest\\assets\\pet_image\\" + uploaded_file.filename
        uploaded_file.save(image_path)
    return jsonify({'message': 'Upload Successfully!'}), 200


@app.route('/api/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    email = data.get('email')
    
    # Generate a random 6-digit code
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    # Verify if email exists before sending
    user = User.query.filter_by(user_email=email).first()
    if not user:
        return jsonify({'message': 'Email not found'}), 404

    # Check if there is an existing verification entry for the user
    verification_entry = UserVerification.query.filter_by(user_id=user.userID).first()

    if verification_entry:
        # If there is an existing entry, update it
        verification_entry.verification_code = code
        verification_entry.created_at = datetime.utcnow() # Update timestamp
    else:
        # If there is no existing entry, create a new one
        verification_entry = UserVerification(user_id=user.userID, verification_code=code, created_at=datetime.utcnow())
        db.session.add(verification_entry)

    db.session.commit()

    # Compose and send email
    msg = Message('Verification Code', sender='pawfectHome@hotmail.com', recipients=[email])
    msg.body = f"Your verification code is: {code}"
    mail.send(msg)

    return jsonify({'message': 'Email sent successfully'}), 200


@app.route('/api/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    code = data.get('code')
    email = data.get('email')

    user = User.query.filter_by(user_email=email).first()
    if not user:
        return jsonify({'verified': False}), 400

    verification_entry = UserVerification.query.filter_by(user_id=user.userID).first()
    if not verification_entry or verification_entry.verification_code != code:
        return jsonify({'verified': False}), 400

    # Check if the verification code has expired
    if datetime.utcnow() > verification_entry.created_at + timedelta(minutes=5):
        return jsonify({'verified': False, 'message': 'Code has expired'}), 400

    # Delete the verification entry after successful verification
    db.session.delete(verification_entry)
    db.session.commit()

    return jsonify({'verified': True}), 200

#Delete verification code for quitted user
@app.route('/api/delete-verification-code', methods=['POST'])
def delete_verification_code():
    data = request.get_json()
    email = data.get('email')

    print(email)

    user = User.query.filter_by(user_email=email).first()
    if user:
        verification_entry = UserVerification.query.filter_by(user_id=user.userID).first()
        if verification_entry:
            db.session.delete(verification_entry)
            db.session.commit()
            return jsonify({'message': 'Verification code deleted'}), 200

    return jsonify({'message': 'Email not found'}), 404

@app.route('/api/registration/getUserID', methods=['POST'])
def get_userID():
    data = request.get_json()
    email = data.get('email')
    print('email ::', email)

    user = User.query.filter_by(user_email=email).first()
    print('USER  ', user.userID)
    

    if user:
        return jsonify({'userID': user.userID}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    userEmail = request.json['user_email']
    password = request.json['password']

    # Fetch the user by email
    user = User.query.filter(User.user_email == userEmail).first()
    if user and bcrypt.check_password_hash(user.user_password, password):  # Check the password against its hash
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

@app.route('/api/vets', methods=['GET'])
def get_vets():
    vet_state = request.args.get('vet_state')
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)
    
    if vet_state:
        vets = Vet.query.filter_by(vet_state=vet_state).all()
    else:
        vets = Vet.query.all()

    # Convert vets to a list
    vet_list = list(vets)

    # If latitude and longitude are provided, sort the vets by distance
    if latitude and longitude:
        vet_list.sort(key=lambda vet: haversine_distance(latitude, longitude, vet.vet_latitude, vet.vet_longitude))

    return jsonify([vet.to_dict() for vet in vet_list]), 200


@app.route('/api/vets/<int:vetID>', methods=['GET'])
def get_vet(vetID):
    vet = Vet.query.get(vetID)
    if vet is None:
        return jsonify({'error': 'Vet not found'}), 404
    return jsonify([vet.to_dict()]), 200

@app.route('/api/user/<int:userID>', methods=['GET'])
def get_user(userID):
    user = User.query.get(userID)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({"contact_number": user.contact_number, "user_email": user.user_email}), 200


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


@app.route('/api/update-userName', methods=['POST'])
def update_user():
    user_data = request.json
    user_name = user_data.get('userName', None)

    user_id = get_user_id()
    
    if not user_id:
        return jsonify(message="User not authenticated"), 401

    user = User.query.filter(User.userID == user_id).first()

    # Update the username in your database if provided
    if user_name and user:
        user.user_name  = user_name

        db.session.commit()
        return jsonify(message="User details updated successfully"), 200
    else:
        return jsonify(message="Error updating user details"), 400

@app.route('/api/update-user_status', methods=['POST'])
def update_status():
    data = request.get_json()
    user_id = data.get('user_ID')
    user_status = data.get('userStatus')

    user = User.query.filter(User.userID == user_id).first()
    print('USER  ', user)
    # Update the username in your database if provided
    if user:
        user.user_status = user_status
        
        print('STATUS  ' , user.user_status)
        db.session.commit()
        return jsonify(message="User status updated successfully"), 200
    else:
        return jsonify(message="Error updating user status"), 400
    
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Fetch user by ID
    user = User.query.get_or_404(user_id)

    # Delete Listings
    listings = Listing.query.filter_by(userID=user_id).all()
    for listing in listings:
        db.session.delete(listing)

    # Delete Pet Ownerships
    pet_owners = Pet_Owner.query.filter_by(userID=user_id).all()
    for pet_owner in pet_owners:
        db.session.delete(pet_owner)

    # Identify pets to delete
    pet_ids_to_delete = [pet_owner.petID for pet_owner in pet_owners]

    # Delete Pets
    for pet_id in pet_ids_to_delete:
        pet = Pets.query.get(pet_id)
        if pet:
            db.session.delete(pet)

    # Finally, delete the User
    db.session.delete(user)

    # Commit changes to the database
    db.session.commit()

    return jsonify({'message': 'User and related records deleted successfully'}), 200

@app.route('/api/report', methods=['POST'])
def create_report():
    # Get JSON data from the request
    data = request.get_json()

    # Check if the required fields are provided
    required_fields = ['userID', 'listingID', 'report_type', 'report_description']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Create a new ReportListing object
    report = Report_Listing(
        userID=data['userID'],
        listingID=data['listingID'],
        report_type=data['report_type'],
        report_date=datetime.utcnow(), # Automatically set to the current date
        report_description=data['report_description']
    )

    # Add and commit to the database
    db.session.add(report)
    db.session.commit()

    # Return the created report
    return jsonify(report.to_dict()), 201


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

@app.route('/api/listing-location/<int:locationID>', methods=['GET'])
def get_listing_location(locationID):
    location = ListingLocation.query.get(locationID)
    if location is None:
        return jsonify({'error': 'Location not found'}), 404
    return jsonify(location.to_dict()), 200

ITEMS_PER_PAGE = 10

@app.route('/api/listings', methods=['GET'])
def get_listings():
    page = request.args.get('page', 1, type=int)
    offset = (page - 1) * ITEMS_PER_PAGE
    user_lat = request.args.get('latitude', type=float)  # Get user's latitude from request
    user_lon = request.args.get('longitude', type=float)  # Get user's longitude from request

    # Fetch all active listings that are not 'missing'
    all_listings = Listing.query.filter(Listing.listing_status == 'active', Listing.listing_type != 'missing').all()

    result = []

    for listing in all_listings:
        pet = Pets.query.get(listing.petID)
        if pet is None:
            continue

        location = ListingLocation.query.get(listing.locationID)
        if location is None:
            continue
        
        distance = None
        if user_lat and user_lon:
            distance = haversine_distance(user_lat, user_lon, location.latitude, location.longitude)

        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
            'distance': distance  # Add distance to the result
        })

    # Sort the results by distance if latitude and longitude are provided, otherwise sort by listing creation date (assuming there's a created_at field in the Listing model)
    if user_lat and user_lon:
        result.sort(key=lambda x: x['distance'])
    else:
        result.sort(key=lambda x: x['listing']['listingID'], reverse=True)

    # Apply pagination after sorting
    paginated_result = result[offset: offset + ITEMS_PER_PAGE]

    return jsonify(paginated_result), 200



def haversine_distance(lat1, lon1, lat2, lon2):
    # Convert decimal.Decimal to float
    lat1 = float(lat1)
    lon1 = float(lon1)
    lat2 = float(lat2)
    lon2 = float(lon2)

    R = 6371  # Radius of the Earth in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance


@app.route('/api/search_listings', methods=['GET'])
def search_listings():
    pet_type = request.args.get('petType')
    status = request.args.get('status')
    age = request.args.get('age')
    location_state = request.args.get('location')  # Renamed to location_state for clarity
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    # Join with ListingLocation table
    query = db.session.query(Listing, Pets, ListingLocation).join(Pets, Listing.petID == Pets.petID).join(ListingLocation, Listing.locationID == ListingLocation.locationID)
    query = query.filter(Listing.listing_status == 'active', Listing.listing_type != 'missing')

    if pet_type:
        query = query.filter(Pets.pet_type == pet_type)
    if status:
        query = query.filter(Listing.listing_type == status)
    if location_state:
        query = query.filter(ListingLocation.state == location_state)  # Filter by state

       # Execute the query
    results = query.all()

    # Filter results based on age
    if age:
        filtered_results = []
        for listing, pet, location in results:  # Added location to unpacking
            pet_age = get_years_from_date(str(pet.pet_age))
            if age == '1' and pet_age < 1:
                filtered_results.append((listing, pet, location))
            elif age == '3' and 1 <= pet_age <= 3:
                filtered_results.append((listing, pet, location))
            elif age == '6' and 4 <= pet_age <= 6:
                filtered_results.append((listing, pet, location))
            elif age == '10' and 7 <= pet_age <= 10:
                filtered_results.append((listing, pet, location))
            elif age == '>10' and pet_age > 10:
                filtered_results.append((listing, pet, location))
        results = filtered_results

    # Sort by distance if latitude and longitude are provided
    if latitude and longitude:
        results.sort(key=lambda x: haversine_distance(latitude, longitude, x[2].latitude, x[2].longitude))

    # Convert results to desired format
    response_data = []
    for listing, pet, location in results:  # Added location to unpacking
        response_data.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
            'location': location.to_dict()  # Add location details to the response
        })

    return jsonify(response_data), 200


def get_years_from_date(date_of_birth):
    today = datetime.now()
    birth_date = datetime.strptime(date_of_birth.split(' ')[0], '%Y-%m-%d')
    years = today.year - birth_date.year
    months = today.month - birth_date.month
    if months < 0 or (months == 0 and today.day < birth_date.day):
        years -= 1
    return years


@app.route('/api/listings/active', methods=['GET'])
def get_active_listings():
    user_id = request.args.get('userID')  # Changed 'user_id' to 'userID'
    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400  # Return an error if no user_id

    print(user_id)
    # Filter listings by the provided user_id and listing_status as 'active' and order by listingID
    listings = Listing.query.filter_by(userID=user_id, listing_status='active').order_by(Listing.listingID.desc()).all()

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
    listings = Listing.query.filter(Listing.userID == user_id, Listing.listing_status != 'active').order_by(Listing.listingID.desc()).all()

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

@app.route('/api/change-password', methods=['POST'])
def change_password():
    user_id = get_user_id()  # Assuming you have this function from earlier
    new_password = request.json['new_password']

    user = User.query.filter(User.userID == user_id).first()
    if user:
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.user_password = hashed_password
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404


@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    user_email = request.json['email']
    new_password = request.json['newPassword']

    user = User.query.filter(User.user_email == user_email).first()
    if user:
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        user.user_password = hashed_password
        db.session.commit()
        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

    

@app.route('/api/listings/missing', methods=['GET'])
def get_missing_listings():
    page = request.args.get('page', default=1, type=int)
    offset = (page - 1) * ITEMS_PER_PAGE
    latitude = request.args.get('latitude', default=0, type=float)
    longitude = request.args.get('longitude', default=0, type=float)

    # Fetch all listings with type 'missing'
    all_listings = Listing.query.filter_by(listing_type='missing').all()
    result = []

    for listing in all_listings:
        pet = Pets.query.get(listing.petID)  # assuming listing has petID attribute
        if pet is None:
            continue  # you can decide how you want to handle this scenario

        location = ListingLocation.query.get(listing.locationID)
        if location is None:
            continue

        # Calculate distance only if latitude and longitude are not both 0
        if latitude != 0 or longitude != 0:
            distance = haversine_distance(latitude, longitude, location.latitude, location.longitude)
        else:
            distance = None

        result.append({
            'listing': listing.to_dict(),
            'pet': pet.to_dict(),
            'distance': distance  # Add distance to the result
        })

    # Sort the results by distance if latitude and longitude are provided and not both 0
    if latitude != 0 or longitude != 0:
        result.sort(key=lambda x: x['distance'] if x['distance'] is not None else float('inf'))

    # Apply pagination after sorting
    paginated_result = result[offset: offset + ITEMS_PER_PAGE]

    return jsonify(paginated_result), 200




@app.route('/api/validate-password', methods=['POST'])
def validate_password():
    user_id = get_user_id() 
    current_password = request.json['current_password']

    user = User.query.filter(User.userID == user_id).first()
    if user and bcrypt.check_password_hash(user.user_password, current_password):
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

######################### CREATE LISTING #####################################

#add pet
@app.route('/api/add-pet', methods=['POST'])
def add_pet():
    data = request.get_json()
    new_pet = Pets(
        pet_name=data['pet_name'],
        pet_type=data['pet_type'],
        pet_age=data['pet_age'],
        pet_gender=data['pet_gender'],
        pet_breed=data['pet_breed'],
        pet_photo=data['pet_photo'],
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({'petID': new_pet.petID}), 200

@app.route('/')
def home():
    return 'Server is working!', 200


#add petOwner
@app.route('/api/add-pet-owner', methods=['POST'])
def add_pet_owner():
    data = request.get_json()
    new_pet_owner = Pet_Owner(
        userID=data['userID'],
        petID=data['petID']
    )
    db.session.add(new_pet_owner)
    db.session.commit()
    return jsonify({'message': 'Pet owner relationship added successfully'}), 200

#addLocation
@app.route('/api/add-location', methods=['POST'])
def add_location():
    data = request.get_json()
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    city = data.get('city')
    state = data.get('state')

    print('ADD LOCATION', data)

    if not all([latitude, longitude, city, state]):
        return jsonify({'error': 'Missing required data'}), 400
    
    new_location = ListingLocation(  # Use the correct class name here
        latitude=data['latitude'],
        longitude=data['longitude'],
        city=data['city'],
        state=data['state']
    )
    
    db.session.add(new_location)
    db.session.commit()
    return jsonify({'locationID': new_location.locationID}), 200


#addListing
@app.route('/api/add-listing', methods=['POST'])
def add_listing():
    data = request.get_json()
    new_listing = Listing(
        petID=data['petID'],
        listing_description=data['listing_description'],
        userID=data['userID'],
        locationID=data['locationID'],
        listing_type=data['listing_type'],
        adoption_fee=data['adoption_fee'],
        listing_date=data['listing_date'],
        listing_status=data['listing_status']
    )
    
    db.session.add(new_listing)
    db.session.commit()
    return jsonify({'listingID': new_listing.listingID}), 200



# if __name__ == '__main__':
#     app.run(host='0.0.0.0', debug=True)
if __name__ == '__main__':
    app.run(host='192.168.0.127', debug=True)