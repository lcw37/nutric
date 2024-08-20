from .lib.setup import _

from recipe_scrapers import WebsiteNotImplementedError
from fastapi import (
    FastAPI, 
    HTTPException,
    Body,
    Response,
    Request
)

from .lib.models import (
    EstimateFormData, 
    RecipeFormData, 
    EstimateResponse,
    EntryModel,
    UpdateEntryModel,
    EntryCollection
)
from .lib.estimate.estimate import (
    get_confidence_score,
    get_followup,
    get_estimate
)
from .lib.estimate.recipes import get_nutrition_from_url
from .lib.db.mongodb import entries_collection

from bson import ObjectId
from pymongo import ReturnDocument

import hashlib
import os


if _: # see /lib/setup.py, this is just to fix a linting warning
    pass

app = FastAPI()


@app.get('/ping')
async def ping():
    print('pinged from frontend')
    return {
        'message': 'pong'
    }


@app.post('/estimate')
async def estimate(formdata: EstimateFormData = Body(...)) -> EstimateResponse:
    if (formdata.followup and not formdata.followup_response) or (not formdata.followup and formdata.followup_response):
        raise HTTPException(400, 'Missing followup or response.')
    try:
        cs = get_confidence_score(formdata.description)
        if not formdata.followup:
            if cs < 7:
                formdata.followup = get_followup(formdata.description)
                return {
                    'response_type': 'followup',
                    'data': formdata
                }
        estimate = get_estimate(formdata)
        return EstimateResponse(**{
            'response_type': 'estimateFromDescription',
            'data': formdata,
            'estimate': estimate
        })
    except Exception:
        raise HTTPException(500, 'Failed to create estimate.')


@app.post('/recipe')
async def recipe(formdata: RecipeFormData = Body(...)) -> EstimateResponse:
    try:
        url = str(formdata.recipe_url)
        nutrition_breakdown = get_nutrition_from_url(url)
        return EstimateResponse(**{
            'response_type': 'estimateFromRecipe',
            'data': formdata,
            'estimate': nutrition_breakdown
        })
    except WebsiteNotImplementedError:
        raise HTTPException(400, f'Website not supported: {url}')
    
    
    
# ~~~ MongoDB "auth" middleware (because auth is already done on the NextJS frontend using Stack Auth)

secret = os.environ['BACKEND_AUTH_SECRET']

def verify(user_id: str, hashed_user_id):
    print(user_id)
    print(hashlib.sha256((user_id + secret).encode('utf-8')).hexdigest())
    print()
    return hashlib.sha256((user_id + secret).encode('utf-8')).hexdigest() == hashed_user_id

@app.middleware('http')
async def check_auth(req: Request, call_next):
    # skip over the /estimate and /recipe routes
    if req.url.path == '/recipe' or req.url.path == '/estimate':
        print('skipped middleware')
        res = await call_next(req)
        return res
    print('running middleware')
    user_id = req.headers.get('X-UserId')
    hashed_user_id = req.headers.get('X-HashedUserId')
    if user_id and hashed_user_id:
        if verify(user_id, hashed_user_id):
            res = await call_next(req)
            return res
    else:
        raise HTTPException(status_code=400, detail='failed backend auth')
        
        
    
    
# ~~~ MongoDB CRUD routes

@app.post('/entries/', response_model=EntryModel, response_model_by_alias=False)
async def create_entry(entry: EntryModel = Body(...)):
    new_entry = await entries_collection.insert_one(
        entry.model_dump(by_alias=True, exclude=['id'])
    )
    created_entry = await entries_collection.find_one(
        {'_id': new_entry.inserted_id}
    )
    return created_entry


@app.get('/entries/', response_model=EntryCollection, response_model_by_alias=False)
async def list_entries(req: Request):
    user_id = req.headers.get('X-UserId')
    entries = await entries_collection.find({'author_id': user_id}).to_list(length=100) # max length to return, TODO: add skip/limit pagination
    return EntryCollection(entries=entries)


@app.get('/entries/{id}', response_model=EntryModel, response_model_by_alias=False)
async def show_entry(id: str):
    if ( entry := await entries_collection.find_one({'_id': ObjectId(id)}) ) is not None:
        return entry
    raise HTTPException(status_code=404, detail=f'student {id} not found.')


@app.put('/entries/{id}', response_model=UpdateEntryModel, response_model_by_alias=False)
async def update_entry(id: str, entry: EntryModel):
    changes = {
        k: v for k, v in entry.model_dump(by_alias=True).items() if v is not None
    }
    if len(changes) >= 1:
        update_result = await entries_collection.find_one_and_update(
            { '_id': ObjectId(id) },
            { '$set': changes },
            return_document=ReturnDocument.AFTER
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f'student {id} not found.')
    # if the update document is empty, we should still return the entry document
    if (existing_entry := await entries_collection.find_one({'_id': id})) is not None:
        return existing_entry
    raise HTTPException(status_code=404, detail=f'student {id} not found.')


@app.delete('/entries/{id}')
async def delete_entry(id: str):
    delete_result = await entries_collection.delete_one({'_id': ObjectId(id)})
    if delete_result.deleted_count == 1:
        return Response(status_code=204)
    raise HTTPException(status_code=404, detail=f'student {id} not found.')