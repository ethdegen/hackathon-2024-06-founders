import cards_against_humanity.chain as cah
import cards_against_humanity.chain_guard as cah_g
from dotenv import load_dotenv
from langserve import add_routes

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(verbose=True)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/v1/healthz")
def healthz():
    return {"up": True}


@app.get("/")
def index():
    return {"Hello": "World"}


add_routes(app, cah.chain, path="/cah")
add_routes(app, cah_g.chain, path="/cah_g")
