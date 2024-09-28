import React, { useState, useEffect } from "react";
import { db } from "../../utils/firebase.js"; // Adjust the import as necessary
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { MdDelete, MdEdit, MdCancel } from "react-icons/md";
import { BsSaveFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Input,
  InputLabel,
} from "@mui/material";
import { deletePageAndData, addPage } from "../../utils/firebaseFunctions.js";
import { useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient, useQuery } from "react-query";

function PageList() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [newPageName, setNewPageName] = useState("");
  const [isUpdate, setIsUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateSuccess = () =>
    toast.success("Page Name Updated!", {
      style: {
        backgroundColor: "#4BB543",
        color: "white",
      },
    });

  const deleteSuccess = () =>
    toast.success("Page Deleted!", {
      style: {
        backgroundColor: "#4BB543",
        color: "white",
      },
    });

  const pageAddedSuccess = () =>
    toast.success("Page Added!", {
      style: {
        backgroundColor: "#4BB543",
        color: "white",
      },
    });

  const errorMsg = (error) =>
    toast.error(`Error: ${error.message}`, {
      style: {
        backgroundColor: "red",
        color: "white",
      },
    });

  const fetchPages = async () => {
    const pagesCollection = await getDocs(collection(db, "pages"));
    return pagesCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const { data: pagesData, isLoading, refetch } = useQuery("pages", fetchPages, {
    onSuccess: (data) => setPages(data),
    onError: (error) => {
      console.error("Error fetching pages:", error);
      errorMsg(error);
    },

  });

  useEffect(() => {
    if (pagesData) {
      setPages(pagesData);
    } else {
      refetch();
    }
  }, [pagesData,refetch]);

  const updatePageDetails = async (page) => {
    const pageRef = doc(db, "pages", page.id);
    await updateDoc(pageRef, { name: page.name });
    return page;
  };

  const { mutateAsync: updateMutateAsync } = useMutation(updatePageDetails, {
    onSuccess: (updatedPage) => {
      queryClient.setQueryData("pages", (oldData) => {
        return oldData.map((p) => (p.id === updatedPage.id ? updatedPage : p));
      });
      setIsUpdate(null);
      updateSuccess();
      setNewPageName("");
    },
    onError: (error) => {
      console.error("Error updating page:", error);
      errorMsg(error);
    },
    onSettled: () => setLoading(false),
  });

  const { mutateAsync: addMutateAsync } = useMutation(addPage, {
    onSuccess: () => {
      queryClient.invalidateQueries("pages");
      setNewPageName("");
      pageAddedSuccess();
    },
    onError: (err) => {
      console.error("Error adding page:", err);
      errorMsg(err);
    },
    onSettled: () => setLoading(false),
  });

  const { mutateAsync: deleteMutateAsync } = useMutation(deletePageAndData, {
    onSuccess: (pageId) => {
      queryClient.invalidateQueries("pages");
      setPages((prevPages) => prevPages.filter((page) => page.id !== pageId));
      deleteSuccess();
    },
    onError: (err) => {
      console.error("Error deleting page:", err);
      errorMsg(err);
    },
    onSettled: () => setLoading(false),
  });

  const handleUpdate = async (page) => {
    setLoading(true);
    const updatedPage = { ...page, name: newPageName };
    await updateMutateAsync(updatedPage);
  };

  const handleAddPage = async () => {
    setLoading(true);
    await addMutateAsync(newPageName);
  };

  const handleDelete = async (pageId) => {
    setLoading(true);
    await deleteMutateAsync(pageId);
  };

  const helperUpdate = (page) => {
    setIsUpdate(page.id);
    setNewPageName(page.name);
  };

  return (
    <div>
      <div className="m-10">
        {isLoading || loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-between m-10 ">
              <div className="flex gap-7">
                <FormControl>
                  <InputLabel htmlFor="property-file-input">New Page Name</InputLabel>
                  <Input
                    id="property-file-input"
                    aria-describedby="property-file-helper-text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    required
                  />
                </FormControl>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded shadow-md ml-4 px-4"
                  onClick={handleAddPage}
                >
                  Add Page
                </button>
              </div>

              <button
                className="px-5 py-2 border-2 border-black shadow-lg rounded-xl w-[8vw] gap-1 font-medium flex items-baseline"
                onClick={() => navigate("/dashboard")}
              >
                Go back
                <FaArrowLeft size={12} />
              </button>
            </div>

            {pages && pages.length > 0 ? (
              <TableContainer component={Paper} className="mt-8">
                <Table>
                  <TableHead>
                    <TableRow className="bg-blue-100">
                      <TableCell align="center">
                        <h1 className="font-bold">S.No</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-bold">Page Name</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-bold">Page URL</h1>
                      </TableCell>
                      <TableCell>
                        <h1 className="font-bold">Action</h1>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pages.map((page, index) => (
                      <TableRow key={page.id} className="hover:shadow-lg hover:rounded-xl transition-all duration-300">
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {isUpdate === page.id ? (
                            <input
                              type="text"
                              value={newPageName}
                              onChange={(e) => setNewPageName(e.target.value)}
                              className="border-b-black border-b-2 rounded-lg mr-1 p-1 text-center outline-none"
                            />
                          ) : (
                            <h1 className="capitalize">{page.name}</h1>
                          )}
                        </TableCell>
                        <TableCell align="center">{page.url}</TableCell>
                        <TableCell>
                          {isUpdate === page.id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(page)}
                                className="mr-5 hover:bg-zinc-100 hover:px-4 py-2 rounded-lg transition-all ease-in duration-300"
                              >
                                <BsSaveFill size={20} />
                              </button>
                              <button
                                onClick={() => setIsUpdate("")}
                                className="hover:bg-zinc-100 hover:px-2 py-1 rounded-lg transition-all ease-in duration-300"
                              >
                                <MdCancel size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => helperUpdate(page)}
                                className="mr-5 hover:bg-zinc-100 hover:px-2 py-1 rounded-lg transition-all ease-in duration-300"
                              >
                                <MdEdit size={20} />
                              </button>

                              <button
                                onClick={() => handleDelete(page.id)}
                                className="hover:bg-zinc-100 hover:px-2 py-1 rounded-lg transition-all ease-in duration-300"
                              >
                                <MdDelete size={20} />
                              </button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <h1 className="font-bold text-3xl">No Pages to Show!</h1>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PageList;
