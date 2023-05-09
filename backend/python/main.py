from typing import Union

from fastapi import FastAPI, APIRouter

app = FastAPI()

router = APIRouter()

app.include_router(router, prefix="/papi")

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}