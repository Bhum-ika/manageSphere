import React from 'react'
import { ImSpinner3 } from "react-icons/im";
function Loader() {
    return(
        <div className='flex justify-center items-center w-full h-screen'>
            <ImSpinner3 size={50}/>
        </div>
    )
}

export default Loader