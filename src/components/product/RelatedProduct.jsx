import HomeCard from '../home/HomeCard'


const RelatedProduct = ({ products }) => {
  console.log('RelatedProduct received:', products)
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <section className="py-3 bg-light">
        <div className="container px-4 px-lg-5 mt-3">
        <h2 className="fw-bolder mb-4">Related Products</h2>
                <div className="row gx-4 gx-lg-5 row-cols-md-3 row-cols-xl-4 justify-content">
                  {products.map(product => (
                    <HomeCard key={product.id} product={product} src={product.image} />
                  ))}
                    {/* <HomeCard /> */}
                 
            </div>
        </div>
    </section>
  )
}

export default RelatedProduct