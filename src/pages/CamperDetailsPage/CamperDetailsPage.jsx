import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCamperById } from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import Gallery from '../../components/Gallery/Gallery';
import Reviews from '../../components/Reviews/Reviews';
import BookingForm from '../../components/BookingForm/BookingForm';
import Loader from '../../components/Loader/Loader';
import styles from './CamperDetailsPage.module.css';

const CamperDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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
            <Gallery images={camper.gallery} />
            
            <div className={styles.details}>
              <div className={styles.header}>
                <h1 className={styles.title}>{camper.name}</h1>
                <div className={styles.location}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  <span>{camper.location}</span>
                </div>
              </div>

              <div className={styles.specifications}>
                <h2 className={styles.sectionTitle}>Specifications</h2>
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

              <div className={styles.features}>
                <h2 className={styles.sectionTitle}>Features</h2>
                <div className={styles.featuresList}>
                  {camper.AC && <div className={styles.feature}>AC</div>}
                  {camper.transmission === 'automatic' && (
                    <div className={styles.feature}>Automatic</div>
                  )}
                  {camper.kitchen && <div className={styles.feature}>Kitchen</div>}
                  {camper.TV && <div className={styles.feature}>TV</div>}
                  {camper.bathroom && <div className={styles.feature}>Bathroom</div>}
                  {camper.radio && <div className={styles.feature}>Radio</div>}
                  {camper.refrigerator && (
                    <div className={styles.feature}>Refrigerator</div>
                  )}
                  {camper.microwave && <div className={styles.feature}>Microwave</div>}
                  {camper.gas && <div className={styles.feature}>Gas</div>}
                  {camper.water && <div className={styles.feature}>Water</div>}
                </div>
              </div>

              <div className={styles.description}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <p>{camper.description}</p>
              </div>

              <Reviews reviews={camper.reviews} />
            </div>
          </div>

          <aside className={styles.sidebar}>
            <BookingForm onSubmit={handleBookingSubmit} price={camper.price} />
          </aside>
        </div>
      </main>
    </>
  );
};

export default CamperDetailsPage;
