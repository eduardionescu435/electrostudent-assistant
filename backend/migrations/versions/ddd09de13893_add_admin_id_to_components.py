"""add admin_id to components

Revision ID: ddd09de13893
Revises: f1f28b14c3d5
Create Date: 2026-04-15 23:56:22.746587

"""
from alembic import op
import sqlalchemy as sa


revision = 'ddd09de13893'
down_revision = 'f1f28b14c3d5'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('components', schema=None) as batch_op:
        batch_op.add_column(sa.Column('admin_id', sa.Integer(), nullable=True))
        
    op.execute("UPDATE components SET admin_id = (SELECT id FROM admin ORDER BY id ASC LIMIT 1)")
    
    with op.batch_alter_table('components', schema=None) as batch_op:
        batch_op.alter_column('admin_id', existing_type=sa.Integer(), nullable=False)
        batch_op.drop_index(batch_op.f('identification_code'))
        batch_op.create_unique_constraint('_admin_ident_code_uc', ['admin_id', 'identification_code'])
        batch_op.create_foreign_key(None, 'admin', ['admin_id'], ['id'])



def downgrade():
    with op.batch_alter_table('components', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint('_admin_ident_code_uc', type_='unique')
        batch_op.create_index(batch_op.f('identification_code'), ['identification_code'], unique=True)
        batch_op.drop_column('admin_id')

