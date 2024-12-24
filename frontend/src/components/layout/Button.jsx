import React from 'react';
import { Link } from 'react-router-dom';


function Button({link,name}) {
  return (
    <>
        <Link to={link} className="font-md border rounded-md border-blue-400 bg-blue-400 text-white py-1 px-3 inline-block mt-2 transition ease-in-out duration-200 hover:scale-110">
            {name}
        </Link>
    </>
  )
}

export default Button