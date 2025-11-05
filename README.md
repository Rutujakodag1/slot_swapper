# Slot Swapper

## Project Overview
Slot Swapper is a web application that allows users to view, swap, and manage event slots efficiently. Users can register, login, book slots, and request swaps with other users. Admins can create, update, and delete events.  

**Design Choices:**
- **Backend:** Django + Django REST Framework for scalable API development.
- **Frontend:** React.js with Tailwind CSS for a modern, responsive UI.
- **Authentication:** JWT (JSON Web Tokens) for secure authentication.
- **Database:** PostgreSQL/MySQL for structured data storage.
- **Deployment:** Frontend deployed on Vercel; backend can be deployed on Render, Heroku, or similar platforms.

---

## Setup and Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Rutujakodag1/slot_swapper.git
   cd slot_swapper/backend
Create a virtual environment:

bash
Copy code
python -m venv venv
Activate the virtual environment:

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Install dependencies:

bash
Copy code
pip install -r requirements.txt
Apply migrations:

bash
Copy code
python manage.py migrate
Start the backend server:

bash
Copy code
python manage.py runserver
Backend will run at http://127.0.0.1:8000/

Frontend Setup
Navigate to the frontend folder:

bash
Copy code
cd ../frontend
Install dependencies:

bash
Copy code
npm install
Start the frontend development server:

bash
Copy code
npm run dev
Frontend will run at http://localhost:5173/ (or the port shown in terminal).

API Endpoints
Method	Endpoint	Description	Access
POST	/api/users/register/	Register a new user	Public
POST	/api/users/login/	Login user	Public
POST	/api/token/	Obtain JWT token	Public
POST	/api/token/refresh/	Refresh JWT token	Public
GET	/api/users/events/	List all events	Authenticated
POST	/api/users/events/	Create a new event	Admin only
GET	/api/users/events/int:pk/	Retrieve a single event	Authenticated
PUT	/api/users/events/int:pk/	Update an event	Admin only
DELETE	/api/users/events/int:pk/	Delete an event	Admin only
GET	/api/users/swappable-slots/	View swappable slots	Authenticated
POST	/api/users/swap-request/	Request a slot swap	Authenticated
POST	/api/users/swap-response/int:request_id/	Accept or reject swap	Authenticated
GET	/api/users/my-swap-requests/	View user swap requests	Authenticated

Optional: Include a Postman collection link if available.

Assumptions & Challenges
Assumed that each user can only hold one slot at a time.

Handled concurrency issues when multiple users try to swap the same slot.

Challenge: Integrating JWT authentication smoothly between frontend and backend, and ensuring role-based access control works properly.

Live Application
You can view the deployed frontend application here: https://slot-swaper.vercel.app/
