import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCampers, 
  selectCampers, 
  selectPagination, 
  selectHasMore,
  selectIsLoading,
  selectError
} from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import CamperCard from '../../components/CamperCard/CamperCard';
import Loader from '../../components/Loader/Loader';
import styles from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCampers);
  const { page } = useSelector(selectPagination);
  const hasMore = useSelector(selectHasMore);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const filters = useSelector((state) => state.filters);

  const createQueryParams = useCallback(() => {
    const params = {};
    
    if (filters.location?.trim()) {
      params.location = filters.location.trim();
    }

    if (filters.vehicleType) {
      params.type = filters.vehicleType;
    }

    // Adding active equipment filters
    const activeFeatures = Object.entries(filters.features)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (activeFeatures.length > 0) {
      params.features = activeFeatures;
    }

    return params;
  }, [filters]);

  const handleLoadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      try {
        const params = {
          ...createQueryParams(),
          page: page + 1
        };
        await dispatch(fetchCampers(params));
      } catch (error) {
        console.error('Error loading more campers:', error);
      }
    }
  }, [dispatch, createQueryParams, isLoading, hasMore, page]);

  useEffect(() => {
    const params = {
      ...createQueryParams(),
      page: 1
    };
    dispatch(fetchCampers(params));
  }, [dispatch, createQueryParams]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Filters />
          </div>
          <div className={styles.content}>
            {error && (
              <div className={styles.error}>
                <p>Error loading campers. Please try again later.</p>
              </div>
            )}
            {isLoading && items.length === 0 ? (
              <Loader />
            ) : (
              <>
                {items.length === 0 && !error ? (
                  <div className={styles.noResults}>
                    <p>No campers found matching your criteria</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.campersList}>
                      {items.map((camper) => (
                        <CamperCard 
                          key={camper.id} 
                          camper={camper} 
                        />
                      ))}
                    </div>
                    {hasMore && !isLoading && (
                      <button
                        className={styles.loadMoreButton}
                        onClick={handleLoadMore}
                        disabled={isLoading}
                      >
                        Load more
                      </button>
                    )}
                    {isLoading && <Loader />}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CatalogPage;
