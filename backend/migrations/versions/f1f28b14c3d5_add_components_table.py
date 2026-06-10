"""Add components table

Revision ID: f1f28b14c3d5
Revises: cb1f0a582be1
Create Date: 2026-03-28 18:34:18.736866

"""
from alembic import op
import sqlalchemy as sa


revision = 'f1f28b14c3d5'
down_revision = 'cb1f0a582be1'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('components',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('category', sa.String(length=100), nullable=True),
    sa.Column('manufacturer', sa.String(length=100), nullable=True),
    sa.Column('identification_code', sa.String(length=100), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('location', sa.String(length=255), nullable=True),
    sa.Column('image_url', sa.String(length=511), nullable=True),
    sa.Column('datasheet_url', sa.String(length=511), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('pinout_data', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('identification_code')
    )


def downgrade():
    op.drop_table('components')
