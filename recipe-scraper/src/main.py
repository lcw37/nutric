from .lib.setup import _ # loads env variables
from fastapi import (
    FastAPI, 
    HTTPException,
    Request
)
from .routers import entries, calculator
import hashlib
import os

if _: # see /lib/setup.py, this fixes a linting warning
    pass


app = FastAPI()
app.include_router(calculator.router)
app.include_router(entries.router)


@app.get('/ping')
async def ping():
    print('pinged from frontend')
    return {
        'message': 'pong'
    }
    
    
# ~~~ backend "auth" middleware, this is necessary to use Stack Auth

secret = os.environ['BACKEND_AUTH_SECRET']

def verify(user_id: str, hashed_user_id):
    return hashlib.sha256((user_id + secret).encode('utf-8')).hexdigest() == hashed_user_id

@app.middleware('http')
async def check_auth(req: Request, call_next):
    # skip over the /estimate and /recipe routes
    if req.url.path == '/calculator/from-recipe' or req.url.path == '/calculator/from-description':
        res = await call_next(req)
        return res
    # verify that the incoming request has used the proper hashing secret, this serves as JWT-like auth
    user_id = req.headers.get('X-UserId')
    hashed_user_id = req.headers.get('X-HashedUserId')
    if user_id and hashed_user_id:
        if verify(user_id, hashed_user_id):
            res = await call_next(req)
            return res
    else:
        raise HTTPException(status_code=400, detail='failed backend auth')
        