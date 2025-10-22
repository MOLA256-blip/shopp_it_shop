import HomeCard from "./HomeCard"

const cardcontainer = ({ products }) => {
  return (
    <section className="py-5" id="shop">
    <div className="container px-4 px-lg-5 mt-3">
        <div className="row gx-4 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
         {products.map((product) => (
           <HomeCard 
             key={product.id}
             product={product}
           />
         ))}
    </div>
    </div>
    </section>
  )
}

export default cardcontainer
  
