import pymysql
import bcrypt
from datetime import datetime, timedelta
import random

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Prajwal@16",
        database="hospital_db",
        cursorclass=pymysql.cursors.DictCursor
    )

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def seed():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Add Dummy Patients
        patients = [
            ("Alice Johnson", "alice@example.com", "555-0101"),
            ("Bob Miller", "bob@example.com", "555-0102"),
            ("Charlie Davis", "charlie@example.com", "555-0103"),
            ("Diana Prince", "diana@example.com", "555-0104"),
            ("Ethan Hunt", "ethan@example.com", "555-0105"),
        ]
        
        hashed_pw = hash_password("Patient@123")
        
        for name, email, phone in patients:
            cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
            if not cursor.fetchone():
                cursor.execute("INSERT INTO users (name, email, phone, password, role) VALUES (%s, %s, %s, %s, 'patient')",
                               (name, email, phone, hashed_pw))
        
        conn.commit()
        
        # 2. Get Doctors and Patients IDs
        cursor.execute("SELECT id, department FROM doctors")
        doctors = cursor.fetchall()
        
        cursor.execute("SELECT id, name, email, phone FROM users WHERE role='patient'")
        db_patients = cursor.fetchall()
        
        if not doctors:
            print("No doctors found in DB. Please add doctors first.")
            return

        # 3. Add Dummy Appointments
        statuses = ["PENDING", "APPROVED", "COMPLETED"]
        
        for _ in range(25):
            patient = random.choice(db_patients)
            doctor = random.choice(doctors)
            status = random.choice(statuses)
            
            if status == "COMPLETED":
                days_offset = -random.randint(1, 30)
            else:
                days_offset = random.randint(0, 14)
            
            apt_date = (datetime.now() + timedelta(days=days_offset)).strftime("%Y-%m-%d")
            apt_time = f"{random.randint(9, 16)}:00"
            
            cursor.execute("""
                INSERT INTO appointments (patient_name, email, phone, gender, department, doctor_id, appointment_date, appointment_time, message, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                patient["name"], patient["email"], patient["phone"], 
                random.choice(["Male", "Female"]), doctor["department"], 
                doctor["id"], apt_date, apt_time, "Seeded dummy appointment.", status
            ))
            apt_id = conn.insert_id()
            
            # 4. Add Medical Records and Prescriptions for COMPLETED appts
            if status == "COMPLETED":
                diagnosis = random.choice(["Common Cold", "Mild Hypertension", "Routine Checkup", "Seasonal Allergies", "Vitamin Deficiency"])
                notes = "Patient advised on lifestyle changes and follow-up in 2 weeks."
                
                cursor.execute("""
                    INSERT INTO medical_records (appointment_id, doctor_id, patient_email, diagnosis, notes)
                    VALUES (%s, %s, %s, %s, %s)
                """, (apt_id, doctor["id"], patient["email"], diagnosis, notes))
                
                # Prescription table columns: appointment_id, doctor_id, patient_id, medicine_name, dosage, instructions
                medicines = [
                    ("Paracetamol", "500mg"),
                    ("Cetirizine", "10mg"),
                    ("Amoxicillin", "250mg"),
                    ("Ibuprofen", "400mg")
                ]
                med, dosage = random.choice(medicines)
                
                cursor.execute("""
                    INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medicine_name, dosage, instructions)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (apt_id, doctor["id"], patient["id"], med, dosage, "Take after meals twice a day."))

        conn.commit()
        print("Dummy data seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    seed()
