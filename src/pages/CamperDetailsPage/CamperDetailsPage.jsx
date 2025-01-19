import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamperById } from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import sprite from '../../images/icons.svg';
import { formatPrice } from '../../components/CamperCard/Price';
import { features } from '../../components/Filters/Feachers';
import Gallery from '../../components/Gallery/Gallery';
import Reviews from '../../components/Reviews/Reviews';
import BookingForm from '../../components/BookingForm/BookingForm';
import Loader from '../../components/Loader/Loader';
import styles from './CamperDetailsPage.module.css';

const CamperDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('features');
  const { selectedCamper: camper, isLoading, error } = useSelector((state) => state.campers);

  useEffect(() => {
    dispatch(fetchCamperById(id));
  }, [dispatch, id]);

  const handleBookingSubmit = (formData) => {
    console.log('Booking submitted:', formData);
    // Тут буде логіка відправки даних на сервер
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={styles.loader}>
          <Loader />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.error}>Error: {error}</div>
      </>
    );
  }

  if (!camper) {
    return (
      <>
        <Header />
        <div className={styles.error}>Camper not found</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>{camper.name}</h1>
              <div className={styles.infoHeader}>
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
                <p className={styles.price}>${formatPrice(camper.price)}</p>
              </div>
            </div>
            <Gallery images={camper.gallery} />
            <div className={styles.description}>
              <p>{camper.description}</p>
            </div>
          </div>

          <div className={styles.containerTabs}>
            <div className={styles.tabs}>
              <ul className={styles.tabsList}>
                <li 
                  onClick={() => setActiveTab('features')}
                  className={activeTab === 'features' ? styles.activeTab : ''}
                >
                  Features
                </li>
                <li 
                  onClick={() => setActiveTab('reviews')}
                  className={activeTab === 'reviews' ? styles.activeTab : ''}
                >
                  Reviews
                </li>
              </ul>
            </div>
            <div className={styles.tabsContent}>
              {activeTab === 'features' && (
                <div className={styles.allFeatures}>
                  <div className={styles.features}>
                    {features.map(({ id, label, icon }) => {
                      // Перевіряємо, чи ця функція доступна для поточного camper
                      const isFeatureAvailable = id === 'automatic'
                        ? camper.transmission === 'automatic' // Спеціальна перевірка для автоматичної коробки передач
                        : camper[id]; // Загальна перевірка для решти features

                      if (!isFeatureAvailable) return null; // Якщо функція недоступна, не рендеримо її

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
                  <div className={styles.specifications}>
                    <h3 className={styles.sectionTitle}>Vehicle details</h3>
                    <div className={styles.specGrid}>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Form:</span>
                        <span className={styles.specValue}>{camper.form}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Length:</span>
                        <span className={styles.specValue}>{camper.length}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Width:</span>
                        <span className={styles.specValue}>{camper.width}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Height:</span>
                        <span className={styles.specValue}>{camper.height}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Tank:</span>
                        <span className={styles.specValue}>{camper.tank}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specLabel}>Consumption:</span>
                        <span className={styles.specValue}>{camper.consumption}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className={styles.allReviews}>
                  <Reviews reviews={camper.reviews} />
                </div>
              )}
              <div className={styles.form}>
                <BookingForm onSubmit={handleBookingSubmit} price={camper.price} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default CamperDetailsPage;
