import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampers, clearCampers } from '../../redux/slices/campersSlice';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import CamperCard from '../../components/CamperCard/CamperCard';
import Loader from '../../components/Loader/Loader';
import styles from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error, page, hasMore } = useSelector((state) => {
    console.log('Current state:', state.campers);
    return state.campers;
  });
  const filters = useSelector((state) => {
    console.log('Current filters:', state.filters);
    return state.filters;
  });

  const createQueryParams = (pageNum) => {
    // Базові параметри
    const queryParams = {
      page: pageNum,
      limit: 8
    };

    // Додаємо фільтри, тільки якщо вони мають значення
    if (filters.location?.trim()) {
      queryParams.location = filters.location.trim();
    }

    if (filters.vehicleType) {
      queryParams.form = filters.vehicleType;
    }

    // Додаємо активні фільтри обладнання
    Object.entries(filters.features).forEach(([key, value]) => {
      if (value) {
        if (key === 'automatic') {
          queryParams.transmission = 'automatic';
        } else {
          queryParams[key] = true;
        }
      }
    });

    console.log('Created query params:', queryParams);
    return queryParams;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data with filters:', filters);
        dispatch(clearCampers());
        const queryParams = createQueryParams(1);
        const resultAction = await dispatch(fetchCampers(queryParams));
        if (fetchCampers.rejected.match(resultAction)) {
          console.error('Fetch rejected:', resultAction.error);
        } else {
          console.log('Fetch succeeded:', resultAction.payload);
        }
      } catch (error) {
        console.error('Error fetching campers:', error);
      }
    };

    fetchData();
  }, [dispatch, filters]);

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      try {
        const queryParams = createQueryParams(page);
        const resultAction = await dispatch(fetchCampers(queryParams));
        if (fetchCampers.rejected.match(resultAction)) {
          console.error('Load more rejected:', resultAction.error);
        }
      } catch (error) {
        console.error('Error loading more campers:', error);
      }
    }
  };

  console.log('Rendering with items:', items);

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.error}>Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <Filters />
          </aside>
          
          <div className={styles.content}>
            {isLoading && items.length === 0 ? (
              <Loader />
            ) : (
              <>
                <div className={styles.campersList}>
                  {Array.isArray(items) && items.length > 0 ? (
                    items.map((camper) => (
                      <CamperCard key={camper.id} camper={camper} />
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      No campers found. Try adjusting your filters.
                    </div>
                  )}
                </div>
                
                {hasMore && !isLoading && items.length > 0 && (
                  <button onClick={handleLoadMore} className={styles.loadMoreButton}>
                    Load More
                  </button>
                )}
                
                {isLoading && items.length > 0 && <Loader />}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default CatalogPage;
