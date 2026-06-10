from functools import wraps
from flask import session


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "admin_id" not in session:
            return {"message": "Unauthorized"}, 401
        return fn(*args, **kwargs)

    return wrapper
