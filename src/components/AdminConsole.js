import React, { useEffect } from 'react'
import { useNavigate ,useLocation} from 'react-router-dom'
function AdminConsole() {
  const navigate=useNavigate();
  const location=useLocation();
 // const adminName=location.state.adminName;

 useEffect(() => {
  const role = localStorage.getItem('role');
  if (role === "admin") {
    navigate('/dashboard');
  } else {
    navigate('/');
  }
}, []);

  return (
    <div>AdminConsole

<div className="flex place-content-end" >
    <button className="px-5 py-1 border-2 border-blue-200 font-medium  shadow-md rounded-xl mr-8 hover:translate-y-1 transition-all duration-150" onClick={()=>navigate('/adminUserCreation')}>Create User 
    </button>
 </div>
    </div>
  )
}

export default AdminConsole