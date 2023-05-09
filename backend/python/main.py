from typing import Union

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    servers=[
        {"url":"http://localhost:8000"},
        {"url":"https://ta-da.world"}
    ]
)

origins = [
    "http://ta-da.world",
    "https://ta-da.world",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/papi")
def read_root():
    return {"Hello": "World"}


@app.get("/papi/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}