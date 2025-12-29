"""
Database initialization script
Run this script to create the database tables
"""
from app import app, db
from models import Employee

def init_database():
    """Initialize the database with tables"""
    with app.app_context():
        # Drop all tables (use with caution in production!)
        # db.drop_all()
        
        # Create all tables
        db.create_all()
        print("✓ Database tables created successfully!")
        
        # Optional: Add some sample data
        add_sample_data = input("\nDo you want to add sample data? (y/n): ").lower().strip()
        if add_sample_data == 'y':
            add_sample_employees()
            print("✓ Sample data added successfully!")


def add_sample_employees():
    """Add sample employee data"""
    sample_employees = [
        Employee(
            name="John Doe",
            email="john.doe@example.com",
            phone="+1 (555) 123-4567",
            department="IT",
            position="Software Engineer",
            salary=75000.00,
            date_hired="2023-01-15",
            status="Active"
        ),
        Employee(
            name="Jane Smith",
            email="jane.smith@example.com",
            phone="+1 (555) 234-5678",
            department="HR",
            position="HR Manager",
            salary=85000.00,
            date_hired="2022-06-20",
            status="Active"
        ),
        Employee(
            name="Mike Johnson",
            email="mike.johnson@example.com",
            phone="+1 (555) 345-6789",
            department="Finance",
            position="Financial Analyst",
            salary=68000.00,
            date_hired="2023-03-10",
            status="Active"
        ),
        Employee(
            name="Sarah Williams",
            email="sarah.williams@example.com",
            phone="+1 (555) 456-7890",
            department="Marketing",
            position="Marketing Specialist",
            salary=62000.00,
            date_hired="2023-05-05",
            status="Active"
        ),
        Employee(
            name="Robert Brown",
            email="robert.brown@example.com",
            phone="+1 (555) 567-8901",
            department="Sales",
            position="Sales Representative",
            salary=55000.00,
            date_hired="2022-11-12",
            status="On Leave"
        )
    ]
    
    for employee in sample_employees:
        # Check if employee already exists
        existing = Employee.query.filter_by(email=employee.email).first()
        if not existing:
            db.session.add(employee)
    
    db.session.commit()
    print(f"✓ Added {len(sample_employees)} sample employees")


if __name__ == '__main__':
    print("Initializing Employee Management System Database...")
    print("-" * 50)
    init_database()
    print("-" * 50)
    print("Database initialization complete!")
