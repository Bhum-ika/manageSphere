import React, { useEffect ,useState} from 'react'
import {getAuth,sendPasswordResetEmail} from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const navigate=useNavigate();
   const[email,setEmail]=useState('')
  const success= () => toast.success("Link sent!", {
    style: {
      backgroundColor: '#4BB543',
      color: 'white'
    }
  });

  const errorMsg = (error) => toast.error(`Error: ${error.message}`, {
    style: {
      backgroundColor: 'red',
      color: 'white'
    }
  });
  const forgotPassword = () => {
    // const auth=getAuth();
    // sendPasswordResetEmail(auth, email)
    //   .then(() => {
    //     success();
    //   })
    //   .catch((error) => {
    //     const errorMessage = error.message;
    //     errorMsg(errorMessage);
    //     // ..
    //   });
    console.log("hi");
    
  };
    
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center bg-[#f3f3f9] '>
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: 'auto' }}
      />

      <div className='gap-3 flex flex-col items-center border-2  bg-white'>
        
     <div className='p-4 w-full flex flex-col items-center gap-4 pt-10'>
     <h1 className='font-medium' >To reset your password, please provide your email address in the input box below. </h1>
      <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            className='p-3 outline-none rounded-lg bg-transparent border-2 hover:border-zinc-400'
            onChange={(e) => setEmail(e.target.value)}
          
          />
        <h1  className='text-sm italic '>You will receive a link on your Email</h1>
     </div>

     
  {/* //<h1 className='text-sm italic '>Click on the button below to reset your password </h1> */}
 <div className='border-t-2 w-full py-2 flex justify-center  gap-2'>
 <button onClick={()=>forgotPassword} className='px-4 py-1  bg-blue-200 text-blue-800 hover:text-white font-medium  hover:bg-blue-400 transition-all duration-100'>Send Email</button>
 <Link to='/loginUser' className='px-4 py-1  bg-yellow-100 text-red-600  font-medium  hover:bg-yellow-100 transition-all duration-100'>Cancel</Link>

 </div>
</div>
    </div>
  )
}

export default ForgotPassword