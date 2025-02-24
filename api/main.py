
import logging
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from chat import Chatbot

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class Message(BaseModel):
    system_prompt: str = Field(
        "You are a helpful assistant",
        title="System Prompt",
        description="The system prompt for the LLM",
    )
    user_input: str = Field(
        "Tell me a joke", title="User Input", description="The user input to respond to"
    )
    temperature: float = Field(
        0.7,
        title="Temperature",
        description="The temperature of the model",
        ge=0.0,
        le=1.0,
    )
    model_name: str = Field(
        "gpt-4o", title="Model Name", description="The name of the model to use"
    )


def startup():
    load_dotenv()
    logger.info("Starting up ChatAPI")


app = FastAPI()
app.add_event_handler("startup", startup)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)


@app.post("/chat")
async def chat_bot(message: Message):
    chatbot = Chatbot(
        system_prompt=message.system_prompt,
        temperature=message.temperature,
        model_name=message.model_name,
    )
    response = chatbot.get_response(message.user_input)
    logging.info("User input: %s", message.user_input)
    return {"response": response}
