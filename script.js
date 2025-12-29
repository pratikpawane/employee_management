// Employee Management System - JavaScript

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Application state
let employees = [];
let currentEditId = null;
let deleteId = null;
let isLoading = false;

// DOM Elements
const employeeForm = document.getElementById('employee-form');
const employeeTableBody = document.getElementById('employee-table-body');
const searchInput = document.getElementById('search-input');
const filterDepartment = document.getElementById('filter-department');
const filterStatus = document.getElementById('filter-status');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const deleteModal = document.getElementById('delete-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    updateStats();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    employeeForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel edit
    cancelBtn.addEventListener('click', cancelEdit);
    
    // Search and filter
    searchInput.addEventListener('input', handleSearchFilter);
    filterDepartment.addEventListener('change', handleSearchFilter);
    filterStatus.addEventListener('change', handleSearchFilter);
    
    // Modal events
    confirmDeleteBtn.addEventListener('click', confirmDelete);
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('show');
        deleteId = null;
    });
    
    // Close modal on outside click
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('show');
            deleteId = null;
        }
    });
}

// Handle Form Submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const formData = new FormData(employeeForm);
    const employeeData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        department: formData.get('department'),
        position: formData.get('position').trim(),
        salary: parseFloat(formData.get('salary')),
        dateHired: formData.get('date-hired'),
        status: formData.get('status')
    };
    
    try {
        isLoading = true;
        submitBtn.disabled = true;
        submitBtn.textContent = currentEditId ? 'Updating...' : 'Adding...';
        
        let response;
        if (currentEditId) {
            // Update existing employee
            response = await fetch(`${API_BASE_URL}/employees/${currentEditId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        } else {
            // Create new employee
            response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message || (currentEditId ? 'Employee updated successfully!' : 'Employee added successfully!'), 'success');
            employeeForm.reset();
            cancelEdit();
            await loadEmployees();
            await updateStats();
        } else {
            showNotification(data.error || 'An error occurred', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check if the server is running.', 'error');
    } finally {
        isLoading = false;
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? 'Update Employee' : 'Add Employee';
    }
}

// Load Employees from API
async function loadEmployees() {
    try {
        const searchTerm = searchInput.value.trim();
        const departmentFilter = filterDepartment.value;
        const statusFilter = filterStatus.value;
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (departmentFilter) params.append('department', departmentFilter);
        if (statusFilter) params.append('status', statusFilter);
        
        const url = `${API_BASE_URL}/employees${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            employees = data.employees;
            renderTable();
        } else {
            showNotification(data.error || 'Failed to load employees', 'error');
            employees = [];
            renderTable();
        }
    } catch (error) {
        console.error('Error loading employees:', error);
        showNotification('Network error. Please check if the server is running.', 'error');
        employees = [];
        renderTable();
    }
}

// Render Employee Table
function renderTable() {
    if (employees.length === 0) {
        employeeTableBody.innerHTML = '<tr class="empty-row"><td colspan="10">No employees found. Add your first employee above!</td></tr>';
        return;
    }
    
    employeeTableBody.innerHTML = employees.map(employee => `
        <tr>
            <td>${employee.id}</td>
            <td><strong>${escapeHtml(employee.name)}</strong></td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.phone)}</td>
            <td>${escapeHtml(employee.department)}</td>
            <td>${escapeHtml(employee.position)}</td>
            <td>$${formatNumber(employee.salary)}</td>
            <td>${formatDate(employee.dateHired)}</td>
            <td><span class="status-badge status-${employee.status.toLowerCase().replace(' ', '-')}">${employee.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-success btn-small" onclick="editEmployee(${employee.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteEmployee(${employee.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Edit Employee
async function editEmployee(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const employee = data.employee;
            currentEditId = id;
            
            // Fill form with employee data
            document.getElementById('employee-id').value = employee.id;
            document.getElementById('name').value = employee.name;
            document.getElementById('email').value = employee.email;
            document.getElementById('phone').value = employee.phone;
            document.getElementById('department').value = employee.department;
            document.getElementById('position').value = employee.position;
            document.getElementById('salary').value = employee.salary;
            document.getElementById('date-hired').value = employee.dateHired;
            document.getElementById('status').value = employee.status;
            
            // Update UI
            formTitle.textContent = 'Edit Employee';
            submitBtn.textContent = 'Update Employee';
            cancelBtn.style.display = 'inline-flex';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            showNotification(data.error || 'Failed to load employee', 'error');
        }
    } catch (error) {
        console.error('Error loading employee:', error);
        showNotification('Network error. Please check if the server is running.', 'error');
    }
}

// Cancel Edit
function cancelEdit() {
    currentEditId = null;
    employeeForm.reset();
    formTitle.textContent = 'Add New Employee';
    submitBtn.textContent = 'Add Employee';
    cancelBtn.style.display = 'none';
    document.getElementById('employee-id').value = '';
}

// Delete Employee
function deleteEmployee(id) {
    deleteId = id;
    deleteModal.classList.add('show');
}

// Confirm Delete
async function confirmDelete() {
    if (!deleteId) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${deleteId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message || 'Employee deleted successfully!', 'success');
            deleteModal.classList.remove('show');
            const idToDelete = deleteId;
            deleteId = null;
            await loadEmployees();
            await updateStats();
        } else {
            showNotification(data.error || 'Failed to delete employee', 'error');
            deleteModal.classList.remove('show');
            deleteId = null;
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Network error. Please check if the server is running.', 'error');
        deleteModal.classList.remove('show');
        deleteId = null;
    }
}

// Handle Search and Filter
async function handleSearchFilter() {
    await loadEmployees();
}

// Update Statistics
async function updateStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/stats`);
        const data = await response.json();
        
        if (data.success) {
            totalCount.textContent = data.stats.total;
            activeCount.textContent = data.stats.active;
        } else {
            // Fallback to local count if API fails
            totalCount.textContent = employees.length;
            const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
            activeCount.textContent = activeEmployees;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to local count if API fails
        totalCount.textContent = employees.length;
        const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
        activeCount.textContent = activeEmployees;
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    // Add animation style if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add slideOut animation
    if (!document.getElementById('notification-styles').textContent.includes('slideOut')) {
        const style = document.getElementById('notification-styles');
        style.textContent += `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
    }
}

// Make functions available globally for inline event handlers
window.editEmployee = editEmployee;
window.deleteEmployee = deleteEmployee;
