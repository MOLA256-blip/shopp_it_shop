import Header from "./Header"
import CardContainer from "./cardcontainer"
import PlaceHolderContainer from "../ui/PlaceHolderContainer"
import api from '../../api'
import { useEffect, useState } from 'react'
import Error from "../ui/Error"


const Homepage = () => {
  const [products, setProducts] = useState([])
  const [Loading, setLoading] = useState(true)
  const [error, setError] =useState("")

  useEffect(function(){
    if(localStorage.getItem("cart_mode") === null)(
      localStorage.setItem("cart_mode", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
    )
  },[])

  useEffect(function(){
    api.get("/api/products/")
    .then(res => {
      console.log(res.data)
      setProducts(res.data)
      setLoading(false)
      setError("")
    })

    .catch(err => {
      console.log(err.message)
      setLoading(false)
      setError(err.message)

    })
  },[])

  return (
    <>
      <Header />
      {Loading &&<PlaceHolderContainer />}
      {!Loading && !error && <CardContainer products={products} />}
    </>
  )
}

export default Homepage