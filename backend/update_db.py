import pymysql

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Prajwal@16",
        database="hospital_db",
        cursorclass=pymysql.cursors.DictCursor
    )

def update_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Doctor Availability
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctor_availability (
            id INT PRIMARY KEY AUTO_INCREMENT,
            doctor_id INT,
            day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
            start_time TIME,
            end_time TIME,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
        )
        """)
        
        # Medical Records
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS medical_records (
            id INT PRIMARY KEY AUTO_INCREMENT,
            appointment_id INT,
            doctor_id INT,
            patient_email VARCHAR(100),
            diagnosis TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (appointment_id) REFERENCES appointments(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        )
        """)
        
        # Prescriptions
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS prescriptions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            record_id INT,
            medications TEXT,
            instructions TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (record_id) REFERENCES medical_records(id)
        )
        """)
        
        conn.commit()
        print("Database schema updated successfully!")
    except Exception as e:
        print(f"Error updating database: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    update_db()
