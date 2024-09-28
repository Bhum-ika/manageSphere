import React, { useEffect, useState } from 'react';
import { accessUserPages } from '../utils/firebaseFunctions.js'; // Adjust the import path as needed
import Loader from '../utils/Loader.js';
import { useQuery,useQueryClient } from 'react-query-firestore';
function UserPages() {

  const queryClient=useQueryClient();

  const userId = window.localStorage.getItem('id');
  const[allPages,setAllPages]=useState([])
  const { data: pages, isLoading } = useQuery({
    queryKey:["eachuserPages",userId],
    queryFn:()=>accessUserPages(userId),
    onSuccess:(data)=>{
 queryClient.invalidateQueries("eachuserPages");
 setAllPages(data);
    },onError:(err)=>{
      console.log(err);
    }
  });

  useEffect(()=>{
    if(pages) setAllPages(pages)
  },[pages])

  return (
    <div className='w-full h-screen'>
      <div className='m-10'>
        {isLoading ? (
          <Loader />
        ) : (allPages?.length>0?(<>
          <h1 className='italic text-sm mb-5'>You have access to these pages:</h1>

    <table className='table-auto w-full border-collapse border border-blue-300'>
      <thead>
        <tr>
          <th className='border border-blue-300 bg-blue-100 px-4 py-2'>Page Name</th>
          <th className='border border-blue-300 px-4 bg-blue-100 py-2'>Page URL</th>
        </tr>
      </thead>
      <tbody>
        {allPages?.map((page) => (
          <tr key={page.id}>
            <td className='border border-blue-300 px-2 py-2 hover:bg-blue-200 text-center capitalize'>{page.name}</td>
            <td className='border border-blue-300 px-2 py-2 hover:bg-blue-200 text-center text-sm'>
              <a href={page.url} target="_self" rel="noopener noreferrer">
                {page.url}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>):("No pages")
        )}
      </div>
    </div>
  );
}

export default UserPages;
