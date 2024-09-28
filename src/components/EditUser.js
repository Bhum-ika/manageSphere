
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import Loader from "../utils/Loader.js";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase.js"; // Adjust import based on your setup
import { useMutation } from "react-query-firestore";

function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState(location.state.name);
  const [email, setEmail] = useState(location.state.email);
  const [address, setAddress] = useState(location.state.address);
  const[code,setCode]=useState(location.state.userCode);
  const [newPassword, setNewPassword] = useState("");
  const uid = location.state.uid;
  const adminName = location.state.adminName;
  const [loading, setLoading] = useState(false);
 console.log(location.state.userCode)
  const successMsg = () => toast.success("User details edited!", {
    style: {
      backgroundColor: '#4BB543',
      color: 'white'
    }
  });
  
  const emailSentMsg = () => toast.success("Email sent!", {
    style: {
      backgroundColor: '#4BB543',
      color: 'white'
    }
  });

  const errorMsg = (error) => toast.error(`Error: ${error.message}`, {
    style: {
      backgroundColor: 'red',
      color: 'white'
    }
  });
const {mutate:editMutation}=useMutation({
  mutationFn:async(updateData) =>{
    await updateDoc(doc(db, "users", uid), updateData);
  
  } ,
  onSuccess:()=>{
    successMsg();
    if (newPassword) {
      notifyUser();
    }
  },
  onError:(err)=>{
    console.log(err)
  }
})
  const handleEditAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = {
      displayName: name,
      eCode:code,
      email,
      address,
    };

    if (newPassword) {
      updateData.password = newPassword;
    }

    editMutation(updateData)
  };

  const notifyUser = () => {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    const userId = process.env.REACT_APP_EMAILJS_PRIVATE_KEY;
    const templateParams = {
      user_name: name,
      user_email: email,
      user_id: uid,
      from_name: adminName,
      admin_name: adminName,
      message: `Your password has been updated. New password: ${newPassword}`,
    };

    emailjs.init(userId);

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        emailSentMsg();
      })
      .catch((error) => {
        errorMsg(error);
      });
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 p-2">
      <div className="flex place-content-end">
        <button
          className="px-5 py-1 border-2 border-blue-200 shadow-lg rounded-xl w-[8vw] gap-1 font-medium flex items-baseline"
          onClick={() => navigate('/allUsers')}
        >
          Go back<FaArrowLeft size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
        <div className="border-2 shadow-lg p-14 rounded-xl bg-white">
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleEditAccount} className="flex flex-col gap-2 w-[20vw]">
              <input
                  type="text"
                  name="eCode"
                  placeholder="Employee Code"
                  className="border-2 border-slate-300 p-3 outline-none rounded-lg"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="border-2 border-slate-300 p-3 outline-none rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border-2 text-slate-400 p-3 outline-none rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
                <textarea
                  placeholder="Address"
                  className="border-2 border-slate-300 p-3 outline-none rounded-lg"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="border-2 border-slate-300 p-3 outline-none rounded-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword ? (
                  <button
                    type="button"
                    onClick={notifyUser}
                    className="bg-yellow-300 font-medium hover:bg-yellow-400 p-3 outline-none rounded-lg flex items-center justify-center mt-5"
                    disabled={loading}
                  >
                    Update User Details & <span className="font-semibold mx-1">Notify User</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-yellow-300 font-medium hover:bg-yellow-400 p-3 outline-none rounded-lg flex items-center justify-center mt-5"
                    disabled={loading}
                  >
                    Update User Details
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditUser;
