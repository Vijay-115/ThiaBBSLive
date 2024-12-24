import React from 'react'
import SingleProduct from '../products/SingleProduct'
import { useParams } from 'react-router-dom';


function SingleProductPage() {
    const { id } = useParams();
    console.log('id - ',id);
  return (
    <>
        <SingleProduct/>
    </>
  )
}

export default SingleProductPage