from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
import markups as nav
from aiogram.dispatcher.filters import Text
from aiogram import Dispatcher, types
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from loader import dp, bot
from services.service import *
from codeGenerator import *



@dp.message_handler(commands=['start'], state=None)
async def start(message: types.Message):
    code = generator()
    if (not userExists(message.chat.id)):
        addUser(message.chat.id, message.from_user.username, code)
    else:
        codeUpdate(message.chat.id, code)
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="😎 WEB APP", web_app=WebAppInfo(url=f"https://127.0.0.1:8000"))]
    ])
    await message.reply("TEST WEB APP", reply_markup=keyboard)
    await message.answer(f"Ваш код для авторизации <b>{code}</b>\nНикому не сообщайте свой код!")




      
