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

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 4);

  return (
    <div className={styles.gallery}>
      {displayImages.map((image, index) => (
        <div
          key={index}
          className={styles.imageContainer}
          onClick={() => handleImageClick(index)}
        >
          <img 
            src={image.original} 
            alt={`Gallery image ${index + 1}`}
            className={styles.image}
          />
        </div>
      ))}

      {isModalOpen && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={`${styles.modalButton} ${styles.closeButton}`} 
              onClick={handleCloseModal}
            >
              ×
            </button>
            <button 
              className={`${styles.modalButton} ${styles.prevButton}`} 
              onClick={handlePrevImage}
            >
              ‹
            </button>
            <img
              src={images[selectedImage].original}
              alt={`Full size image ${selectedImage + 1}`}
              className={styles.modalImage}
            />
            <button 
              className={`${styles.modalButton} ${styles.nextButton}`} 
              onClick={handleNextImage}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
