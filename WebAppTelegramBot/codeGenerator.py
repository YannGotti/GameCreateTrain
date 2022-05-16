import random
from services.service import *


symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
code = "AAAAAA"
code_list = list(code)

def generator():
    for i in range(6):
        rand = random.randint(0, 25)
        code_list[i] = symbols[rand]
    str = ''.join(code_list)
    if (not codeExists(str)):
        return str