import React from 'react';
import ProductList from '../products/ProductList';
import { useParams } from 'react-router-dom';
import ProductFilter from '../products/ProductFilter';


function ProductsCategoryPage() {
const { category } = useParams();
console.log('category - ',category);
  return (
    <div className='pt-6 md:pt-14 pb-2 bbscontainer'>
        <div className="flex flex-row">
          <div className="md:w-[25%] lg:w-[20%]"><ProductFilter/></div>
          <div className="w-100 md:w-[85%] lg:w-[80%]"><ProductList heading={category} type="Grid" filter={true} category={category}/></div>
        </div>
    </div>
  )
}

export default ProductsCategoryPage