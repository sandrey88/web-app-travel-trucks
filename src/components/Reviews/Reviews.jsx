import { useState } from 'react';
import styles from './Reviews.module.css';

const Reviews = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = Array.isArray(reviews) ? (showAll ? reviews : reviews.slice(0, 3)) : [];

  if (displayedReviews.length === 0) {
    return <p>No reviews available.</p>;
  }

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

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div className={styles.reviews}>
      <div className={styles.reviewsList}>
        {displayedReviews.map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerAva}>
                {getInitial(review.reviewer_name)}
              </div>
              <div className={styles.reviewerInfo}>
                <span className={styles.reviewerName}>{review.reviewer_name || 'Anonymous'}</span>
                <div className={styles.rating}>
                  {renderStars(review.reviewer_rating || 0)}
                </div>
              </div>
            </div>
            <p className={styles.comment}>{review.comment || 'No comments provided.'}</p>
          </div>
        ))}
      </div>
      {reviews.length > 3 && !showAll && (
        <button
          className={styles.showMoreButton}
          onClick={() => setShowAll(true)}
        >
          Show all reviews
        </button>
      )}
    </div>
  );
};

export default Reviews;