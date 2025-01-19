import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify'; // Імпортуємо toast
import styles from './BookingForm.module.css';

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: null,
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Перевірка успішної відправки
    try {
      onSubmit(formData); // Виклик функції onSubmit
      toast.success('Booking successful!'); // Нотифікація про успішне бронювання
      setFormData({ name: '', email: '', date: null, comment: '' }); // Очищення форми після успішного відправлення
    } catch {
      toast.error('Something went wrong! Please try again.'); // Нотифікація про помилку
    }
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
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              placeholderText="Booking date*"
              className={styles.dateInput}
              wrapperClassName={styles.datePickerWrapper}
              dateFormat="dd.MM.yyyy"
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
