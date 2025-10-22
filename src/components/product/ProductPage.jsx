import { useParams } from "react-router-dom"
import ProductPagePlaceholder from "./ProductPagePlaceHolder"
import RelatedProduct from "./RelatedProduct"
import { useEffect, useState } from "react"
import api from "../../api"


const ProductPage = () => {

    const {slug} =useParams()
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)
    const [similarProducts, setSimilarProducts] = useState([])

    useEffect(function(){
        setLoading(true)
       api.get(`/api/products/${slug}/`)
      .then(res =>{
        setProduct(res.data) 
        setLoading(false)
        if(res.data?.similar_products) {
            setSimilarProducts(res.data.similar_products)
        }
     })
     .catch(err =>{
        console.log('API Error:', err.message)
        setLoading(false)
     })
    }, [slug])

    // Simple non-functional add to cart
    function add_item(){
      const cartCode = localStorage.getItem('cart_code') || ''
      api.post('/api/add_item/', {
        cart_mode: cartCode,
        product_id: product.id
      })
      .then(res => {
        // Update cart code if new one was created
        if(res.data.cart_code) {
          localStorage.setItem('cart_code', res.data.cart_code)
        }
        console.log('Item added to cart')
      })
      .catch(err => {
        console.error('Error adding to cart:', err)
        // Handle invalid cart by clearing and retrying
        if(err.response?.status === 400 && err.response.data?.includes('Invalid cart')) {
          localStorage.removeItem('cart_code')
          add_item() // Retry with new cart
        }
      })
    }

  if(loading) {
    return <ProductPagePlaceholder />
  }

  return (
    <div>
        <section className="py-3">
        <div className="container px-4 px-lg-5 my-5">
        <div className="row  gx-lg-5 align-items-center">
            <div className="col-md-6">
                <img
                className="card-img-top mb-5 mb-md-0"
                src={product.image || "https://dummyimage.com/600x700/dee2e6/6c757d.jpg"}
                alt={product.name || "Product"}
                onError={(e) => {
                    e.target.src = "https://dummyimage.com/600x700/dee2e6/6c757d.jpg";
                }}
                />
            </div>
            <div className="col-md-6">
                    <div className="small mb-1">SKU: BST-498</div>
                    <h1 className="display-5 fw-bolder">{product.name || 'Product Name'}</h1>
                    <div className="fs-5 mb-5">
                        <span>${product.price || '0.00'}</span>
                    </div>
                    <p className="lead">
                     {product.description || 'Product description'}
                    </p>
                    <div className="d-flex">
                        <button className="btn btn-outline-dark flex-shrink-0"
                         type="button"
                         onClick={add_item}>
                         <i className="bi-cart-fill me-1"></i>
                         Add to Cart
                         </button>
                    </div>
             </div>   
            </div>
        </div>
        </section>

        <RelatedProduct products={similarProducts} />
        </div>
  )
}

export default ProductPage