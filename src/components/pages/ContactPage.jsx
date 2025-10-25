import { useState } from 'react'
import { toast } from 'react-toastify'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          {/* Contact Form */}
          <div className="col-lg-8 mb-4">
            <h1 className="mb-4">Contact Us</h1>
            <p className="lead mb-4">
              Have a question or feedback? We'd love to hear from you. 
              Fill out the form below and Juniot Junior will get back to you as soon as possible.
            </p>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Your Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Your Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-control"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark btn-lg"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Our Location
                </h5>
                <p className="card-text">
                  Amazing Street<br />
                  Kololo, Kampala<br />
                  Uganda
                </p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Phone
                </h5>
                <p className="card-text">
                  <strong>Mobile:</strong> 0701126433
                </p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email
                </h5>
                <p className="card-text">
                  <strong>Juniot Junior</strong><br />
                  <a href="mailto:juni@gmail.com">juni@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="card bg-light">
              <div className="card-body">
                <h5 className="card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Business Hours
                </h5>
                <p className="card-text mb-0">
                  <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br />
                  <strong>Saturday:</strong> 10:00 AM - 4:00 PM<br />
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
