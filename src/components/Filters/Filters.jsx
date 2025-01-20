import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setVehicleType, toggleFeature } from '../../redux/slices/filtersSlice';
import { fetchCampers, clearCampers, resetPagination } from '../../redux/slices/campersSlice';
import { getCampers } from '../../services/api';
import sprite from '../../images/icons.svg';
import { features } from './Features';
import styles from './Filters.module.css';

const vehicleTypes = [
  { id: 'panelTruck', label: 'Van', icon: 'icon-bi_grid-1x2' },
  { id: 'fullyIntegrated', label: 'Fully Integrated', icon: 'icon-bi_grid' },
  { id: 'alcove', label: 'Alcove', icon: 'icon-bi_grid-3x3' }
];

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchLocationSuggestions = async (searchText) => {
    if (!searchText || searchText.length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getCampers();
      const locations = [...new Set(response.items.map(camper => camper.location))];
      const searchLower = searchText.toLowerCase();

      const filteredLocations = locations.filter(loc => {
        if (!loc) return false;
        return loc.toLowerCase().includes(searchLower);
      });

      setLocationSuggestions(filteredLocations);
      setShowSuggestions(filteredLocations.length > 0);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    dispatch(setLocation(value));

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 300);
  };

  const handleLocationSelect = (location) => {
    dispatch(setLocation(location));
    setShowSuggestions(false);
  };

  const handleVehicleTypeChange = (typeId) => {
    const newType = typeId === filters.vehicleType ? '' : typeId;
    dispatch(setVehicleType(newType));
  };

  const handleFeatureToggle = (feature) => {
    dispatch(toggleFeature(feature));
  };

  const handleSearch = () => {
    dispatch(resetPagination());
    dispatch(clearCampers());
    dispatch(fetchCampers());
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchBar}>
        <p>Location</p>
        <div className={styles.inputWrapper} ref={inputRef}>
          <svg className={styles.inputIcon}>
            <use href={`${sprite}#icon-map`} />
          </svg>
          <input
            type="text"
            placeholder="City"
            value={filters.location}
            onChange={handleLocationChange}
            className={styles.searchInput}
          />
          {isLoading && (
            <div className={styles.loadingIndicator}>Loading...</div>
          )}
          {showSuggestions && (
            <ul className={styles.suggestions} ref={suggestionsRef}>
              {locationSuggestions.length > 0 ? (
                locationSuggestions.map((location, index) => (
                  <li
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className={styles.suggestionItem}
                  >
                    {location}
                  </li>
                ))
              ) : (
                <li className={styles.noResults}>No matches found</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.sectionFilters}>
        <p className={styles.filterTitle}>Filters</p>
        <div className={styles.sectionFilter}>
          <h3 className={styles.sectionTitle}>Vehicle equipment</h3>
          <div className={styles.features}>
            {features.map(({ id, label, icon }) => (
              <label
                key={id}
                className={`${styles.feature} ${
                  filters.features[id] ? styles.active : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.features[id]}
                  onChange={() => handleFeatureToggle(id)}
                />
                <svg className={styles.icon}>
                  <use href={`${sprite}#${icon}`} />
                </svg>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.sectionFilter}>
          <h3 className={styles.sectionTitle}>Vehicle type</h3>
          <div className={styles.vehicleTypes}>
            {vehicleTypes.map(({ id, label, icon }) => (
              <button
                key={id}
                className={`${styles.typeButton} ${
                  id === filters.vehicleType ? styles.active : ''
                }`}
                onClick={() => handleVehicleTypeChange(id)}
              >
                <svg className={styles.icon}>
                  <use href={`${sprite}#${icon}`} />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

export default Filters;
