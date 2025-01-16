import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import styles from './CamperCard.module.css';

const CamperCard = ({ camper }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === camper.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    dispatch(toggleFavorite(camper));
  };

  const handleShowMore = () => {
    window.open(`/catalog/${camper.id}`, '_blank');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Перевіряємо, чи є у нас всі необхідні дані
  if (!camper || !camper.gallery || !camper.gallery[0]) {
    console.error('Invalid camper data:', camper);
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={camper.gallery[0].original} 
          alt={camper.name} 
          className={styles.image}
          onError={(e) => {
            console.error('Image load error:', e);
            e.target.src = 'fallback-image-url.jpg'; // Додайте URL для fallback зображення
          }}
        />
        <button
          className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{camper.name}</h2>
            <p className={styles.price}>${formatPrice(camper.price)}</p>
          </div>
          <div className={styles.location}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
            <span>{camper.location}</span>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailsRow}>
            <div className={styles.detail}>
              <span className={styles.label}>Form:</span>
              <span className={styles.value}>
                {camper.form.charAt(0).toUpperCase() + camper.form.slice(1)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Length:</span>
              <span className={styles.value}>{camper.length}</span>
            </div>
          </div>
          <div className={styles.detailsRow}>
            <div className={styles.detail}>
              <span className={styles.label}>Width:</span>
              <span className={styles.value}>{camper.width}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Height:</span>
              <span className={styles.value}>{camper.height}</span>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          {camper.AC && (
            <div className={styles.feature}>
              <span>AC</span>
            </div>
          )}
          {camper.transmission === 'automatic' && (
            <div className={styles.feature}>
              <span>Automatic</span>
            </div>
          )}
          {camper.kitchen && (
            <div className={styles.feature}>
              <span>Kitchen</span>
            </div>
          )}
          {camper.TV && (
            <div className={styles.feature}>
              <span>TV</span>
            </div>
          )}
          {camper.bathroom && (
            <div className={styles.feature}>
              <span>Bathroom</span>
            </div>
          )}
        </div>

        <button onClick={handleShowMore} className={styles.showMoreButton}>
          Show more
        </button>
      </div>
    </div>
  );
};

export default CamperCard;
