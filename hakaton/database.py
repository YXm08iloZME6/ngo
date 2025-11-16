from sqlalchemy import create_engine, Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, DeclarativeBase, relationship

SQLALCHEMY_DATABASE_URL = "sqlite:///test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

class Base(DeclarativeBase): 
    pass

class Ngo(Base):
    __tablename__ = "ngos"
    
    id = Column(Integer, primary_key=True, index=True)
    Name = Column(String)
    Type = Column(String)
    Description = Column(Text)
    Contacts = Column(Text)
    Latitude = Column(Float)
    Longitude = Column(Float)
    LogoUrl = Column(String)
    NgoImageUrl = Column(String)

    events = relationship('Events', back_populates="ngo")

class Events(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    Title = Column(Text)
    Description = Column(Text)
    ngoId = Column(Integer, ForeignKey('ngos.id'))
    Date = Column(String)
    Address = Column(Text)
    NeedVolunteers = Column(Integer)
    VolunteersCount = Column(Integer)
    Recurring = Column(Text)
    Status = Column(Integer)

    ngo = relationship('Ngo', back_populates="events")

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    Title = Column(Text)
    Content = Column(Text)
    ImageUrl = Column(Text)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    YandexId = Column(String)
    FirstName = Column(String)
    LastName = Column(String)
    Login = Column(String)
    Email = Column(String)
    DefaultAvatarId = Column(String)
    DefaultEmail = Column(String)
    VolunteerHistory = Column(Text)
    Role = Column(String)

class Course(Base):
    __tablename__ = "courses"  
    id = Column(Integer, primary_key=True) 
    Title = Column(String, nullable=False) 
    Tags = Column(String, nullable=False)
    videos = relationship("Video", back_populates="course")

class Cities(Base):
    __tablename__ = "cities"  
    id = Column(Integer, primary_key=True) 
    Name = Column(String, nullable=False)
    Latitude = Column(Float)
    Longitude = Column(Float)

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True) 
    CourseID = Column(Integer, ForeignKey("courses.id"), nullable=False, index=True)
    Link = Column(String, nullable=False)
    Title = Column(String, nullable=False)
    Speaker = Column(String, nullable=False)
    course = relationship("Course", back_populates="videos")

SessionLocal = sessionmaker(autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
