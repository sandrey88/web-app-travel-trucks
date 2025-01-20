import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import sprite from '../../images/icons.svg';
import { formatPrice } from './Price';
import { features } from '../Filters/Feachers';
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
            e.target.src = '../../images/fallback-image.svg';
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{camper.name}</h2>
            <div className={styles.priceAndFavorite}>
              <p className={styles.price}>{formatPrice(camper.price)}</p>
              <button className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`} onClick={handleFavoriteClick} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                <svg className={styles.favoriteIcon}>
                  <use href={`${sprite}#icon-heart`} />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.reviewsAndLocation}>
            <div className={styles.reviews}>
              <svg className={styles.starIcon}>
                <use href={`${sprite}#icon-star`} />
              </svg>
              {camper.reviews && camper.reviews.length > 0 && (
                <span>
                  {camper.rating}({camper.reviews.length}{' '}
                  {camper.reviews.length === 1 ? 'Review' : 'Reviews'})
                </span>
              )}
            </div>
            <div className={styles.location}>
              <svg className={styles.mapIcon}>
                <use href={`${sprite}#icon-map`} />
              </svg>
              <span>{camper.location}</span>
            </div>
          </div>
        </div>

        <p className={styles.description}>{camper.description}</p>

        <div className={styles.features}>
          {features.map(({ id, label, icon }) => {
            // Checking whether this function is available for the current camper
            const isFeatureAvailable = id === 'automatic'
              ? camper.transmission === 'automatic' // Special check for automatic transmission
              : camper[id]; // General check for the rest of the features

            if (!isFeatureAvailable) return null;

            return (
              <div className={styles.feature} key={id}>
                <svg className={styles.icon}>
                  <use href={`${sprite}#${icon}`} />
                </svg>
                <span>{label}</span>
              </div>
            );
          })}
        </div>

        <button onClick={handleShowMore} className={styles.showMoreButton}>
          Show more
        </button>
      </div>
    </div>
  );
};

export default CamperCard;
