import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { IoPersonAdd } from 'react-icons/io5';
import { GiCancel } from 'react-icons/gi';
import axios from 'axios';
import Loader from '../utils/Loader.js';
import { useQueryClient } from 'react-query-firestore';
const AdminUserCreation = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { eCode: '', name: '', email: '', password: '', address: '', roles: ['user'] },
  ]);
  

  const errorMsg = (error, name) =>
    toast(`Error creating ${name}'s account: ${error.message}`, {
      style: {
        backgroundColor: '#E4003A',
        color: 'white',
      },
    });

  const fetchCreation = async (user) => {
    const response = await axios.post('http://localhost:5000/create-user', user);
    console.log(response.data);
   
   
  };
const queryClient=useQueryClient();
  
const { mutate: createUserMutation, isLoading } = useMutation(fetchCreation, {
  onMutate: async (newUser) => {
    await queryClient.cancelQueries('users');
    const previousUsers = queryClient.getQueryData('users');
    queryClient.setQueryData('users', (old = []) => [...old, newUser]);
    return { previousUsers };
  },
  onError: (error, newUser, context) => {
    queryClient.setQueryData('users', context.previousUsers);
    errorMsg(error, newUser.name);
  },
  onSuccess: () => {
    //successMsg();
    navigate("/allUsers", { state: { added: true } });
  },
  onSettled: () => {
    queryClient.invalidateQueries('users');
  },
});
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newUsers = [...users];
    newUsers[index][name] = value;
    setUsers(newUsers);
  };

  const handleRoleChange = (index, role) => {
    const newUsers = [...users];
    const userRoles = newUsers[index].roles;
    if (userRoles.includes(role)) {
      newUsers[index].roles = userRoles.filter(r => r !== role);
    } else {
      newUsers[index].roles = [...userRoles, role];
    }
    setUsers(newUsers);
  };

  const addUser = () => {
    setUsers([
      ...users,
      { eCode: '', name: '', email: '', password: '', address: '', roles: ['user'] },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(users.map(user => createUserMutation(user)));
     // navigate("/allUsers", { state: { added: true } });
    } catch (error) {
      console.error("Error creating users:", error);
    }
  };

  const removeUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      
      <div className="m-10">
        <div className="flex justify-end">
          <button
            className="px-5 py-1 border-2 border-black shadow-lg rounded-xl w-[8vw] font-medium flex items-baseline"
            onClick={() => navigate('/allUsers')}
          >
            Go back
            <FaArrowLeft size={12} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {users.map((user, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                name="eCode"
                placeholder="Employee Code"
                className="border-2 border-slate-300 px-3 outline-none rounded-lg"
                value={user.eCode}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="border-2 border-slate-300 px-3 outline-none rounded-lg"
                value={user.name}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border-2 border-slate-300 px-3 outline-none rounded-lg"
                value={user.email}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border-2 border-slate-300 px-3 outline-none rounded-lg"
                value={user.password}
                onChange={(e) => handleChange(index, e)}
                required
              />
              <textarea
                name="address"
                placeholder="Address"
                className="border-2 border-slate-300 px-3 outline-none rounded-lg"
                value={user.address}
                onChange={(e) => handleChange(index, e)}
              />
              <div className="flex items-center">
                <label className="mr-2">Admin</label>
                <input
                  type="checkbox"
                  checked={user.roles.includes('admin')}
                  onChange={() => handleRoleChange(index, 'admin')}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-2">User</label>
                <input
                  type="checkbox"
                  checked={user.roles.includes('user')}
                  onChange={() => handleRoleChange(index, 'user')}
                />
              </div>
              <button
                type="button"
                onClick={addUser}
                className="hover:bg-slate-100 h-10 px-4 rounded-md"
              >
                <IoPersonAdd size={30} sx={{ color: 'green' }} />
              </button>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => removeUser(index)}
                  className="hover:bg-slate-100 h-10 px-4 rounded-md"
                >
                  <GiCancel size={25} />
                </button>
              )}
            </div>
          ))}
          <input
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 outline-none font-medium shadow-md hover:bg-blue-700 w-[8vw] rounded-md"
            value="Create Users"
          />
        </form>
      </div>
    </>
  );
};

export default AdminUserCreation;
