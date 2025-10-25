import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Homecard.module.css'
import { BASE_URL } from '../../api';

const HomeCard = ({ product }) => {
  // Don't render the card if there's no image
  if (!product.image) {
    return null
  }

  return (
    <div className={styles.col}>
        <Link to={`/products/${product.slug}`} className={styles.link}>
            <div className={styles.card}>
                <div className={styles.CardImgWrapper}>
                    <img 
                      src={product.image || "https://dummyimage.com/600x700/dee2e6/6c757d.jpg"}
                      className={styles.CardImgTop}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "https://dummyimage.com/600x700/dee2e6/6c757d.jpg";
                      }}
                    />
                </div>
                <div className={styles.CardBody}>
                    <h5 className={`${styles.CardTitle} mb-1`}>{product.name}</h5>
                    <h6 className={styles.CardText}>${product.price}</h6>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default HomeCard