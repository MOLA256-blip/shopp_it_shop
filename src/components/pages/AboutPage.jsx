const AboutPage = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="mb-4">About Shoppit</h1>
            
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Who We Are</h3>
                <p className="card-text">
                  Welcome to Shoppit, your number one source for quality products. 
                  We're dedicated to providing you the very best shopping experience, 
                  with an emphasis on customer service, quality products, and competitive prices.
                </p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Our Mission</h3>
                <p className="card-text">
                  Our mission is to make online shopping easy, convenient, and accessible 
                  to everyone. We strive to offer a wide variety of products at the best 
                  prices, delivered right to your doorstep.
                </p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Why Choose Us?</h3>
                <ul className="list-unstyled">
                  <li className="mb-2">✅ <strong>Quality Products</strong> - We source only the best items</li>
                  <li className="mb-2">✅ <strong>Secure Payments</strong> - Multiple payment options including Flutterwave, MTN, and Airtel</li>
                  <li className="mb-2">✅ <strong>Fast Delivery</strong> - Quick and reliable shipping</li>
                  <li className="mb-2">✅ <strong>Customer Support</strong> - We're here to help 24/7</li>
                  <li className="mb-2">✅ <strong>Easy Returns</strong> - Hassle-free return policy</li>
                </ul>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">Our Story</h3>
                <p className="card-text">
                  Founded in 2025, Shoppit has come a long way from its beginnings. 
                  When we first started out, our passion for providing quality products 
                  drove us to start our own business.
                </p>
                <p className="card-text">
                  Based in Kololo, Kampala, Uganda, we now serve customers all over Uganda 
                  and are thrilled that we're able to turn our passion into our own website. 
                  We hope you enjoy our products as much as we enjoy offering them to you.
                </p>
              </div>
            </div>

            <div className="card bg-light">
              <div className="card-body text-center">
                <h3 className="card-title">Get in Touch</h3>
                <p className="card-text">
                  Have questions? We'd love to hear from you!
                </p>
                <a href="/contact" className="btn btn-dark">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
