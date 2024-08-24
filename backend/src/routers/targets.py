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
from datetime import date, datetime
from pymongo import DESCENDING


router = APIRouter(prefix="/targets")
    

# ~~~ MongoDB CRUD routes

# Create new targets    
@router.post('/', response_model=TargetsModel, response_model_by_alias=False)
async def create_entry(entry: TargetsModel = Body(...)):
    new_targets = await targets_collection.insert_one(
        entry.model_dump(by_alias=True, exclude=['id'])
    )
    create_targets = await targets_collection.find_one(
        {'_id': new_targets.inserted_id}
    )
    return create_targets



# Read targets by date, gets the latest one before entry_date
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
    filter['entry_date'] = {'$lte': entry_date}
    
    targets = await targets_collection.find_one(filter, sort=[("entry_date", DESCENDING)])
    if targets:
        return TargetsModel(**targets)
    else:
        raise HTTPException(status_code=500, detail='No targets found.')
