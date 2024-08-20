from fastapi import (
    APIRouter,
    HTTPException,
    Body,
    Request,
    Response
)
from ..lib.models import (
    EntryCollection,
    EntryModel,
    UpdateEntryModel
)
from ..lib.db.mongodb import entries_collection
from bson import ObjectId
from pymongo import ReturnDocument


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


# Read all entries authored by the user
@router.get('/', response_model=EntryCollection, response_model_by_alias=False)
async def list_entries(req: Request):
    user_id = req.headers.get('X-UserId')
    entries = await entries_collection.find({'author_id': user_id}).to_list(length=100) # max length to return, TODO: add skip/limit pagination
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
        return Response(status_code=204)
    raise HTTPException(status_code=404, detail=f'student {id} not found.')
