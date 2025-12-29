# Employee Management System

A modern, responsive web-based Employee Management System built with HTML, CSS, JavaScript (frontend) and Flask with PostgreSQL (backend). This application allows you to efficiently manage your workforce with full CRUD (Create, Read, Update, Delete) operations.

## Features

- ✅ **Add Employees** - Create new employee records with comprehensive information
- ✅ **Edit Employees** - Update existing employee details
- ✅ **Delete Employees** - Remove employee records with confirmation
- ✅ **Search Functionality** - Search employees by name, email, department, or position
- ✅ **Filter Options** - Filter employees by department and employment status
- ✅ **Statistics Dashboard** - View total employees and active employee count
- ✅ **Responsive Design** - Fully responsive layout that works on desktop, tablet, and mobile devices
- ✅ **PostgreSQL Database** - Robust database backend with SQLAlchemy ORM
- ✅ **RESTful API** - Clean API design for all operations
- ✅ **Modern UI** - Clean, professional interface with smooth animations

## Technology Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- JavaScript (ES6+)
- Fetch API for API calls

### Backend
- Python 3.8+
- Flask (Web Framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Flask-CORS (Cross-Origin Resource Sharing)

## Employee Fields

Each employee record includes:
- Full Name
- Email Address (unique)
- Phone Number
- Department (IT, HR, Finance, Marketing, Sales, Operations)
- Position/Job Title
- Salary
- Date Hired
- Employment Status (Active, On Leave, Terminated)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Python** (3.8 or higher)
   - Download from [python.org](https://www.python.org/downloads/)

2. **PostgreSQL** (12 or higher)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Make sure PostgreSQL service is running

3. **pip** (Python package manager - comes with Python)

## Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd employee-management-system
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Set Up PostgreSQL Database

1. **Create PostgreSQL Database:**

   Open PostgreSQL command line or pgAdmin and run:

   ```sql
   CREATE DATABASE employee_management;
   ```

   Or use command line:

   ```bash
   createdb -U postgres employee_management
   ```

2. **Configure Database Connection:**

   Create a `.env` file in the project root (copy from `env.example`):

   ```bash
   # On Windows:
   copy env.example .env

   # On macOS/Linux:
   cp env.example .env
   ```

3. **Edit `.env` file** with your PostgreSQL credentials:

   ```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_management
   FLASK_DEBUG=True
   SECRET_KEY=your-secret-key-here
   ```

### Step 5: Initialize Database Tables

```bash
python init_db.py
```

This will create the necessary database tables. You can optionally add sample data when prompted.

### Step 6: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

Open your web browser and navigate to: `http://localhost:5000`

## Project Structure

```
Employee Management System/
│
├── app.py                 # Main Flask application
├── models.py              # SQLAlchemy database models
├── config.py              # Configuration settings
├── init_db.py             # Database initialization script
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create from env.example)
├── env.example            # Example environment variables
├── .gitignore            # Git ignore file
├── index.html            # Main HTML file
├── styles.css            # CSS styles
├── script.js             # Frontend JavaScript
└── README.md             # This file
```

## API Endpoints

The application provides the following REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees (supports search, filter) |
| GET | `/api/employees/<id>` | Get a single employee by ID |
| POST | `/api/employees` | Create a new employee |
| PUT | `/api/employees/<id>` | Update an existing employee |
| DELETE | `/api/employees/<id>` | Delete an employee |
| GET | `/api/employees/stats` | Get employee statistics |

### Query Parameters

- `search`: Search by name, email, department, or position
- `department`: Filter by department
- `status`: Filter by employment status

### Example API Calls

```bash
# Get all employees
GET http://localhost:5000/api/employees

# Search employees
GET http://localhost:5000/api/employees?search=john

# Filter by department
GET http://localhost:5000/api/employees?department=IT

# Get statistics
GET http://localhost:5000/api/employees/stats
```

## Usage

1. **Add an Employee**: Fill out the form at the top of the page and click "Add Employee"
2. **Edit an Employee**: Click the "Edit" button next to any employee in the table
3. **Delete an Employee**: Click the "Delete" button and confirm the deletion
4. **Search**: Type in the search box to find employees by name, email, or department
5. **Filter**: Use the dropdown filters to filter by department or status
6. **View Statistics**: Check the stat cards to see total and active employee counts

## Database Schema

The `employees` table has the following structure:

```sql
- id (INTEGER, PRIMARY KEY)
- name (VARCHAR(100), NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL)
- phone (VARCHAR(20), NOT NULL)
- department (VARCHAR(50), NOT NULL)
- position (VARCHAR(100), NOT NULL)
- salary (NUMERIC(10, 2), NOT NULL)
- date_hired (DATE, NOT NULL)
- status (VARCHAR(20), NOT NULL, DEFAULT 'Active')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Configuration

All configuration is managed through the `.env` file. Key settings:

- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host (usually localhost)
- `DB_PORT`: Database port (usually 5432)
- `DB_NAME`: Database name
- `FLASK_DEBUG`: Enable/disable debug mode
- `SECRET_KEY`: Secret key for Flask sessions

## Troubleshooting

### Database Connection Errors

- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Check if the database exists: `psql -U postgres -l`
- Test connection: `psql -U postgres -d employee_management`

### Port Already in Use

If port 5000 is already in use, you can change it in `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Change port number
```

### Module Not Found Errors

- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### CORS Issues

If you're running frontend and backend on different ports, CORS is already enabled in the Flask app. If issues persist, check the CORS configuration in `app.py`.

## Production Deployment

For production deployment:

1. Set `FLASK_DEBUG=False` in `.env`
2. Change `SECRET_KEY` to a strong random key
3. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
4. Use a reverse proxy like Nginx
5. Configure PostgreSQL for production (backups, security, etc.)

## Browser Compatibility

This application works on all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

**Enjoy managing your employees!** 🚀