from src.database.db import db
from datetime import datetime

class Component(db.Model):
    __tablename__ = 'components'

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100))
    manufacturer = db.Column(db.String(100))
    identification_code = db.Column(db.String(100)) 
    quantity = db.Column(db.Integer, default=0)
    location = db.Column(db.String(255)) 
    image_url = db.Column(db.String(511))
    datasheet_url = db.Column(db.String(511))
    notes = db.Column(db.Text)
    pinout_data = db.Column(db.JSON) 
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    
    __table_args__ = (db.UniqueConstraint('admin_id', 'identification_code', name='_admin_ident_code_uc'),)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "manufacturer": self.manufacturer,
            "identification_code": self.identification_code,
            "quantity": self.quantity,
            "location": self.location,
            "image_url": self.image_url,
            "datasheet_url": self.datasheet_url,
            "notes": self.notes,
            "pinout_data": self.pinout_data,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
