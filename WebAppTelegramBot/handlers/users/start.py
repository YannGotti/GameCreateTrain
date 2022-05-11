from aiogram.types import KeyboardButton, ReplyKeyboardMarkup
import markups as nav
from aiogram.dispatcher.filters import Text
from aiogram import Dispatcher, types
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from loader import dp, bot
from services.service import *



@dp.message_handler(commands=['start'], state=None)
async def start(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="😎 WEB APP", web_app=WebAppInfo(url=f"https://127.0.0.1:8000/"))]
    ])
    await message.reply("TEST WEB APP", reply_markup=keyboard)

      
