import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampers } from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import CamperCard from '../../components/CamperCard/CamperCard';
import Loader from '../../components/Loader/Loader';
import styles from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, page, hasMore } = useSelector((state) => state.campers);
  const filters = useSelector((state) => state.filters);

  const createQueryParams = useCallback((pageNum = 1) => {
    // Basic parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', pageNum);
    queryParams.append('limit', 8);
    
    if (filters.location?.trim()) {
      queryParams.append('location', filters.location.trim());
    }

    if (filters.vehicleType) {
      queryParams.append('type', filters.vehicleType);
    }

    // Adding active equipment filters
    Object.entries(filters.features).forEach(([key, value]) => {
      if (value) {
        queryParams.append('features', key);
      }
    });

    return Object.fromEntries(queryParams);
  }, [filters]);

  const handleLoadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      try {
        const queryParams = createQueryParams(page + 1);
        await dispatch(fetchCampers(queryParams));
      } catch (error) {
        console.error('Error loading more campers:', error);
      }
    }
  }, [dispatch, createQueryParams, isLoading, hasMore, page]);

  useEffect(() => {
    dispatch(fetchCampers(createQueryParams()));
  }, [dispatch, createQueryParams]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Filters createQueryParams={createQueryParams} />
          </div>
          <div className={styles.content}>
            {isLoading && items.length === 0 ? (
              <Loader />
            ) : (
              <>
                {items.length === 0 ? (
                  <div className={styles.noResults}>
                    <p>No campers found matching your criteria</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.campersList}>
                      {items.map((camper) => (
                        <CamperCard 
                          key={`camper-${camper.id}`} 
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
