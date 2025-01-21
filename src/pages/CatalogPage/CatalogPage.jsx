import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCampers,
  selectCampers,
  selectError,
  selectHasMore,
  selectIsLoading,
  selectPagination,
  setPage,
} from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import CamperCard from '../../components/CamperCard/CamperCard';
import Loader from '../../components/Loader/Loader';
import styles from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const campers = useSelector(selectCampers);
  const { page } = useSelector(selectPagination);
  const hasMore = useSelector(selectHasMore);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (page === 1) {
      dispatch(fetchCampers({ page }));
    }
  }, [dispatch, page]);

  const handleLoadMore = () => {
    dispatch(setPage(page + 1));
    dispatch(fetchCampers({ page: page + 1 }));
  };

  const renderContent = () => {
    if (isLoading && page === 1) {
      return (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      );
    }

    if (error) {
      return <div className={styles.error}>Error loading campers. Please try again later.</div>;
    }

    if (!campers.length) {
      return <div className={styles.noCampers}>No campers found matching your criteria.</div>;
    }

    return (
      <>
        <ul className={styles.campersList}>
          {campers.map((camper) => (
            <li key={camper.id} className={styles.camperItem}>
              <CamperCard camper={camper} />
            </li>
          ))}
        </ul>
        {isLoading && (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        )}
        {!isLoading && hasMore && !error && (
          <button onClick={handleLoadMore} className={styles.loadMoreButton}>
            Load more
          </button>
        )}
      </>
    );
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Filters />
          </div>
          <div className={styles.content}>
            {renderContent()}
          </div>
        </div>
      </main>
    </>
  );
};

export default CatalogPage;
