"""Add Admin model

Revision ID: cb1f0a582be1
Revises: 
Create Date: 2026-03-28 15:33:49.006381

"""
from alembic import op
import sqlalchemy as sa


revision = 'cb1f0a582be1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('admin',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=True),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )


def downgrade():
    op.drop_table('admin')
