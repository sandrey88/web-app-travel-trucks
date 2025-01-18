import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setVehicleType, toggleFeature, resetFilters } from '../../redux/slices/filtersSlice';
import sprite from '../../images/icons.svg';
import styles from './Filters.module.css';

const vehicleTypes = [
  { id: 'panelTruck', label: 'Van', icon: 'icon-bi_grid-1x2' },
  { id: 'fullyIntegrated', label: 'Fully Integrated', icon: 'icon-bi_grid' },
  { id: 'alcove', label: 'Alcove', icon: 'icon-bi_grid-3x3' }
];

const features = [
  { id: 'automatic', label: 'Automatic', icon: 'icon-diagram' },
  { id: 'diesel', label: 'Diesel', icon: 'icon-fuel' },
  { id: 'AC', label: 'AC', icon: 'icon-wind' },
  { id: 'bathroom', label: 'Bathroom', icon: 'icon-shower' },
  { id: 'kitchen', label: 'Kitchen', icon: 'icon-cup-hot' },
  { id: 'TV', label: 'TV', icon: 'icon-tv' },
  { id: 'radio', label: 'Radio', icon: 'icon-radio' },
  { id: 'refrigerator', label: 'Refrigerator', icon: 'icon-fridge' },
  { id: 'microwave', label: 'Microwave', icon: 'icon-microwave' },
  { id: 'gas', label: 'Gas', icon: 'icon-gas' },
  { id: 'water', label: 'Water', icon: 'icon-water' }
];

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const handleLocationChange = (e) => {
    dispatch(setLocation(e.target.value));
  };

  const handleVehicleTypeChange = (typeId) => {
    dispatch(setVehicleType(typeId === filters.vehicleType ? '' : typeId));
  };

  const handleFeatureToggle = (feature) => {
    dispatch(toggleFeature(feature));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchBar}>
        <p>Location</p>
        <div className={styles.inputWrapper}>
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
        </div>
      </div>

      <div className={styles.sectionFilters}>
        <p className={styles.filterTitle}>Filters</p>

        <div className={styles.sectionFilter}>
          <h3 className={styles.sectionTitle}>Vehicle equipment</h3>
          <div className={styles.features}>
            {features.map(({ id, label, icon }) => (
              <label key={id} className={styles.feature}>
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

      <button onClick={handleReset} className={styles.resetButton}>
        Search
      </button>
    </div>
  );
};

export default Filters;
