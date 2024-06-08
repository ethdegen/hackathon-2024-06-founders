from cards_against_humanity.chain import chain as cah
from guardrails_output_parser.chain import chain as gop

chain = cah | gop
