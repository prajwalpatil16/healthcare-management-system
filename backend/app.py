from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
import os
import bcrypt  # For hashing passwords securely
import jwt     # For token-based authentication
from functools import wraps # For creating decorators
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta


# =================================================
# APP CONFIGURATION
# =================================================

app = Flask(__name__)
# CORS (Cross-Origin Resource Sharing) is essential for allowing your 
# React frontend (running on a different port) to talk to this Flask backend.
CORS(app) 

# Security Key for JWT tokens - In production, this should be an environment variable!
app.config['SECRET_KEY'] = 'your_super_secret_hospital_key_123'



# =================================================
# FILE UPLOAD DIRECTORIES
# =================================================

UPLOAD_NEWS = "uploads/news"
UPLOAD_DOCTORS = "uploads/doctors"

os.makedirs(UPLOAD_NEWS, exist_ok=True)
os.makedirs(UPLOAD_DOCTORS, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_DOCTORS

# =================================================
# DATABASE CONNECTION
# =================================================

def get_db_connection():
    """
    Create and return a MySQL database connection.
    We use DictCursor so that results are returned as dictionaries (e.g., {'id': 1, 'name': 'John'})
    instead of tuples (e.g., (1, 'John')), which is much easier to work with in JSON APIs.
    """
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Prajwal@16",
        database="hospital_db",
        cursorclass=pymysql.cursors.DictCursor
    )

# =================================================
# SECURITY HELPERS
# =================================================

def hash_password(password):
    """
    Hash a plain-text password using bcrypt.
    Why? If the database is ever leaked, hackers won't see actual passwords.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password, hashed):
    """
    Compare a plain-text password with its hashed version from the DB.
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def token_required(f):
    """
    Decorator to protect routes from unauthorized access.
    It checks if a valid 'Authorization' header is present in the request.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Token usually comes as "Bearer <token>", so we split it
            data = jwt.decode(token.split(" ")[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

def admin_required(f):
    """
    Decorator to restrict access ONLY to users with 'admin' role.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token.split(" ")[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            if data.get('role') != 'admin':
                return jsonify({'message': 'Admin access required!'}), 403
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# =================================================
# AUTH MODULE
# =================================================

@app.post("/api/register")
def register():
    """
    Register a new patient.
    1. Check for missing fields.
    2. Check if email already exists (security best practice).
    3. Hash the password before saving (NEVER save plain-text passwords!).
    4. Save to database.
    """
    data = request.json

    # Simple validation: ensure name, email, phone, and password are provided
    if not all([data.get("name"), data.get("email"),
                data.get("phone"), data.get("password")]):
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Security: check if email already exists to prevent duplicate accounts
    cursor.execute("SELECT id FROM users WHERE email=%s", (data["email"],))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already exists"}), 409

    # SECURE: Hash the password using bcrypt
    hashed_pw = hash_password(data["password"])

    try:
        cursor.execute("""
            INSERT INTO users (name, email, phone, password, role)
            VALUES (%s, %s, %s, %s, 'patient')
        """, (
            data["name"], data["email"],
            data["phone"], hashed_pw
        ))
        conn.commit()
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({"message": "Server error during registration"}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Registration successful"}), 201


@app.post("/api/login")
def login():
    """
    Login user and return a JWT token.
    1. Fetch user by email.
    2. Verify hashed password.
    3. If valid, create a JWT token with user info and expiry.
    """
    data = request.json

    if not all([data.get("email"), data.get("password")]):
        return jsonify({"message": "Missing credentials"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Step 1: Find the user by email
    cursor.execute("""
        SELECT id, name, email, password, role
        FROM users
        WHERE email=%s
    """, (data["email"],))

    user = cursor.fetchone()
    cursor.close()
    conn.close()
    # Step 2: Verify if user exists and password is correct
    if user and check_password(data["password"], user["password"]):
        # SECURE: Generate a JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        # In some older PyJWT versions, encode() returns bytes. 
        # We must ensure it's a string for JSON serialization.
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        # Don't send the hashed password back to the frontend!
        del user['password']
        
        print(f"Login successful for: {user['email']}") # Debug print

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user
        })

    # Generic error message (don't reveal if email or password was the specific failure)
    return jsonify({"message": "Invalid email or password"}), 401

# =================================================
# DOCTOR MANAGEMENT (ADMIN)
# =================================================

@app.post("/api/admin/doctors")
@admin_required
def add_doctor(admin_id):
    """
    Add a new doctor to the system.
    This route is protected by @admin_required, meaning only logged-in 
    admins with a valid token can access it.
    """
    form = request.form
    # Files (like photos) are accessed via request.files
    photo = request.files.get("photo")

    # Basic validation
    if not all([form.get("name"), form.get("email"), form.get("department")]):
        return jsonify({"message": "Missing required fields"}), 400

    # Handling File Upload
    photo_filename = None
    if photo:
        # Get the file extension (e.g., .jpg)
        ext = os.path.splitext(photo.filename)[1]
        # Secure the filename by using a timestamp to avoid duplicates
        photo_filename = f"{int(datetime.now().timestamp())}{ext}"
        # Save the file to the uploads/doctors folder
        photo.save(os.path.join(UPLOAD_DOCTORS, photo_filename))

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if email already in users
        cursor.execute("SELECT id FROM users WHERE email=%s", (form.get("email"),))
        user_row = cursor.fetchone()
        
        if (not user_row):
            # Create a user account for the doctor
            # Use the password provided by the admin
            password = form.get("password", "Doctor@123") # Fallback to default if missing
            hashed_pw = hash_password(password)
            cursor.execute("""
                INSERT INTO users (name, email, phone, password, role)
                VALUES (%s, %s, %s, %s, 'doctor')
            """, (form.get("name"), form.get("email"), form.get("phone"), hashed_pw))
            user_id = conn.insert_id()
        else:
            user_id = user_row["id"]
            # Ensure role is doctor
            cursor.execute("UPDATE users SET role='doctor' WHERE id=%s", (user_id,))

        cursor.execute("""
            INSERT INTO doctors
            (name, email, phone, department, specialization, experience, photo, user_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            form.get("name"), form.get("email"),
            form.get("phone"), form.get("department"),
            form.get("specialization"), form.get("experience"),
            photo_filename, user_id
        ))
        conn.commit()
    except Exception as e:
        print(f"Error adding doctor: {e}")
        return jsonify({"message": f"Failed to add doctor: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Doctor added successfully and account created (Pass: Doctor@123)"}), 201


@app.get("/api/admin/doctors")
@admin_required
def get_doctors_admin(admin_id):
    """Fetch all doctors for the admin dashboard."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM doctors ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)


@app.get("/api/admin/doctors/list")
def admin_doctor_list():
    """Doctor dropdown list"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id,name,department FROM doctors")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)


@app.put("/api/admin/doctors/<int:id>")
@admin_required
def update_doctor(admin_id, id):
    """Update an existing doctor's information."""
    form = request.form
    photo = request.files.get("photo")

    if not all([form.get("name"), form.get("email"), form.get("department")]):
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Find the existing photo so we can delete it if a new one is uploaded
    cursor.execute("SELECT photo FROM doctors WHERE id=%s", (id,))
    existing = cursor.fetchone()
    if not existing:
        cursor.close()
        conn.close()
        return jsonify({"message": "Doctor not found"}), 404

    photo_filename = existing["photo"]

    if photo:
        # Delete old photo if it exists (saves server space)
        if photo_filename:
            old_path = os.path.join(UPLOAD_DOCTORS, photo_filename)
            if os.path.exists(old_path):
                os.remove(old_path)

        ext = os.path.splitext(photo.filename)[1]
        photo_filename = f"{int(datetime.now().timestamp())}{ext}"
        photo.save(os.path.join(UPLOAD_DOCTORS, photo_filename))

    try:
        cursor.execute("""
            UPDATE doctors SET
            name=%s, email=%s, phone=%s, department=%s,
            specialization=%s, experience=%s, photo=%s
            WHERE id=%s
        """, (
            form.get("name"), form.get("email"),
            form.get("phone"), form.get("department"),
            form.get("specialization"), form.get("experience"),
            photo_filename, id
        ))
        conn.commit()
    except Exception as e:
        print(f"Error updating doctor: {e}")
        return jsonify({"message": "Failed to update"}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Doctor updated successfully"})


@app.delete("/api/admin/doctors/<int:id>")
@admin_required
def delete_doctor(admin_id, id):
    """Permanently remove a doctor from the system."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Security & Cleanup: Delete the doctor's photo from the server
    cursor.execute("SELECT photo FROM doctors WHERE id=%s", (id,))
    doc = cursor.fetchone()

    if doc and doc["photo"]:
        path = os.path.join(UPLOAD_DOCTORS, doc["photo"])
        if os.path.exists(path):
            os.remove(path)

    cursor.execute("DELETE FROM doctors WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Doctor deleted successfully"})

@app.get("/api/doctors")
def public_get_doctors():
    """Get all doctors (public)"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM doctors ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

# =================================================
# APPOINTMENTS
# =================================================

@app.post("/api/appointments")
def book_appointment():
    """Book appointment (public)"""
    data = request.json

    required = ["patient_name", "email", "department", "date", "time"]
    if not all(data.get(k) for k in required):
        return jsonify({"message": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id FROM doctors
        WHERE department=%s
        ORDER BY RAND()
        LIMIT 1
    """, (data["department"],))

    doctor = cursor.fetchone()
    if not doctor:
        return jsonify({"message": "No doctor available"}), 404

    cursor.execute("""
        INSERT INTO appointments
        (patient_name,email,phone,gender,department,
         doctor_id,appointment_date,appointment_time,message)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["patient_name"], data["email"],
        data.get("phone"), data.get("gender"),
        data["department"], doctor["id"],
        data["date"], data["time"], data.get("message")
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Appointment booked successfully"}), 201


@app.get("/api/admin/appointments")
@admin_required
def admin_get_appointments(admin_id):
    """
    Fetch all appointments with pagination and status filtering.
    Pagination (page/limit) and filtering (status) are handled via 
    query parameters (e.g., /api/admin/appointments?page=1&status=PENDING).
    """
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    status = request.args.get("status")  # e.g., 'PENDING' or 'APPROVED'

    # Offset calculates how many records to skip
    offset = (page - 1) * limit

    conn = get_db_connection()
    cursor = conn.cursor()

    # Base Query joins appointments with doctors to get the doctor's name
    base_query = """
        SELECT a.id, a.patient_name, a.email, a.phone, a.department, 
               a.appointment_date as date, a.appointment_time as time, 
               a.status, a.message, a.created_at, d.name AS doctor_name
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
    """

    params = []

    # If a status filter is provided, we add a WHERE clause
    if status:
        base_query += " WHERE a.status=%s"
        params.append(status)

    # Adding sorting and pagination
    base_query += " ORDER BY a.created_at DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    # Fetch paginated data
    cursor.execute(base_query, params)
    data = cursor.fetchall()

    # Fetch total count (needed for frontend pagination UI)
    count_query = "SELECT COUNT(*) AS total FROM appointments"
    if status:
        count_query += " WHERE status=%s"
        cursor.execute(count_query, (status,))
    else:
        cursor.execute(count_query)

    total = cursor.fetchone()["total"]

    cursor.close()
    conn.close()

    return jsonify({
        "data": data,
        "total": total
    })


@app.put("/api/admin/appointments/<int:id>")
@admin_required
def admin_update_appointment(admin_id, id):
    """
    Update an appointment (e.g., approve it or reassign the doctor).
    """
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE appointments
            SET status=%s, doctor_id=%s
            WHERE id=%s
        """, (data.get("status"), data.get("doctor_id"), id))
        conn.commit()
    except Exception as e:
        print(f"Error updating appointment: {e}")
        return jsonify({"message": "Failed to update"}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Appointment updated successfully"})

# =================================================
# NEWS MODULE
# =================================================

@app.post("/api/admin/news")
@admin_required
def add_news(admin_id):
    """
    Add a news article. Admins can upload an image along with the title/content.
    """
    form = request.form
    image = request.files.get("image")

    if not form.get("title"):
        return jsonify({"message": "Title required"}), 400

    filename = None
    if image:
        ext = os.path.splitext(image.filename)[1]
        filename = f"{int(datetime.now().timestamp())}{ext}"
        image.save(os.path.join(UPLOAD_NEWS, filename))

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO news (title, content, author, image)
            VALUES (%s, %s, %s, %s)
        """, (
            form.get("title"), form.get("content"),
            form.get("author"), filename
        ))
        conn.commit()
    except Exception as e:
        print(f"Error adding news: {e}")
        return jsonify({"message": "Failed to add news"}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "News added successfully"}), 201


@app.get("/api/news")
def get_news():
    """Get all news"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM news ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)


@app.get("/api/news/<int:id>")
def get_single_news(id):
    """Get single news"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM news WHERE id=%s", (id,))
    data = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(data)


@app.delete("/api/admin/news/<int:id>")
@admin_required
def delete_news(admin_id, id):
    """Delete a news article and its associated image."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT image FROM news WHERE id=%s", (id,))
    row = cursor.fetchone()

    if row and row["image"]:
        path = os.path.join(UPLOAD_NEWS, row["image"])
        if os.path.exists(path):
            os.remove(path)

    cursor.execute("DELETE FROM news WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "News deleted successfully"})

# =================================================
# FEEDBACK
# =================================================

@app.post("/api/feedback")
def submit_feedback():
    """Submit feedback"""
    data = request.json

    if not all([data.get("user_id"), data.get("name"),
                data.get("email"), data.get("message")]):
        return jsonify({"message": "Missing data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO feedback (user_id,name,email,message)
        VALUES (%s,%s,%s,%s)
    """, (
        data["user_id"], data["name"],
        data["email"], data["message"]
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Feedback submitted"}), 201


@app.get("/api/admin/feedback")
@admin_required
def get_feedback_admin(admin_id):
    """Fetch all patient feedback for admin review."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)


# =================================================
# ADMIN ANALYTICS & DASHBOARD
# =================================================

@app.get("/api/admin/stats")
@admin_required
def get_admin_stats(admin_id):
    """
    Fetch counts for the dashboard overview.
    This provides a quick summary of the system's status.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # We run multiple queries to get the totals
        cursor.execute("SELECT COUNT(*) AS total FROM doctors")
        doctors = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM users WHERE role='patient'")
        patients = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM appointments")
        appointments = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM feedback")
        feedback = cursor.fetchone()["total"]

        # Fetch recent appointments (last 5)
        cursor.execute("""
            SELECT a.*, d.name AS doctor_name 
            FROM appointments a 
            LEFT JOIN doctors d ON a.doctor_id = d.id 
            ORDER BY a.created_at DESC LIMIT 5
        """)
        recent_appointments = cursor.fetchall()

        return jsonify({
            "doctors": doctors,
            "patients": patients,
            "appointments": appointments,
            "feedback": feedback,
            "recent_appointments": recent_appointments
        })
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return jsonify({"message": "Failed to fetch stats"}), 500
    finally:
        cursor.close()
        conn.close()


@app.get("/api/admin/patients")
@admin_required
def get_patients_admin(admin_id):
    """Fetch all registered patients."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, phone, status, created_at FROM users WHERE role='patient' ORDER BY created_at DESC")
    data = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(data)

# =================================================
# CLINICAL PORTAL (DOCTOR & PATIENT)
# =================================================

@app.get("/api/doctor/dashboard-stats")
@token_required
def get_doctor_dashboard_stats(user_id):
    """Fetch stats for the logged-in doctor."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get the doctor record linked to this user
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor:
            return jsonify({"message": "Doctor profile not found"}), 404
        
        doctor_id = doctor["id"]

        # Today's Appointments
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute("SELECT COUNT(*) as count FROM appointments WHERE doctor_id=%s AND date=%s", (doctor_id, today))
        today_apt = cursor.fetchone()["count"]

        # Total Patients (unique patients treated)
        cursor.execute("SELECT COUNT(DISTINCT user_id) as count FROM appointments WHERE doctor_id=%s", (doctor_id,))
        total_patients = cursor.fetchone()["count"]

        return jsonify({
            "today_appointments": today_apt,
            "total_patients": total_patients,
            "pending_reports": 3, # Dummy for now
            "notifications": 2    # Dummy for now
        })
    except Exception as e:
        print(f"Stats Error: {e}")
        return jsonify({"message": "Internal server error"}), 500
    finally:
        cursor.close()
        conn.close()

@app.get("/api/doctor/appointments")
@token_required
def get_doctor_appointments(user_id):
    """Fetch appointments for the logged-in doctor."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor:
            return jsonify([])
            
        cursor.execute("""
            SELECT id, patient_name, email as patient_email, phone, 
                   appointment_date as date, appointment_time as time, 
                   status, message
            FROM appointments 
            WHERE doctor_id=%s 
            ORDER BY appointment_date DESC
        """, (doctor["id"],))
        
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.get("/api/doctor/profile")
@token_required
def get_doctor_profile(user_id):
    """Fetch personal profile for the logged-in doctor."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        return jsonify(doctor) if doctor else jsonify({"message": "Not found"}), 404
    finally:
        cursor.close()
        conn.close()

@app.put("/api/doctor/profile")
@token_required
def update_doctor_profile_self(user_id):
    """Allow doctor to update their own profile."""
    form = request.form
    photo = request.files.get("photo")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, photo FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor:
            return jsonify({"message": "Doctor not found"}), 404
            
        photo_filename = doctor["photo"]
        if photo:
            if photo_filename:
                old_path = os.path.join(UPLOAD_DOCTORS, photo_filename)
                if os.path.exists(old_path):
                    os.remove(old_path)
            ext = os.path.splitext(photo.filename)[1]
            photo_filename = f"{int(datetime.now().timestamp())}{ext}"
            photo.save(os.path.join(UPLOAD_DOCTORS, photo_filename))

        cursor.execute("""
            UPDATE doctors SET 
            phone=%s, specialization=%s, experience=%s, photo=%s
            WHERE id=%s
        """, (form.get("phone"), form.get("specialization"), form.get("experience"), photo_filename, doctor["id"]))
        conn.commit()
        return jsonify({"message": "Profile updated successfully"})
    finally:
        cursor.close()
        conn.close()

@app.get("/api/doctor/patients")
@token_required
def get_doctor_patients(user_id):
    """Fetch unique patients treated by this doctor."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor: return jsonify([])
        
        cursor.execute("""
            SELECT DISTINCT patient_name, email, phone 
            FROM appointments 
            WHERE doctor_id=%s
        """, (doctor["id"],))
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.post("/api/doctor/records")
@token_required
def save_clinical_record(user_id):
    """Save consultation notes for an appointment."""
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor: return jsonify({"message": "Unauthorized"}), 403
        
        # Check if record already exists (omitted for now)
        cursor.execute("INSERT INTO medical_records (appointment_id, doctor_id, patient_email, diagnosis, notes) VALUES (%s, %s, %s, %s, %s)",
                       (data["appointment_id"], doctor["id"], data["patient_email"], data["diagnosis"], data["notes"]))
        
        if data.get("medications"):
            # Fetch patient_id from users table using email
            cursor.execute("SELECT id FROM users WHERE email=%s", (data["patient_email"],))
            patient = cursor.fetchone()
            patient_id = patient["id"] if patient else None

            cursor.execute("""
                INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medicine_name, dosage, instructions) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (data["appointment_id"], doctor["id"], patient_id, data["medications"], data.get("dosage", "As directed"), data.get("instructions", "")))
            
        conn.commit()
        return jsonify({"message": "Clinical record saved"})
    finally:
        cursor.close()
        conn.close()

@app.get("/api/doctor/records/<int:apt_id>")
@token_required
def get_clinical_record(user_id, apt_id):
    """Fetch clinical notes for an appointment."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT r.*, p.medicine_name as medications, p.instructions 
            FROM medical_records r
            LEFT JOIN prescriptions p ON r.appointment_id = p.appointment_id
            WHERE r.appointment_id = %s
        """, (apt_id,))
        return jsonify(cursor.fetchone() or {})
    finally:
        cursor.close()
        conn.close()
    """Fetch appointments for the logged-in doctor."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor: return jsonify([]), 404
        
        cursor.execute("""
            SELECT a.*, u.name as patient_name, u.email as patient_email
            FROM appointments a
            JOIN users u ON a.user_id = u.id
            WHERE a.doctor_id = %s
            ORDER BY a.date DESC, a.time DESC
        """, (doctor["id"],))
        data = cursor.fetchall()
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()

@app.post("/api/prescriptions")
@token_required
def create_prescription(user_id):
    """Create a new prescription for a patient."""
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Verify doctor is who they say they are
        cursor.execute("SELECT id FROM doctors WHERE user_id=%s", (user_id,))
        doctor = cursor.fetchone()
        if not doctor: return jsonify({"message": "Unauthorized"}), 403
        
        cursor.execute("""
            INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medicine_name, dosage, instructions)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data["appointment_id"], doctor["id"], data["patient_id"], data["medicine_name"], data["dosage"], data["instructions"]))
        conn.commit()
        return jsonify({"message": "Prescription issued"}), 201
    finally:
        cursor.close()
        conn.close()

@app.get("/api/patient/dashboard-stats")
@token_required
def get_patient_dashboard_stats(user_id):
    """Fetch stats for the logged-in patient."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT id FROM users WHERE id=%s", (user_id,))
        user = cursor.fetchone()
        if not user: return jsonify({"message": "User not found"}), 404

        cursor.execute("SELECT COUNT(*) as count FROM appointments WHERE email=(SELECT email FROM users WHERE id=%s) AND status IN ('PENDING', 'APPROVED')", (user_id,))
        upcoming = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) as count FROM prescriptions WHERE patient_id=%s", (user_id,))
        prescr_count = cursor.fetchone()["count"]

        return jsonify({
            "upcoming_appointments": upcoming,
            "prescriptions_count": prescr_count,
            "medical_reports": 2 # Dummy for now
        })
    finally:
        cursor.close()
        conn.close()

@app.get("/api/patient/prescriptions")
@token_required
def get_patient_prescriptions(user_id):
    """Fetch all prescriptions for the patient."""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT p.*, d.name as doctor_name, d.department 
            FROM prescriptions p
            JOIN doctors d ON p.doctor_id = d.id
            WHERE p.patient_id = %s
            ORDER BY p.created_at DESC
        """, (user_id,))
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.get("/api/patient/appointments")
@token_required
def get_patient_appointments(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT email FROM users WHERE id=%s", (user_id,))
        email = cursor.fetchone()["email"]
        cursor.execute("""
            SELECT a.id, a.patient_name, a.email, a.phone, a.department, 
                   a.appointment_date as date, a.appointment_time as time, 
                   a.status, a.message, a.created_at, d.name as doctor_name 
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.email = %s
            ORDER BY a.appointment_date DESC
        """, (email,))
        return jsonify(cursor.fetchall())
    finally:
        cursor.close()
        conn.close()

@app.get("/api/patient/reports")
@token_required
def get_patient_reports(user_id):
    # Dummy reports for now
    reports = [
        {"id": 1, "title": "Complete Blood Count", "date": "2024-01-05", "category": "Laboratory", "status": "Ready"},
        {"id": 2, "title": "Chest X-Ray", "date": "2023-12-28", "category": "Radiology", "status": "Ready"}
    ]
    return jsonify(reports)

@app.get("/api/patient/profile")
@token_required
def get_patient_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, email, phone FROM users WHERE id=%s", (user_id,))
        return jsonify(cursor.fetchone())
    finally:
        cursor.close()
        conn.close()

@app.put("/api/patient/profile")
@token_required
def update_patient_profile(user_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET name=%s, phone=%s WHERE id=%s", (data["name"], data["phone"], user_id))
        conn.commit()
        return jsonify({"message": "Profile updated"})
    finally:
        cursor.close()
        conn.close()

# =================================================
# STATIC FILES
# =================================================

@app.get("/uploads/doctors/<filename>")
def serve_doctor_image(filename):
    return send_from_directory(UPLOAD_DOCTORS, filename)


@app.get("/uploads/news/<filename>")
def serve_news_image(filename):
    return send_from_directory(UPLOAD_NEWS, filename)

# =================================================
# HEALTH CHECK
# =================================================

@app.get("/")
def home():
    return "Backend running!"

# =================================================
# RUN SERVER
# =================================================

if __name__ == "__main__":
    app.run(debug=True, port=5001)
