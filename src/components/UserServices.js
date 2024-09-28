
import React, { useEffect } from 'react';
import {fetchUserServices } from '../utils/firebaseFunctions.js'; // Adjust the import path as needed
import Loader from '../utils/Loader.js';
import { useQuery,useMutation } from 'react-query-firestore';
import { useState } from 'react';
import axios from 'axios';
function UserServices() {
  const userId = window.localStorage.getItem('id');
  const[services,setServices]=useState([])
  const[loading,setLoading]=useState(false);
  const { data: userServices, isLoading,refetch } = useQuery({queryKey:["userServices",userId],
    queryFn:()=>fetchUserServices(userId),
    enabled:false,

  onSuccess:(data)=>{
    setServices(data);
    console.log(data)
  },
  onError:(err)=>{
  console.log(err)
  }
});
useEffect(()=>{
  if(userServices){
    setServices(userServices)
  }
  else{
   refetch()
  }
},[userServices,refetch])

const { mutate: fetchMutate } = useMutation({
  mutationFn: async ({path,propertyFile}) => {
    setLoading(true);
console.log(path,propertyFile);

    try {
      const response = await axios.post('http://192.168.60.124:8081/submitScriptExecString?scriptExecString=path,property', {
        scriptExecString: `${path},${propertyFile}`,      }, {
          headers: {
            'Content-Type': 'application/json',
            'auth-0': "auth-0",
            'timeStamp': new Date().toISOString(),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Credentials': true,
          }
      });
     console.log(response.data)
      // Access the data from the response
      return response.data;
    } catch (error) {
      // Handle errors
      console.error('Error:', error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  onSettled: () => {
    setLoading(false);
  },
});


const fetchApi=(path,propertyFile)=>{
  fetchMutate({path,propertyFile})
}
  return (
    <div className='w-full h-screen'>
      <div className='m-10'>
        
        {loading||isLoading ? (
          <Loader />
        ) : (
          
          services.length>0?
            
          (<><h1 className='italic text-sm mb-5'>You have access to these services:</h1>
          <table className='table-auto w-full border-collapse border border-blue-300'>
            <thead>
              <tr>
                <th className='border border-blue-300 bg-blue-50 px-4 py-2'>Service Name</th>
                <th className='border border-blue-300 px-4 bg-blue-50 py-2'>Service URL</th>
                <th className='border border-blue-300 px-4 bg-blue-50 py-2'>Property File</th>
                <th className='border border-blue-300 px-4 bg-blue-50 py-2'>Action</th>

              </tr>
            </thead>
            <tbody>
             { services?.map((service) => (
                <tr key={service.id}>
                  <td className='border border-blue-300 px-2 py-2 hover:bg-blue-200 text-center capitalize'>{service.name}</td>
                  <td className='border border-blue-300 px-2 py-2 hover:bg-blue-200 text-center text-sm'>
                    {service.path}
                  </td>
                  <td className='border border-blue-300 px-2 py-2 hover:bg-blue-200 text-center capitalize'>{service.propertyFile}</td>

                  <td className='text-center'><button onClick={()=>fetchApi(service.path,service.propertyFile)} className='px-4 py-1 text-white bg-blue-400 hover:bg-blue-500 rounded-lg'>Execute</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
          ):("NO services")
        )}
      </div>
    </div>
  );
}

export default UserServices;
