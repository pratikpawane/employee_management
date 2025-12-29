from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import db, Employee
from config import Config
import os

app = Flask(__name__, static_folder='.', static_url_path='')
app.config.from_object(Config)

# Enable CORS for all routes
CORS(app)

# Initialize database
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS)"""
    return send_from_directory('.', path)


@app.route('/api/employees', methods=['GET'])
def get_employees():
    """Get all employees with optional search and filter"""
    try:
        search = request.args.get('search', '').strip()
        department = request.args.get('department', '').strip()
        status = request.args.get('status', '').strip()
        
        query = Employee.query
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Employee.name.ilike(search_term),
                    Employee.email.ilike(search_term),
                    Employee.department.ilike(search_term),
                    Employee.position.ilike(search_term)
                )
            )
        
        # Apply department filter
        if department:
            query = query.filter(Employee.department == department)
        
        # Apply status filter
        if status:
            query = query.filter(Employee.status == status)
        
        employees = query.order_by(Employee.id.desc()).all()
        
        return jsonify({
            'success': True,
            'employees': [emp.to_dict() for emp in employees]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/employees/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    """Get a single employee by ID"""
    try:
        employee = Employee.query.get_or_404(employee_id)
        return jsonify({
            'success': True,
            'employee': employee.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404


@app.route('/api/employees', methods=['POST'])
def create_employee():
    """Create a new employee"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'department', 'position', 'salary', 'dateHired', 'status']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Check if email already exists
        existing_employee = Employee.query.filter_by(email=data['email']).first()
        if existing_employee:
            return jsonify({
                'success': False,
                'error': 'Employee with this email already exists'
            }), 400
        
        # Create new employee
        employee = Employee(
            name=data['name'].strip(),
            email=data['email'].strip().lower(),
            phone=data['phone'].strip(),
            department=data['department'],
            position=data['position'].strip(),
            salary=float(data['salary']),
            date_hired=data['dateHired'],
            status=data['status']
        )
        
        db.session.add(employee)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Employee created successfully',
            'employee': employee.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid data: {str(e)}'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    """Update an existing employee"""
    try:
        employee = Employee.query.get_or_404(employee_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            employee.name = data['name'].strip()
        if 'email' in data:
            # Check if email is being changed and if it already exists
            new_email = data['email'].strip().lower()
            if new_email != employee.email:
                existing_employee = Employee.query.filter_by(email=new_email).first()
                if existing_employee:
                    return jsonify({
                        'success': False,
                        'error': 'Employee with this email already exists'
                    }), 400
            employee.email = new_email
        if 'phone' in data:
            employee.phone = data['phone'].strip()
        if 'department' in data:
            employee.department = data['department']
        if 'position' in data:
            employee.position = data['position'].strip()
        if 'salary' in data:
            employee.salary = float(data['salary'])
        if 'dateHired' in data:
            employee.date_hired = data['dateHired']
        if 'status' in data:
            employee.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Employee updated successfully',
            'employee': employee.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid data: {str(e)}'
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    """Delete an employee"""
    try:
        employee = Employee.query.get_or_404(employee_id)
        db.session.delete(employee)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Employee deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/employees/stats', methods=['GET'])
def get_stats():
    """Get employee statistics"""
    try:
        total = Employee.query.count()
        active = Employee.query.filter_by(status='Active').count()
        
        return jsonify({
            'success': True,
            'stats': {
                'total': total,
                'active': active
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    db.session.rollback()
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    # In production, use a proper WSGI server like Gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)
