from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Vet(db.Model):
    __tablename__ = 'Vet'
    
    vetID = db.Column(db.Integer, primary_key=True)
    vet_name = db.Column(db.String(255))
    vet_address = db.Column(db.String(255))
    vet_contact = db.Column(db.String(255))
    vet_email = db.Column(db.String(255))
    vet_hours = db.Column(db.String(255))
    vet_latitude = db.Column(db.Numeric(10, 8))  # Decimal column for latitude
    vet_longitude = db.Column(db.Numeric(11, 8))  # Decimal column for longitude
    vet_state = db.Column(db.String(255))  # New column for state

    def to_dict(self):
        return {
            'vetID': self.vetID,
            'vet_name': self.vet_name,
            'vet_address': self.vet_address,
            'vet_contact': self.vet_contact,
            'vet_email': self.vet_email,
            'vet_hours': self.vet_hours,
            'vet_latitude': float(self.vet_latitude) if self.vet_latitude else None,  # Convert to float for JSON serialization
            'vet_longitude': float(self.vet_longitude) if self.vet_longitude else None,  # Convert to float for JSON serialization
            'vet_state': self.vet_state
        }



class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(255))
    user_email = db.Column(db.String(255))
    user_password = db.Column(db.String(255))
    contact_number = db.Column(db.String(255))
    user_status = db.Column(db.String(50))
    def to_dict(self):
        return {
            'userID': self.userID,
            'user_name': self.user_name,
            'user_email': self.user_email,
            'user_password': self.user_password,
            'contact_number': self.contact_number,
            'user_status': self.user_status
        }

class Pets(db.Model):
    petID = db.Column(db.Integer, primary_key=True)
    pet_name = db.Column(db.String(50))
    pet_type = db.Column(db.String(50))
    pet_age = db.Column(db.Date)
    pet_gender = db.Column(db.String(10))
    pet_breed = db.Column(db.String(50))
    pet_photo = db.Column(db.String(255))

    def to_dict(self):
        return {
            'petID': self.petID,
            'pet_name': self.pet_name,
            'pet_type': self.pet_type,
            'pet_age': self.pet_age,
            'pet_gender': self.pet_gender,
            'pet_breed': self.pet_breed,
            'pet_photo': self.pet_photo
        }


class Listing(db.Model):
    listingID = db.Column(db.Integer, primary_key=True)
    petID = db.Column(db.Integer, db.ForeignKey('pets.petID'))
    listing_description = db.Column(db.Text)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'))
    locationID = db.Column(db.Integer, db.ForeignKey('listing_location.locationID'))  # Added this line
    listing_type = db.Column(db.String(50))
    adoption_fee = db.Column(db.Integer)
    listing_date = db.Column(db.Date)
    listing_status = db.Column(db.String(50))
    listing_delist_date = db.Column(db.Date)

    def to_dict(self):
        return {
            'listingID': self.listingID,
            'petID': self.petID,
            'listing_description': self.listing_description,
            'userID': self.userID,
            'locationID': self.locationID,  # Added this line
            'listing_type': self.listing_type,
            'adoption_fee': self.adoption_fee,
            'listing_date': self.listing_date,
            'listing_status': self.listing_status,
            'listing_delist_date': self.listing_delist_date,
        }

class ListingLocation(db.Model):
    locationID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    latitude = db.Column(db.Numeric(9, 6), nullable=False)
    longitude = db.Column(db.Numeric(9, 6), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'locationID': self.locationID,
            'latitude': float(self.latitude),  # Convert to float for JSON serialization
            'longitude': float(self.longitude),  # Convert to float for JSON serialization
            'city': self.city,
            'state': self.state
        }


class Report_Listing(db.Model):
    __tablename__ = 'Report_Listing'
    reportID = db.Column(db.Integer, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'))
    listingID = db.Column(db.Integer, db.ForeignKey('listing.listingID'))
    report_type = db.Column(db.String(50))
    report_date = db.Column(db.Date)
    report_description = db.Column(db.Text)

    def to_dict(self):
        return {
            'reportID': self.reportID,
            'userID': self.userID,
            'listingID': self.listingID,
            'report_type': self.report_type,
            'report_date': self.report_date,
            'report_description': self.report_description
        }

class UserVerification(db.Model):
    __tablename__ = 'UserVerification'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    verification_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('verification', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'verification_code': self.verification_code,
            'created_at': self.created_at
        }
    
class Pet_Owner(db.Model):
    __tablename__ = 'Pet_Owner'
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'), primary_key=True)
    petID = db.Column(db.Integer, db.ForeignKey('pets.petID'), primary_key=True)

    def to_dict(self):
        return {
            'userID': self.userID,
            'petID': self.petID,
        }
