from fastapi import (
    APIRouter,
    HTTPException,
    Body,
    Request,
    Query
)
from ..lib.models import (
    TargetsModel
)
from ..lib.db.mongodb import targets_collection
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import date, datetime


router = APIRouter(prefix="/targets")
    

# ~~~ MongoDB CRUD routes

# Create new targets
@router.post('/', response_model=TargetsModel, response_model_by_alias=False)
async def create_targets(targets: TargetsModel = Body(...)):
    entry_date = targets.entry_date
    filter = {"entry_date": entry_date}
    update = {"$set": targets.model_dump(by_alias=True, exclude=['id'])}
    
    # perform upsert (insert if not exists, update if exists)
    upsert_result = await targets_collection.find_one_and_update(
        filter, update, upsert=True, return_document=ReturnDocument.AFTER
    )
    # TODO: This error handling isn't right, make this route not replace an existing targets
    # check if document was inserted (new)
    if upsert_result is None:
        # Document already existed, handle as needed
        raise Exception("Target for this entry date already exists")
    else:
        # Return the newly inserted document
        return upsert_result


# Read targets by date
@router.get('/', response_model=TargetsModel, response_model_by_alias=False)
async def list_entries(
    req: Request,
    entry_date: str | None = Query(default=date.today().strftime('%m-%d-%Y'))
):
    user_id = req.headers.get('X-UserId')
    filter = {'author_id': user_id}
    # check if entry_date is in correct format
    if entry_date: 
        try:
            datetime.strptime(entry_date, '%m-%d-%Y')
        except ValueError:
            raise HTTPException(404, 'invalid date format')
        filter['entry_date'] = entry_date
    targets = await targets_collection.find_one(filter)
    return TargetsModel(**targets)