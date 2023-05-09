from typing import Union

from fastapi import FastAPI, APIRouter

app = FastAPI()

@app.get("/papi")
def read_root():
    return {"Hello": "World"}


@app.get("/papi/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}