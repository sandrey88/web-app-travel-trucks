import { useState } from 'react';
import styles from './Reviews.module.css';

const Reviews = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={styles.reviews}>
      <h2 className={styles.title}>Reviews</h2>
      <div className={styles.reviewsList}>
        {displayedReviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                <span className={styles.reviewerName}>{review.reviewer_name}</span>
                <div className={styles.rating}>
                  {renderStars(review.reviewer_rating)}
                </div>
              </div>
            </div>
            <p className={styles.comment}>{review.comment}</p>
          </div>
        ))}
      </div>
      {reviews.length > 3 && (
        <button
          className={styles.showMoreButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : 'Show More Reviews'}
        </button>
      )}
    </div>
  );
};

export default Reviews;
