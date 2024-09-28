import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { useNavigate, Link } from 'react-router-dom';
import { ImSpinner3 } from 'react-icons/im';

function LoginUser() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  const fetchRole = async (email, password) => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      window.localStorage.setItem("token", user.accessToken);
      window.localStorage.setItem("userData", JSON.stringify(user));

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const roles = userData.roles;
        const userName = userData.name;
        const userCode = userData.eCode;
        window.localStorage.setItem("userData", JSON.stringify(userData));
        window.localStorage.setItem("name", userName);
        window.localStorage.setItem("code", userCode);
        window.localStorage.setItem("id", user.uid);

        return roles;
      } else {
        setError('User document does not exist.');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (e) => {
    e.preventDefault();
    setIsAdmin(true);

    if (email === "" || password === "") {
      setError("Fill in your credentials");
      return;
    }

    const roles = await fetchRole(email, password);

    if (roles && roles.includes('admin')) {
      window.localStorage.setItem("role", "admin");
      navigate('/dashboard');
    } else {
      setError('User does not have admin privileges.');
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Fill in your credentials");
      return;
    }

    const roles = await fetchRole(email, password);

    if (roles && roles.includes('user')) {
      window.localStorage.setItem("role", "user");
      navigate('/userDashboard');
    } else {
      setError('User does not have user privileges.');
    }
  };

  return (
    <div className='flex justify-center h-screen items-center bg-[#f3f3f9]'>
      <div className='border-2 rounded-lg p-14 bg-white'>
        <div className='text-center mb-10'>
          <h1 className='font-semibold text-2xl'>Login</h1>
        </div>

        <form className='flex flex-col gap-3 w-[20vw]'>
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={email}
            className='p-3 outline-none rounded-lg bg-transparent border-2 hover:border-zinc-400'
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            className='p-3 outline-none rounded-lg bg-transparent border-2 hover:border-zinc-400'
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className='flex justify-center gap-3'>
            <button
              type='button'
              className='border-2 p-3 w-full flex justify-center outline-none rounded-xl mt-3 bg-yellow-300 text-black hover:bg-[#4BB543] hover:text-white hover:cursor-pointer'
              disabled={loading}
              onClick={loginAdmin}
            >
              {loading && isAdmin ? <ImSpinner3 /> : 'Login as Admin'}
            </button>
            <button
              type='button'
              className='border-2 p-3 w-full flex justify-center outline-none rounded-xl mt-3 bg-yellow-300 text-black hover:bg-[#4BB543] hover:text-white hover:cursor-pointer'
              disabled={loading}
              onClick={loginUser}
            >
              {loading && isAdmin === false ? <ImSpinner3 /> : 'Login as User'}
            </button>
          </div>

          {error && (
            <h1 className='text-red-500 text-center text-xs mt-1'>
              {error}
            </h1>
          )}

          <Link
            to='/forgotPassword'
            className='text-blue-500 text-center text-xs mt-3'
          >
            Forgot Password?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginUser;
