from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_together import ChatTogether

TOGETHER_API_KEY = "TOGETHER_API_KEY"

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            'can you generate 4 white cards for cards against humanity in the theme of "{theme} against humanity". make sure these white cards work well with the black card "{black}", are witty and edgy with occassional NSFW (not safe for work). give our output as a JSON array of strings such as ["foo","bar"]`.',
        )
    ]
)

model = ChatTogether(
    together_api_key=TOGETHER_API_KEY,
    model="NousResearch/Nous-Hermes-2-Yi-34B",
    max_tokens=3072,
)


def parse(ai_message: AIMessage) -> str:
    return ai_message.content


chain = prompt | model | parse
