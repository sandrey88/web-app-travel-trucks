import { useState, useRef } from 'react';
import styles from './BookingForm.module.css';

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    comment: ''
  });

  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateFocus = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); // Відкриває календар
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.bookingForm}>
      <div className={styles.formTitle}>
        <p className={styles.titleText}>Book your campervan now</p>
        <p className={styles.subText}>Stay connected! We are always ready to help you.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroups}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Name*"
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email*"
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onFocus={handleDateFocus}
              onChange={handleChange}
              required
              placeholder="Booking date*"
              className={styles.dateInput}
            />
            <input
              type="date"
              ref={dateInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                handleChange(e);
                dateInputRef.current.blur(); // Закриває календар після вибору
              }}
              name="date"
            />
          </div>

          <div className={styles.inputGroup}>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Comment"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
