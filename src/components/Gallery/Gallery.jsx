import { useState } from 'react';
import styles from './Gallery.module.css';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img
          src={images[0].original}
          alt="Main view"
          onClick={() => handleImageClick(0)}
        />
      </div>
      <div className={styles.thumbnails}>
        {images.slice(1).map((image, index) => (
          <div
            key={index + 1}
            className={styles.thumbnail}
            onClick={() => handleImageClick(index + 1)}
          >
            <img src={image.thumb} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ×
            </button>
            <button className={styles.navButton} onClick={handlePrevImage}>
              ‹
            </button>
            <img
              src={images[selectedImage].original}
              alt={`Image ${selectedImage + 1}`}
            />
            <button className={styles.navButton} onClick={handleNextImage}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
