import { useState } from 'react';
import styles from './BookingForm.module.css';

const BookingForm = ({ onSubmit, price }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate) return price;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return price * days;
  };

  return (
    <div className={styles.bookingForm}>
      <h2 className={styles.title}>Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>Price:</span>
          <span className={styles.priceValue}>${price.toFixed(2)}/day</span>
        </div>

        <div className={styles.dateInputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="startDate">Start date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="endDate">End date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Your message"
            rows="4"
          />
        </div>

        <div className={styles.totalPrice}>
          <span>Total:</span>
          <span className={styles.totalValue}>
            ${calculateTotalPrice().toFixed(2)}
          </span>
        </div>

        <button type="submit" className={styles.submitButton}>
          Book now
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
