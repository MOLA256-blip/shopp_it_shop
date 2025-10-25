import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'

const ShopPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const res = await api.get('/api/products/')
      setProducts(res.data)
      setError('')
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    )
  }

  return (
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4">Shop All Products</h1>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Products Count */}
        <p className="text-muted mb-4">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="alert alert-info">
            No products found. Try adjusting your search or filter.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100 shadow-sm">
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={product.image || '/placeholder.jpg'}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">
                      <Link to={`/products/${product.slug}`} className="text-decoration-none text-dark">
                        {product.name}
                      </Link>
                    </h5>
                    {product.category && (
                      <span className="badge bg-secondary mb-2 align-self-start">
                        {product.category}
                      </span>
                    )}
                    <p className="card-text text-muted small flex-grow-1">
                      {product.description?.substring(0, 100)}
                      {product.description?.length > 100 ? '...' : ''}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="h5 mb-0">${Number(product.price).toLocaleString()}</span>
                      <Link to={`/products/${product.slug}`} className="btn btn-sm btn-dark">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ShopPage
