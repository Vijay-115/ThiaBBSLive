import React from 'react';
import ProductList from '../products/ProductList';
import { useParams } from 'react-router-dom';


function ProductsCategoryPage() {
const { category } = useParams();
console.log('category - ',category);
  return (
    <div className='pt-6 md:pt-14 pb-2 px-4'>
        <ProductList heading={category} type="Grid" category={category}/>
    </div>
  )
}

export default ProductsCategoryPage