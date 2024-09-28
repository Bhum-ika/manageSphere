import React, { useState,useEffect } from 'react'
import image from '../images/default.webp'
import rabbitImg from '../images/rabbit.png'
import beaverImg from '../images/beaver.png'
import deerImg from '../images/beaver.png'
import bisonImg from '../images/bison.png'
import catImg from '../images/cat.png'
import eweImg from '../images/ewe.png'
import jaguarImg from '../images/jaguar.png'
import koalaImg from '../images/koala.png'
import lemurImg from '../images/lemur.png'
import lamaImg from '../images/lama.png'
import madagascarImg from '../images/madagascar.png'
import monkeyImg from '../images/monkey.png'
import pandaImg from '../images/panda.png'
import pugImg from '../images/pug.png'
import slothImg from '../images/sloth.png'
import hippopotamusImg from '../images/hippopotamus.png'
// import { ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
// import { storage } from '../utils/firebase.js'

//import images from '../images'
import { MdEdit } from "react-icons/md";
function UserAccount() {
 const[userData,setUserData]=useState([])
 const [loading,setLoading]=useState(false);
  const[img,setImg]=useState(false)
  const[file,setFile]=useState('')

 useEffect(() => {
   
  const fetchUserData = async () => {
      try {
          setLoading(true);
        const storedUserData = window.localStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } else {
          console.error("No user data found in localStorage");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }finally{
          setLoading(false)
      }
    }
  fetchUserData();
  }, [setLoading]);
  
  const updateDetails=()=>{
  if(img){
//  const name=new Date().getTime()+file.name;
//  const storageRef=ref(storage,file.name)
//  const uploadTask=uploadBytesResumable(storageRef,file);
 
  }
  else{

  }
  }

  const updateImage=()=>{
    setImg(true) 
    console.log("clicked");
    
  }

  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
       <div className=' flex flex-col border-2 rounded-lg shadow-md px-8 py-8'>
        <div className='w-full flex place-content-end '>
        {!img?(<button onClick={()=>updateDetails}><MdEdit/></button>):null}
        </div>
       
      <div className='flex  '>
       
        <div className='border-r-2 pr-4'>
          <div className='rounded-full border-2 p-2'>
            <img src={image} alt="default" className='w-12 ' onClick={updateImage}/>
          </div>
        </div>
        {img?(<div>
          <div className='grid grid-cols-4 gap-3 pl-3'>
    <div className='p-2 border-2 rounded-full '>
        <img src={rabbitImg} alt='rabbit'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={beaverImg} alt='beaver'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={pugImg} alt='pug'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={pandaImg} alt='panda'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={koalaImg} alt='koala'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={lemurImg} alt='lemur'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={lamaImg} alt='lama'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={hippopotamusImg} alt='hippopotamus'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={slothImg} alt='sloth'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={madagascarImg} alt='madagascar'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={bisonImg} alt='bison'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={catImg} alt='cat'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={deerImg} alt='deer'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={eweImg} alt='ewe'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={jaguarImg} alt='jaguar'/>
    </div>
    <div className='p-2 border-2 rounded-full '>
        <img src={monkeyImg} alt='monkey'/>
    </div>
</div>
          </div>):(<div className='flex flex-col pl-4 gap-3'>
        <div className='flex gap-2'>
     <p className='font-medium w-32'>Name:</p>
     <p className=''>{userData.name}</p>
     </div>
     <div className='flex gap-2'>
     <p className='font-medium w-32 '>Email:</p>
     <p className=''>{userData.email}</p>
     </div>
     <div className='flex gap-2'>
     <p className='font-medium w-32 '>Phone No:</p>
     <p className=''>{userData?.phone}</p>
     </div>
     <div className='flex gap-2'>
     <p className='font-medium w-32 '>Address:</p>
     <p className=''>{userData.address}</p>
     </div>
     
     </div> )}
       
     </div>
     <button className='bg-yellow-300 px-2 w-1/2 mt-8 py-1 rounded-lg'>{img?("Upload Image"):('Update Account Details')}</button>

      </div>
    </div>
  )
}

export default UserAccount