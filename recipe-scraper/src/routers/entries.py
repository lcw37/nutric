from fastapi import (
    APIRouter,
    HTTPException,
    Body,
    Request,
    Query
)
from ..lib.models import (
    EntryCollection,
    EntryModel,
    UpdateEntryModel
)
from ..lib.db.mongodb import entries_collection
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import date, datetime


router = APIRouter(prefix="/entries")
       
    
# ~~~ MongoDB CRUD routes

# Create new entry
@router.post('/', response_model=EntryModel, response_model_by_alias=False)
async def create_entry(entry: EntryModel = Body(...)):
    new_entry = await entries_collection.insert_one(
        entry.model_dump(by_alias=True, exclude=['id'])
    )
    created_entry = await entries_collection.find_one(
        {'_id': new_entry.inserted_id}
    )
    return created_entry


# Read all entries authored by the user, optionally filter by date, limit/offset
@router.get('/', response_model=EntryCollection, response_model_by_alias=False)
async def list_entries(
    req: Request,
    entry_date: str | None = Query(default=date.today().strftime('%m-%d-%Y')),
    limit: int = Query(default=20, ge=1),
    offset: int = Query(default=0, ge=0),
):
    user_id = req.headers.get('X-UserId')
    filter = {'author_id': user_id}
    if entry_date: # check if entry_date is in correct format
        try:
            datetime.strptime(entry_date, '%m-%d-%Y')
        except ValueError:
            raise HTTPException(404, 'invalid date formate')
        filter['entry_date'] = entry_date
        
    entries = await entries_collection.find(filter).skip(offset).limit(limit).to_list(length=limit)
    return EntryCollection(entries=entries)


# Read entry by id
@router.get('/{id}', response_model=EntryModel, response_model_by_alias=False)
async def show_entry(id: str):
    if ( entry := await entries_collection.find_one({'_id': ObjectId(id)}) ) is not None:
        return entry
    raise HTTPException(status_code=404, detail=f'student {id} not found.')


# Update entry by id
@router.put('/{id}', response_model=UpdateEntryModel, response_model_by_alias=False)
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


# Delete entry by id
@router.delete('/{id}')
async def delete_entry(id: str):
    delete_result = await entries_collection.delete_one({'_id': ObjectId(id)})
    if delete_result.deleted_count == 1:
        # return Response(status_code=204)
        return { 'message': f'successfully deleted entry {id}' }
    raise HTTPException(status_code=404, detail=f'student {id} not found.')
