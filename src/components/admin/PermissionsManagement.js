// import React, { useState, useEffect } from 'react';
// import { fetchUserPages, updatePagePermissions } from '../../utils/firebaseFunctions.js';
// import { useLocation ,useNavigate} from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PermissionsManagement = () => {
//   const notify = () => toast("Permissions Updated!", {
//     style: {
//       backgroundColor: '#4BB543',
//      color:'white'
      
//     },
    
//   });
  
//   const location = useLocation();
//   const navigate=useNavigate();
//   const [pages, setPages] = useState([]);
//   const [error, setError] = useState('');
//   const userId = location.state.userId;
//   const username=location.state.username;
//   useEffect(() => {
//     const loadPages = async () => {
//       try {
//         const pagesData = await fetchUserPages(userId);
//         setPages(pagesData.filter(page => page.isActive));
//       } catch (error) {
//         setError('Failed to load pages');
//       }
//     };

//     loadPages();
//   }, [userId]);

//   const handlePermissionChange = async (pageId, permissions) => {

//       setPages(prevPages => prevPages.map(page => page.id === pageId ? { ...page, permissions } : page));
//       setError('');
     
//   };

//   const handleSave = async (pageId, permissions) => {
//     const page = pages.find((page) => page.id === pageId);

//     if (page) {
//       try {
//         await updatePagePermissions(userId, pageId, permissions,navigate);
//         setPages((prevPages) =>
//           prevPages.map((p) =>
//             p.id === pageId ? { ...p, permissions } : p
//           )
//         );
//         notify();
//       } catch (error) {
//         console.error('Error updating page permissions:', error);
//         setError('Failed to update page permissions');
//       }
//     } else {
//       console.error('Page not found:', pageId);
//       setError('Page not found');
//     }
//   };

//   return (
//     <div>
//       <ToastContainer
//         position="top-right"
//         autoClose={1000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={{ width: 'auto' }} // Optional: Adjust the width of the ToastContainer if needed
//       />
//       <div className='w-full min-h-full h-screen'>
//         <div className='ml-10 mt-10'>
//         <h1 >User Name: <span className='font-bold '> {username}</span></h1>
//         </div>
//         <div className='m-10'>
//         <table className='border-2 w-11/12 border-black'>
//           <thead className='border-b-2 border-black'>
//             <tr>
//               <th className='border-r-2 border-black'>Page Name</th>
//               <th className='border-r-2 border-black'>Page URL</th>
//               <th className='border-r-2 border-black'>Read</th>
//               <th className='border-r-2 border-black'>Edit</th>
            
//             </tr>
//           </thead>
//           <tbody className='text-center'>
//             {pages.map((page) => (
//               <tr key={page.id}>
//                 <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>{page.name}</td>
//                 <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
//                   <a href={page.url} target="_blank" rel="noopener noreferrer">
//                     {page.url}
//                   </a>
//                 </td>
//                 <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
//                   <input
//                     type="checkbox"
//                     checked={page.permissions?.read || false}
//                     onChange={(e) =>
//                       handlePermissionChange(page.id, { ...page.permissions, read: e.target.checked })
//                     }
//                   />
//                 </td>
//                 <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
//                   <input
//                     type="checkbox"
//                     checked={page.permissions?.edit || false}
//                     onChange={(e) =>
//                       handlePermissionChange(page.id, { ...page.permissions, edit: e.target.checked })
//                     }
//                   />
//                 </td>
               
//                 <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
//                   <button
//                     className='border-2 px-4 py-1 rounded-lg border-green-200 hover:bg-green-200 hover:translate-x-1 transition-all ease-in-out duration-100 font-semibold'
//                     onClick={() => handleSave(page.id, page.permissions)}
//                   >
//                     Save
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default PermissionsManagement;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation,useQueryClient } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {accessUserPages, updatePagePermissions } from '../../utils/firebaseFunctions.js';
import Loader from '../../utils/Loader.js';

const PermissionsManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.userId;
  const username = location.state.username;
  const queryClient=useQueryClient();
const[pages,setPages]=useState([])
  // Fetch pages data using react-query
  const { data: fetchedpages, error, isLoading } = useQuery({
    queryKey: ["userPages", userId],
    queryFn: () => accessUserPages(userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["eachuserPages", userId], data);
      setPages(data)
    },
    onError: (err) => {
      console.log(err);
    },
    enabled: !!userId, // Only run query if `selectedUser` is available
  });
  useEffect(()=>{
    if(fetchedpages){
      setPages(fetchedpages)
    }
  },[fetchedpages]);

  // Mutation for updating permissions
 

  const handlePermissionChange = (pageId, permissions) => {
    // Update local state optimistically
    setPages(prevPages =>
      prevPages.map(page => (page.id === pageId ? { ...page, permissions } : page))
    );
  };

  const handleSave = (pageId, permissions) => {
    const page = pages.find((page) => page.id === pageId);
    // if (page) {
    //   mutation.mutate({ userId, pageId, permissions });
    // } else {
    //   toast.error('Page not found', { style: { backgroundColor: 'red', color: 'white' } });
    // }
  };

  if (isLoading) {
    return <Loader/>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Failed to load pages.</div>;
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: 'auto' }}
      />
      <div className='w-full min-h-full h-screen'>
        <div className='ml-10 mt-10'>
          <h1>User Name: <span className='font-bold'>{username}</span></h1>
        </div>
        <div className='m-10'>
          <table className='border-2 w-11/12 border-black'>
            <thead className='border-b-2 border-black'>
              <tr>
                <th className='border-r-2 border-black'>Page Name</th>
                <th className='border-r-2 border-black'>Page URL</th>
                <th className='border-r-2 border-black'>Read</th>
                <th className='border-r-2 border-black'>Edit</th>
                <th className='border-r-2 border-black'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>{page.name}</td>
                  <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                    <a href={page.url} target="_blank" rel="noopener noreferrer">{page.url}</a>
                  </td>
                  <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                    <input
                      type="checkbox"
                      checked={page.permissions?.read || false}
                      onChange={(e) =>
                        handlePermissionChange(page.id, { ...page.permissions, read: e.target.checked })
                      }
                    />
                  </td>
                  <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                    <input
                      type="checkbox"
                      checked={page.permissions?.edit || false}
                      onChange={(e) =>
                        handlePermissionChange(page.id, { ...page.permissions, edit: e.target.checked })
                      }
                    />
                  </td>
                  <td className='border-r-2 border-r-black border-b-2 px-4 py-1'>
                    <button
                      className='border-2 px-4 py-1 rounded-lg border-green-200 hover:bg-green-200 hover:translate-x-1 transition-all ease-in-out duration-100 font-semibold'
                      onClick={() => handleSave(page.id, page.permissions)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;

