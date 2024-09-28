import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebase.js';

function CreateAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user in Firestore with role as 'admin'
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role: 'admin',
      });

      // Clear form fields and show success message
      setEmail('');
      setPassword('');
      setSuccessMessage('Admin created successfully');
      setError('');
    } catch (error) {
      // Handle errors and display error message
      setError(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className='m-10'>
      <h1>Create Admin</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded'
          required
        />
        <button
          type='submit'
          className='px-5 py-2 bg-blue-500 text-white rounded'
        >
          Create Admin
        </button>
        {error && <p className='text-red-500'>{error}</p>}
        {successMessage && <p className='text-green-500'>{successMessage}</p>}
      </form>
    </div>
  );
}

export default CreateAdmin;
