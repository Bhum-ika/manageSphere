import React, { useEffect, useState } from 'react';
  
import Loader from '../utils/Loader.js';
function UserDashBoard() {
    const [userData, setUserData] = useState(null);
    const [ loading, setLoading  ]= useState(false);
    const [error, setError] = useState("");
  
   

     useEffect(() => {
   
    const fetchUserData = async () => {
        try {
            setLoading(true);
            //setState(false);  // Set loading state for user data
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
    


   

    if (loading) {
        <Loader/>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
     

    return (
        <>
       <div className='w-full min-h-screen'>
       <div className='m-10 text-center'>
                {userData ? (
                    <div >
                        <p className='text-xl font-bold'>Welcome {userData?.name}</p>

                    </div>
                ) : (
                    <div>No user data available.</div>
                )}
               
               
            </div>
       </div>
            
        </>
    );
}

export default UserDashBoard;
