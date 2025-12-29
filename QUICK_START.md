# Quick Start Guide

## Prerequisites Check
- [ ] Python 3.8+ installed
- [ ] PostgreSQL installed and running
- [ ] pip installed

## Setup Steps (5 minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Create PostgreSQL Database
```bash
# Using psql command line
createdb -U postgres employee_management

# Or using SQL
psql -U postgres
CREATE DATABASE employee_management;
\q
```

### 3. Configure Environment
```bash
# Copy environment file
copy env.example .env    # Windows
cp env.example .env      # macOS/Linux

# Edit .env file with your PostgreSQL credentials
# At minimum, update:
# DB_PASSWORD=your_postgres_password
```

### 4. Initialize Database
```bash
python init_db.py
# Choose 'y' if you want sample data
```

### 5. Run Application
```bash
python app.py
```

### 6. Open in Browser
Navigate to: **http://localhost:5000**

## Troubleshooting

**Database Connection Error?**
- Check PostgreSQL is running: `pg_isready` or check services
- Verify credentials in `.env` file
- Test connection: `psql -U postgres -d employee_management`

**Module Not Found?**
- Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (macOS/Linux)
- Install dependencies: `pip install -r requirements.txt`

**Port Already in Use?**
- Change port in `app.py`: `app.run(debug=True, host='0.0.0.0', port=5000)`
- Or kill process using port 5000

## Default Configuration
- Database: `employee_management`
- Host: `localhost`
- Port: `5432` (PostgreSQL), `5000` (Flask)
- User: `postgres` (default, change in .env)

## Next Steps
- Add your first employee through the web interface
- Explore the API endpoints (see README.md)
- Customize the application for your needs

Happy coding! 🚀
