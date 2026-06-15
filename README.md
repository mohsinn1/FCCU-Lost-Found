# FCCU Lost & Found

**Course:** CSCS342 - Web Application Development  
**Project Type:** Semester Project  

FCCU Lost & Found is a full-stack web application that helps FCCU students report,
discover, and recover lost or found belongings across campus.

Students register using their official Formanite email address, verify their account
with a six-digit OTP, and then manage their own item reports. Public users can browse
items and view their details, while authenticated users can report, edit, claim, and
delete their own posts.

## Main Features

- Student registration with FCCU email validation
- Six-digit OTP verification and OTP resend
- Token-based login and logout
- Public lost and found item directory
- Search by title, description, or location
- Category and status filters
- Detailed item pages with reporter information
- Authenticated image upload
- Personal My Items dashboard
- Edit and delete item reports
- Mark an item as claimed
- Protected frontend routes
- Responsive light and dark modes

## How the System Works

1. A student registers with an email in this format:

   ```text
   rollnumber@formanite.fccollege.edu.pk
   ```

2. Django creates an inactive user and generates a six-digit OTP.
3. The OTP is printed in the Django backend terminal because the project uses
   Django's console email backend.
4. The student enters the OTP on the verification page.
5. After successful verification, the account becomes active.
6. Login returns an authentication token, which the frontend stores in
   `localStorage`.
7. The token is included in authenticated API requests:

   ```text
   Authorization: Token <token>
   ```

8. Authenticated students can report and manage their own items.

The OTP remains valid for 10 minutes. Requesting a new OTP replaces the previous
code and restarts the expiry time.

## Technology Stack

### Frontend

- React JS
- React Router
- CSS3
- Fetch API

### Backend

- Python
- Django
- Django REST Framework
- DRF Token Authentication
- Pillow for image validation and processing

### Database and Tools

- SQLite
- Git
- GitHub

## Architecture

The project follows a client-server architecture:

```text
React frontend
      |
      | HTTP requests using Fetch API
      v
Django REST API
      |
      | Models and ORM
      v
SQLite database
```

- React handles the user interface, routing, form state, and API requests.
- Django REST Framework validates requests and contains the application logic.
- Serializers convert model data into JSON and validate incoming data.
- SQLite stores users, profiles, tokens, and item records.
- Uploaded images are stored locally inside the `media/` directory.


## Setup Instructions

### 1. Open the Project

```powershell
cd "D:\programming\CSCS342\{cloned projext directory}"
```

If the project is cloned from GitHub, enter the cloned project directory instead.

### 2. Create and Activate the Python Virtual Environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install Backend Dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Prepare the Database

```powershell
python manage.py migrate
```

### 5. Start the Django Backend

```powershell
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000/
```

Keep this terminal open. Registration and resend requests print the OTP here.

Example console output:

```text
Subject: FCCU Lost & Found verification code
To: 1234567@formanite.fccollege.edu.pk

Your verification code is 123456. It expires in 10 minutes.
```

Console based OTP system is intended only for the Semester Project. 

### 6. Install Frontend Dependencies

Open a second terminal:

```powershell
cd "D:\programming\CSCS342\FCCU Lost n Found\frontend"
npm install
```

### 7. Start the React Frontend

```powershell
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173/
```

Both the Django and React terminals must remain running while using the project.

## User Workflow

### Account Flow

1. Open Register.
2. Enter a valid Formanite email, full name, and password.
3. Read the OTP from the Django terminal.
4. Enter the OTP on the verification page.
5. Log in using the verified account.

### Item Flow

1. Browse public lost and found reports.
2. Use search, category, and status filters.
3. Open a card to view complete item and reporter information.
4. Log in to report an item with an image.
5. Open My Items to manage personal reports.
6. Edit information, mark an item as claimed, or delete it.

## API Endpoints

### Accounts

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/accounts/register/` | Register a student | Public |
| POST | `/api/accounts/verify-otp/` | Verify the six-digit OTP | Public |
| POST | `/api/accounts/resend-otp/` | Generate and resend an OTP | Public |
| POST | `/api/accounts/login/` | Log in and receive a token | Public |
| POST | `/api/accounts/logout/` | Delete the current token | Authenticated |

### Items

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/items/` | Browse and filter items | Public |
| POST | `/api/items/` | Report an item | Authenticated |
| GET | `/api/items/<id>/` | View one item | Public |
| PATCH | `/api/items/<id>/` | Edit an owned item | Owner only |
| DELETE | `/api/items/<id>/` | Delete an owned item | Owner only |
| GET | `/api/items/my-items/` | View personal reports | Authenticated |
| PATCH | `/api/items/<id>/mark-claimed/` | Mark an owned item claimed | Owner only |

Filtering examples:

```text
/api/items/?search=wallet
/api/items/?category=Electronics
/api/items/?status=Lost
/api/items/?search=library&category=ID&status=Found
```

## Important Implementation Details

- Passwords are created through Django's `create_user()` method and are hashed.
- New users remain inactive until OTP verification succeeds.
- Item images are sent as `multipart/form-data`.
- The browser sets the multipart content type automatically when using `FormData`.
- Only an item's creator can edit, delete, or mark it as claimed.
- Reporter roll number is derived from the digits before `@` in the FCCU email.
- React protected routes redirect logged-out users to the Login page.
- Light or dark theme preference is saved in `localStorage`.

## Development Checks

Backend checks:

```powershell
python manage.py check
python manage.py makemigrations --check --dry-run
```

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

## Development Notes

- SQLite database and uploaded media are excluded from Git.
- The secret key is currently stored in the development settings file.

## Learning Outcomes

This project demonstrates:

- React components, props, state, effects, and controlled forms
- Client-side routing and protected routes
- Fetch API requests and asynchronous JavaScript
- Django models, migrations, views, and ORM queries
- Django REST Framework serializers and generic API views
- Token authentication and ownership permissions
- File uploads and multipart form submission
- Frontend-backend integration through REST APIs
- Git-based project development
