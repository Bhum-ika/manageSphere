import React, { useEffect, useState } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDelete, MdDesignServices, MdEdit } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { RiPagesFill } from "react-icons/ri";
import Loader from "../utils/Loader.js";
import { getData } from "../utils/firebaseFunctions.js";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function AllUsers() {
  const navigate = useNavigate();
  //const location = useLocation();
  const queryClient = useQueryClient();
  const [allUsers, setAllUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
const [prevDocs, setPrevDocs] = useState(null); // Keep track of previous documents for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [msg, setMsg] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const pagesize = 4;

  const { data, isLoading, error, refetch } = useQuery(
    ["users", currentPage,pagesize],
    () => getData(pagesize, lastDoc,prevDocs), // Use startAt for first page, otherwise startAfter
    {
      //keepPreviousData: true,
      onSuccess: (newData) => {
        if (newData.users.length > 0) {
          setAllUsers(newData.users);
          if (newData.lastVisible !== lastDoc) {
            setLastDoc(newData.lastVisible);
          }
          if (currentPage === 1) {
            // Reset previous docs on the first page
            setPrevDocs([]);
          } else {
            if (newData.firstVisible !== prevDocs[prevDocs.length - 1]) {
              setPrevDocs(newData.firstVisible);
            }
            console.log(prevDocs)
          }
        } else {
          console.log("No users returned on initial load");
        }
      },
      onError: (error) => {
        console.error("Error fetching users:", error);
      },
    }
  );
  // useEffect(() => {
  //   if (data) {
  //     console.log("Data exists:", data);
  //     if (data.users) {
  //       console.log("Users array:", data.users);
  //       if (data.users.length > 0) {
  //         setAllUsers(data.users);
  //       } else {
  //         console.log("Users array is empty");
  //       }
  //     } else {
  //       console.log("Users key does not exist");
  //     }
  //   } else {
  //     console.log("Data is undefined, refetching...");
  //     refetch();
  //   }
    
  // }, [data, refetch]);
  
  // useEffect(() => {
  //   console.log("Users:", allUsers);
  //   console.log("Last Document:", lastDoc);
  //   console.log("Previous Documents:", prevDocs);
  //   if (lastDoc) {
  //     console.log("Last Document Data:", lastDoc.data());
  //   } else {
  //     console.log("lastDoc is undefined");
  //   }
  //   if (prevDocs?.length > 0) {
  //     console.log("First Document Data:", prevDocs[prevDocs?.length - 1]?.data());
  //   } else {
  //     console.log("prevDocs is empty");
  //   }
  // }, [allUsers, lastDoc, prevDocs]);



  const handleSearch = (value) => {
    if (!data || !data.users) {
      console.error("Data is not available.");
      return;
    }

    if (value.trim() === "") {
      setAllUsers(data.users || []);
      setIsSearch(false);
      return;
    }

    setLoading(true);
    try {
      const searchResult = data.users.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.eCode.toLowerCase().includes(value.toLowerCase())
      );

      if (searchResult.length > 0) {
        setAllUsers(searchResult);
        setIsSearch(false);
      } else {
        setIsSearch(true);
        setMsg("Not Found");
        setAllUsers([]);
      }
    } catch (err) {
      console.error("Error during search:", err);
    } finally {
      setLoading(false);
    }
  };

  const { mutate: deleteUserMutation, isLoading: deletionLoading } =
    useMutation(
      async (userId) => {
        await axios.delete(`http://localhost:5000/delete-user/${userId}`);
      },
      {
        onMutate: async (userId) => {
          await queryClient.cancelQueries(["users"]);
          const previousData = queryClient.getQueryData(["users"]);
          if (previousData) {
            queryClient.setQueryData(["users"], (oldData) =>
              oldData.filter((user) => user.id !== userId)
            );
            setAllUsers((prev) => prev.filter((u) => u.id !== userId));
          }
          return { previousData };
        },
        onError: (err, userId, context) => {
          console.log(err);
          if (context?.previousData) {
            queryClient.setQueryData(["users"], context.previousData);
          }
        },
        onSuccess: () => {
          toast.success("User successfully deleted");
        },
        onSettled: () => {
          queryClient.invalidateQueries("users");
        },
      }
    );

  const handleEdit = (user) => {
    navigate("/editUser", {
      state: {
        name: user.name,
        email: user.email,
        address: user.address,
        userCode: user.eCode,
        uid: user.id,
        adminName: window.localStorage.getItem("name"),
      },
    });
  };

  const handlePermissions = (user) => {
    navigate("/pageManager", {
      state: { userId: user.id, username: user.name },
    });
  };

  const handleDelete = (userId) => {
    deleteUserMutation(userId);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      refetch();
    }
  };

  const nextPage = () => {
    if (lastDoc) {
      setCurrentPage((prev) => prev + 1);
      refetch();
    }
  };

  if (loading || isLoading || deletionLoading ) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      <div className="m-2">
        <div className="flex flex-col m-4 justify-center">
          <h1 className="text-2xl text-center my-3 font-semibold">All Users</h1>
          <div className="flex justify-end mt-6">
            <div className="flex gap-3 border-2 px-3 py-4 rounded-xl border-zinc-400 hover:border-black w-1/5 h-14">
              <input
                className="outline-none"
                placeholder="Enter Emp.Code or Name"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch size={20} />
            </div>
          </div>
          {allUsers && allUsers.length > 0 ? (
            <TableContainer component={Paper} className="mt-4">
              <Table>
                <TableHead>
                  <TableRow className="bg-slate-100">
                    <TableCell align="center">
                      <h1 className="font-bold">Emp. Code</h1>
                    </TableCell>
                    <TableCell align="center">
                      <h1 className="font-bold">Name</h1>
                    </TableCell>
                    <TableCell align="center">
                      <h1 className="font-bold">Email</h1>
                    </TableCell>
                    <TableCell align="center">
                      <h1 className="font-bold">Address</h1>
                    </TableCell>
                    <TableCell align="center">
                      <h1 className="font-bold">Action</h1>
                    </TableCell>
                    <TableCell align="center">
                      <h1 className="font-bold">Permissions</h1>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUsers.map((user) => (
                    <TableRow key={user.id} className="hover:shadow-lg">
                      <TableCell align="center">{user.eCode}</TableCell>
                      <TableCell align="center">{user.name}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.address}</TableCell>
                      <TableCell align="center">
                        <div className="flex space-x-5 justify-center">
                          <button onClick={() => handleEdit(user)}>
                            <span className="hover:text-blue-700">
                              <MdEdit size={20} />
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletionLoading}
                          >
                            <span className="hover:text-blue-700">
                              <MdDelete size={20} />
                            </span>
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row space-x-3 justify-center">
                          <button
                            className="border-2 px-4 font-semibold pt-1 flex justify-center hover:border-blue-700 rounded-lg place-content-baseline gap-0.5 hover:bg-blue-700 hover:text-white shadow-md shadow-blue-100"
                            onClick={() => handlePermissions(user)}
                          >
                            {user.Pagesaccess}
                            <span className="py-0.5">
                              <RiPagesFill size={14} />
                            </span>
                          </button>
                          <button className="border-2 px-4 font-semibold pt-1 flex justify-center hover:border-blue-700 rounded-lg place-content-baseline gap-0.5 hover:bg-blue-700 hover:text-white shadow-md shadow-blue-100">
                          {user.Servicesaccess}
                            <span className="py-0.5">
                              <MdDesignServices size={14} />
                            </span>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between p-3">
                <button
                  onClick={previousPage}
                  className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${
                    data?.users.length < pagesize
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={data?.users.length < pagesize}
                >
                  Next
                </button>
              </div>
            </TableContainer>
          ) : isSearch ? (
            <div className="text-center mt-10">{msg}</div>
          ) : (
            <div className="text-center mt-10">No users available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
