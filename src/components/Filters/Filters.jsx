import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setVehicleType, toggleFeature, resetFilters } from '../../redux/slices/filtersSlice';
import styles from './Filters.module.css';

const vehicleTypes = [
  { id: 'panelTruck', label: 'Van' },
  { id: 'fullyIntegrated', label: 'Fully Integrated' },
  { id: 'alcove', label: 'Alcove' }
];

const features = [
  { id: 'AC', label: 'AC' },
  { id: 'automatic', label: 'Automatic' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'TV', label: 'TV' },
  { id: 'bathroom', label: 'Bathroom' }
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
        <input
          type="text"
          placeholder="Search by location..."
          value={filters.location}
          onChange={handleLocationChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Vehicle Type</h3>
        <div className={styles.vehicleTypes}>
          {vehicleTypes.map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.typeButton} ${
                id === filters.vehicleType ? styles.active : ''
              }`}
              onClick={() => handleVehicleTypeChange(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Vehicle Equipment</h3>
        <div className={styles.features}>
          {features.map(({ id, label }) => (
            <label key={id} className={styles.feature}>
              <input
                type="checkbox"
                checked={filters.features[id]}
                onChange={() => handleFeatureToggle(id)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleReset} className={styles.resetButton}>
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
