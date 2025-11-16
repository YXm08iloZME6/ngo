from database import *
import json
from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime, timedelta
from jose import jwt
from models import NgoCreate, NewsCreate, EventCreate, UserCreate, Code

# async def get_token(code):
#     token_url = "https://oauth.yandex.ru/token"
#     data = {
#         "grant_type": "authorization_code",
#         "code": code,
#         "client_id": "",
#         "client_secret": ""
#     }
#     async with httpx.AsyncClient() as client:
#         response = await client.post(token_url, data=data)
        
#     token_data = response.json()
#     return token_data.get("access_token")

# async def get_user_info(token):
#     info_url = "https://login.yandex.ru/info"
#     headers = {"Authorization": f"OAuth {token}"}
    
#     async with httpx.AsyncClient() as client:
#         response = await client.get(info_url, headers=headers)
        
#     user_data = {**response.json()}
#     return user_data

# async def create_token(data):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(minutes=30)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, "test", algorithm="HS256")
#     return encoded_jwt


Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

@app.get("/")
def main():
    return FileResponse("public/index.html")

@app.get("/api/ngos")
def get_ngos(db: Session = Depends(get_db)):
    return db.query(Ngo).all()

@app.get("/api/cities")
def get_cities(db: Session = Depends(get_db)):
    return db.query(Cities).all()

@app.get("/api/ngos/{ngo_id}")
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(Ngo).filter(Ngo.id == ngo_id).first()
    if ngo is None:  
        raise HTTPException(status_code=404, detail="НКО не найдена")
    return ngo

@app.get("/api/ngos/{ngo_id}/events")
def get_ngo_events(ngo_id: int, db: Session = Depends(get_db)):
    events = db.query(Events).filter(Events.ngoId == ngo_id).all()
    return events

@app.get("/api/events")
def get_events(db: Session = Depends(get_db)):
    events = db.query(Events).all()
    return events

@app.get("/api/news") 
def get_news(db: Session = Depends(get_db)):
    news = db.query(News).all()
    return news

@app.get("/api/courses") 
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses

@app.get("/api/courses/{course_id}") 
def get_videos(course_id: int, db: Session = Depends(get_db)):
    
    videos = db.query(Video).filter(Video.CourseID == course_id).all()
    course = db.query(Course).filter(Course.id == course_id).first()
    res = {"videos": videos, "course": course}
    return res


# @app.post("/api/auth")
# async def auth(code: Code, db: Session = Depends(get_db)):
#     token = await get_token(code.code)
#     user_info = await get_user_info(token)
    
#     user_data = UserCreate(
#         yandexId=user_info["id"],
#         login=user_info["login"],
#         first_name=user_info.get("first_name"),
#         last_name=user_info.get("last_name"),
#         email=user_info["default_email"],
#         defaultEmail=user_info["default_email"],
#         defaultAvatarId=user_info["default_avatar_id"]
#     )

#     user = db.query(User).filter(User.YandexId == user_data.yandexId).first()

#     if not user:
#         user = User(
#             YandexId=user_data.yandexId,
#             FirstName=user_data.first_name,
#             LastName=user_data.last_name,
#             Login=user_data.login,
#             Email=user_data.email,
#             DefaultAvatarId=user_data.defaultAvatarId,
#             DefaultEmail=user_data.defaultEmail,
#             VolunteerHistory="[]",
#             Role="user"
#         )
#         db.add(user)
#         db.commit()
#         db.refresh(user)

#     token_data = {"sub": user.Email, "user_id": user.YandexId}
#     app_access_token = await create_token(data=token_data)

#     return {
#         "access_token": app_access_token,
#         "token_type": "bearer",
#         "user": {
#             "id": user.id,
#             "email": user.Email,
#             "login": user.Login,
#             "role": user.Role
#         }
#     }

# @app.post("/api/admin/save-ngo")
# async def save_ngo(ngo_data: NgoCreate, db: Session = Depends(get_db)):
#     contacts_dict = {
#         "phone_number": str(ngo_data.contacts.phone_number) if ngo_data.contacts.phone_number else None,
#         "email": str(ngo_data.contacts.email) if ngo_data.contacts.email else None,
#         "website": str(ngo_data.contacts.website) if ngo_data.contacts.website else None,
#         "social_media": str(ngo_data.contacts.social_media) if ngo_data.contacts.social_media else None
#     }
    
#     ngo = Ngo(
#         Name = ngo_data.name,
#         Type = ngo_data.ngo_type,
#         Description = ngo_data.description,
#         Contacts = json.dumps(contacts_dict, ensure_ascii=False),
#         Latitude = ngo_data.latitude,
#         Longitude = ngo_data.longitude,
#         LogoUrl = str(ngo_data.logo_url),
#         NgoImageUrl = str(ngo_data.ngo_image)
#     )

#     db.add(ngo)
#     db.commit()

# @app.post("/api/admin/save-event")
# async def save_event(event_data: EventCreate, db: Session = Depends(get_db)):
#     recurring_dict = {
#     "type": str(event_data.recurring.type) if event_data.recurring.type else None,
#     "end_date": event_data.recurring.end_date.isoformat() if event_data.recurring and event_data.recurring.end_date else None,
#     "byday": event_data.recurring.byday if event_data.recurring.byday else None,
#         } if event_data.recurring else None
    
#     event = Events(
#         Title = event_data.title,
#         Description = event_data.description,
#         ngoId = event_data.ngo_id,
#         Date = str(event_data.date),
#         Address = event_data.address,
#         NeedVolunteers = event_data.need_volunteers,
#         VolunteersCount = event_data.volunteers_count,
#         Recurring = json.dumps(recurring_dict, ensure_ascii=False) if recurring_dict else None,
#         Status = event_data.status
#     )

#     db.add(event)
#     db.commit()

# @app.post("/api/admin/save-news")
# async def save_news(news_data: NewsCreate, db: Session = Depends(get_db)):
#     news = News(
#         Title = news_data.title,
#         Content = news_data.content,
#         ImageUrl = str(news_data.image_url)
#     )

    # db.add(news)
    # db.commit()