from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Vet(db.Model):
    __tablename__ = 'Vet'
    
    vetID = db.Column(db.Integer, primary_key=True)
    vet_name = db.Column(db.String(255))
    vet_address = db.Column(db.String(255))
    vet_contact = db.Column(db.String(255))
    vet_email = db.Column(db.String(255))
    vet_hours = db.Column(db.String(255))

    def to_dict(self):
        return {
            'vetID': self.vetID,
            'vet_name': self.vet_name,
            'vet_address': self.vet_address,
            'vet_contact': self.vet_contact,
            'vet_email': self.vet_email,
            'vet_hours': self.vet_hours
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
    availablity_status = db.Column(db.String(50))
    pet_photo = db.Column(db.String(255))

    def to_dict(self):
        return {
            'petID': self.petID,
            'pet_name': self.pet_name,
            'pet_type': self.pet_type,
            'pet_age': self.pet_age,
            'pet_gender': self.pet_gender,
            'pet_breed': self.pet_breed,
            'availablity_status': self.availablity_status,
            'pet_photo': self.pet_photo
        }


class Listing(db.Model):
    listingID = db.Column(db.Integer, primary_key=True)
    petID = db.Column(db.Integer, db.ForeignKey('pets.petID'))
    listing_description = db.Column(db.Text)
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'))
    listing_location = db.Column(db.String(255))
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
            'listing_location': self.listing_location,
            'listing_type': self.listing_type,
            'adoption_fee': self.adoption_fee,
            'listing_date': self.listing_date,
            'listing_status': self.listing_status,
            'listing_delist_date': self.listing_delist_date,
        }


class ReportListing(db.Model):
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


class Pet_Owner(db.Model):
    __tablename__ = 'Pet_Owner'
    userID = db.Column(db.Integer, db.ForeignKey('user.userID'), primary_key=True)
    petID = db.Column(db.Integer, db.ForeignKey('pets.petID'), primary_key=True)

    def to_dict(self):
        return {
            'userID': self.userID,
            'petID': self.petID,
        }
