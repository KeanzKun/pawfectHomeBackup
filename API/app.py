# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import config

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

# Import models
import models

# Import routes
from routes import *

# Create tables
# db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
