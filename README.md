# Slot Swapper

## Project Overview
Slot Swapper is a peer-to-peer time-slot scheduling web application. Users maintain personal calendars with busy slots and can mark certain slots as swappable. Other users can view these swappable slots and request a swap with one of their own swappable slots.

How it works:

Users can register and log in to manage their calendar.

A user can mark a busy slot as swappable, making it visible to others.

Other users can see available swappable slots and request a swap.

Swap requests can be accepted or rejected, and upon acceptance, the slots are exchanged between the two users, updating both calendars automatically.

The system ensures that only swappable slots are offered and prevents conflicts with pending swap requests.

This application demonstrates full-stack development skills, including user authentication with JWT, backend API design, database modeling for users, events, and swap requests, as well as frontend state management for dynamic updates of calendars and swap requests.

**Design Choices:**
- **Backend:** Django + Django REST Framework for scalable API development.
- **Frontend:** React.js with Tailwind CSS for a modern, responsive UI.
- **Authentication:** JWT (JSON Web Tokens) for secure authentication.
- **Database:** SQLite for structured data storage.
- **Deployment:** Frontend deployed on Vercel; backend deployed on Render.

---

## Setup and Installation

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Rutujakodag1/slot_swapper.git
cd slot_swapper/backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start the backend server
python manage.py runserver

```
Backend will run at: http://127.0.0.1:8000/

Frontend Setup
```
# Go to frontend folder
cd ../frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

Frontend will run at: http://localhost:5173/

API Endpoints

| Method | Endpoint                                                   | Description             | Access        |
| ------ | ---------------------------------------------------------- | ----------------------- | ------------- |
| POST   | /api/users/register/                                       | Register a new user     | Public        |
| POST   | /api/users/login/                                          | Login user              | Public        |
| POST   | /api/token/                                                | Obtain JWT token        | Public        |
| POST   | /api/token/refresh/                                        | Refresh JWT token       | Public        |
| GET    | /api/users/events/                                         | List all events         | Authenticated |
| POST   | /api/users/events/                                         | Create a new event      | Admin only    |
| GET    | /api/users/events/[int:pk](int:pk)/                        | Retrieve a single event | Authenticated |
| PUT    | /api/users/events/[int:pk](int:pk)/                        | Update an event         | Admin only    |
| DELETE | /api/users/events/[int:pk](int:pk)/                        | Delete an event         | Admin only    |
| GET    | /api/users/swappable-slots/                                | View swappable slots    | Authenticated |
| POST   | /api/users/swap-request/                                   | Request a slot swap     | Authenticated |
| POST   | /api/users/swap-response/[int:request_id](int:request_id)/ | Accept or reject swap   | Authenticated |
| GET    | /api/users/my-swap-requests/                               | View user swap requests | Authenticated |


Assumptions & Challenges

- Each user can only hold one slot at a time.

- Handled concurrency issues when multiple users try to swap the same slot.
  
- Challenge: Integrating JWT authentication smoothly between frontend and backend and ensuring role-based access control works properly.

Live Application

You can view the deployed frontend application here: https://slot-swaper.vercel.app/
