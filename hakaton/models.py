from pydantic import BaseModel, EmailStr, Field, field_validator, AnyUrl
from datetime import date, datetime
from typing import Optional, Literal, List
import re

class Contacts(BaseModel):
    phone_number: Optional[str] = Field(default=None, description="Номер телефона в международном формате, начинающийся с '+'")
    email: Optional[EmailStr] = Field(default=None, description="Электронная почта НКО")
    website: Optional[AnyUrl] = Field(default=None, description="Ссылка на вебсайт НКО")
    social_media: Optional[AnyUrl] = Field(default=None, description="Ссылка на социальные сети НКО")

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        if value is None:
            return value
        if not re.match(r'^\+\d{1,15}$', value):
            raise ValueError('Номер телефона должен начинаться с "+" и содержать от 1 до 15 цифр')
        return value
    
class Recurring(BaseModel):
    type: Literal["daily", "weekly", "monthly", "yearly"] = Field(default=..., description="Как часто будет повторяться мероприятия - ежедневно, еженедельно и т.п.")
    end_date: Optional[date] = Field(default=None, description="Конечная дата проведения мероприятия")
    byday: Literal["MO", "TU", "WE", "TH", "FR", "SA", "SU"] = Field(default=..., description="В какой день недели будет проходить мероприятие")

class VolunteerHistory(BaseModel):
    ngo_id: int = Field(default=..., ge=1, description="ID НКО, в которой пользователь был волонтером")
    ngo_name: str = Field(default=..., min_length=1, description="Название НКО, в которой пользователь был волонтером")
    event_id: int = Field(default=..., ge=1, description="ID мероприятия, на котором пользователь был волонтером")
    event_name: str = Field(default=..., min_length=1, description="Название мероприятия, на котором пользователь был волонтером")
    date: datetime = Field(default=..., description="Дата проведения мероприятия")


class NgoCreate(BaseModel):
    name: str = Field(default=..., min_length=1, description="Название НКО")
    ngo_type: str = Field(default=..., description="Тип НКО")
    description: str = Field(default=..., min_length=1, description="Описание НКО")
    contacts: Contacts = Field(default=..., description="Контакты НКО")
    latitude: float = Field(default=..., ge=-90, le=90, description="Широта местоположения НКО")
    longitude: float = Field(default=..., ge=-180, le=180, description="Долгота местоположения НКО")
    logo_url: AnyUrl = Field(default=..., description="Ссылка на логотип НКО")
    ngo_image: AnyUrl = Field(default=..., description="Ссылка на изображение НКО")

class Code(BaseModel): 
    code: str

class EventCreate(BaseModel):
    title: str = Field(default=..., min_length=1, description="Название мероприятия")
    description: str = Field(default=..., min_length=1, description="Описание мероприятия")
    ngo_id: int = Field(..., description="Какое НКО проводит мероприятие")
    date: Optional[datetime] = Field(default=None, description="Дата проведения мероприятия")
    address: Optional[str] = Field(default=None, description="Адрес проведения мероприятия")
    need_volunteers: bool = Field(default=..., description="Нужны ли волонтеры на мероприятии")
    volunteers_count: Optional[int] = Field(default=None, description="Количество зарегистрированных волонтеров")
    recurring: Optional[Recurring] = Field(default=None, description="Будет ли повторяться мероприятие и как часто")
    status: Literal[0, 1] = Field(default=1, description="Активно ли мероприятие")

class NewsCreate(BaseModel):
    title: str = Field(default=..., min_length=1, description="Название новости")
    content: str = Field(default=..., min_length=1, description="Сама новость")
    image_url: AnyUrl = Field(default=..., description="Ссылка на фото новости")

class UserCreate(BaseModel):
    yandexId: str = Field(default=..., min_length=1, description="Yandex ID пользователя")
    first_name: Optional[str] = Field(default=None, description="Имя пользователя")
    last_name: Optional[str] = Field(default=None, description="Фамилия пользователя")
    login: str = Field(default=..., min_length=3, description="Логин пользователя")
    email: EmailStr = Field(default=..., description="Электронная почта пользователя")
    defaultAvatarId: str = Field(default=..., min_length=1, description="ID аватара пользователя")
    defaultEmail: EmailStr = Field(default=..., description="Основная электронная почта пользователя")
    volunteerHistory: Optional[VolunteerHistory] = Field(default=None, description="История волонтерской деятельности пользователя")
    role: Literal["guest", "user", "ngo", "moder", "admin"] = Field(default="user", description="Роль пользователя в системе")