import React, { useEffect, useState } from 'react';
import {userPages, addPage, updateUserPageAccess, deletePageAndData } from '../../utils/firebaseFunctions.js'; // Ensure these are correctly imported
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader.js';
import { useQuery } from 'react-query-firestore';
import { useMutation, useQueryClient} from 'react-query';
const PageManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const[allPages,setAllPages]=useState([])

  const userId = location.state.userId;
  const username = location.state.username;
  const queryClient=useQueryClient();
  // React Query hooks
  const { data: pages, isLoading:pagesLoading, isError,refetch } = useQuery({
    queryKey: ["userPages", userId],
    queryFn: () => userPages(userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["userPages", userId], data);
      setAllPages(data)
    },
    onError: (err) => {
      console.log(err);
    },
   // enabled: !!userId, // Only run query if `selectedUser` is available
  });
  useEffect(()=>{
    if(pages){
      setAllPages(pages)
    }else{
      refetch();
    }
  },[pages,refetch])
  
 
  const {mutate:updatePageAccessMutation} = useMutation({
    mutationFn: ({ userId, pageId, isActive }) => updateUserPageAccess(userId, pageId, isActive),

    onMutate: async ({ userId, pageId, isActive }) => {
      await queryClient.cancelQueries(["userPages", userId]);
      
      
      const previousData = queryClient.getQueryData(["userPages", userId]);

      if (previousData) {
        queryClient.setQueryData(["userPages", userId], (old) =>
          old.map((page) =>
            page.id === pageId ? { ...page, isActive } : page
          )
        );
      }

     
      return { previousData };
    },
  
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userPages", context.userId], context.previousData);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["userPages", variables.userId]);
      
    },
  })
  

  const handleCheckboxChange = (pageId, isActive) => {
     setAllPages(allPages.map((page)=>page.id===pageId?{...page,isActive}:page))
    console.log(pageId,isActive)
    
  };

  const handleSaveClick = (pageId, isActive) => {
  updatePageAccessMutation( {userId, pageId, isActive} );
    //console.log("here",userId, pageId, isActive)
  };

  

  if (pagesLoading) return <Loader />;
  if (isError) return <p style={{ color: 'red' }}>Failed to load pages</p>;

  return (
    <div>
      <div className='ml-10 mt-10 mb-4'>
        <h1>User Name: <span className='font-bold'>{username}</span></h1>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className='mx-8'>
       
        <table className='border-2 w-11/12 border-black'>
          <thead className='border-b-2 border-black'>
            <tr>
              <th className='border-r-2 border-black'>Page Name</th>
              <th className='border-r-2 border-black'>Page URL</th>
              <th className='border-r-2 border-black'>isActive</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {allPages?.map((page) => (
              <tr key={page.id}>
                <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>{page.name}</td>
                <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                  <a href={page.url} target="_blank" rel="noopener noreferrer">
                    {page.url}
                  </a>
                </td>
                <td className='border-r-2 border-r-black border-b-2 px-8 py-1'>
                  <input
                    type='checkbox'
                    checked={page.isActive}
                    onChange={(e) => handleCheckboxChange(page.id, e.target.checked)}
                  />
                </td>
                <td className='border-r-2 border-r-black px-4 py-1 border-b-2'>
                  <button className='border-2 px-4 py-1 rounded-lg border-green-200 hover:bg-green-200 hover:translate-x-1 transition-all ease-in-out duration-100 font-semibold' onClick={() => handleSaveClick(page.id, page.isActive)}>Save</button>
                </td>
                <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                  {page.isActive && <button className='border-2 border-zinc-300 px-4 py-1 rounded-lg hover:border-black hover:translate-x-1 transition-all ease-in-out duration-100 font-semibold' onClick={() => navigate('/permissions', { state: { userId, username } })}>View</button>}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageManager;
