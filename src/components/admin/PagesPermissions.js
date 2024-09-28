import React, { useState, useEffect } from "react";
import {
  userPages,
  updateUserPageAccess,
  updatePagePermissions,
  getAllUsersData,
} from "../../utils/firebaseFunctions.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Loader from "../../utils/Loader.js";
import { toast } from "react-toastify";
import { useQuery } from "react-query-firestore";
import { useQueryClient,useMutation } from "react-query";

function PagesPermissions() {
  const [selectedUser, setSelectedUser] = useState("");
  const [userPagesState, setUserPagesState] = useState([]);
  const [restPages, setRestPages] = useState([]);
  const[usersData,setUsersData]=useState([])
  const { data: allUsersData ,isLoading:usersLoading} = useQuery("allUsers", getAllUsersData,{
    onSuccess:()=>{
      setUsersData(allUsersData)
    },onError: (error) => {
      console.error("Error fetching pages:", error);
    },
  }
  );
  const queryClient = useQueryClient();

  const { data: allPages, refetch, isLoading:pagesLoading } = useQuery({
    queryKey: ["userPages", selectedUser],
    queryFn: () => userPages(selectedUser),
    onSuccess: (data) => {
      queryClient.setQueryData(["userPages", selectedUser], data);
      setUserPagesState(data.filter((page) => page.isActive === true));
      setRestPages(data.filter((page) => page.isActive === false));
    },
    onError: (err) => {
      console.log(err);
      errorMsg(err);
    },
    enabled: !!selectedUser, // Only run query if `selectedUser` is available
  });
  
  useEffect(() => {
    if (selectedUser) {
      refetch();
    }
  }, [selectedUser, refetch]);
  
useEffect(()=>{
  if(allUsersData){
    setUsersData(allUsersData)
  }
},[allUsersData])
  const successMsg = (msg) =>
    toast.success(msg, {
      style: {
        backgroundColor: "#4BB543",
        color: "white",
      },
    });
  const infoMsg = (msg) =>
    toast.warning(msg, {
      style: {
        backgroundColor: "#FFAC1C",
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

  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };



  const { mutate: handleCheckboxMutation } = useMutation({
    mutationFn: ({ userId, pageId, isActive }) => updateUserPageAccess(userId, pageId, isActive),
    onMutate: async ({ userId, pageId, isActive }) => {
      await queryClient.cancelQueries(["userPages", userId]);
      
      const previousData = queryClient.getQueryData(["userPages", userId]);
  
      queryClient.setQueryData(["userPages", userId], (old) =>
        old.map((page) =>
          page.id === pageId ? { ...page, isActive } : page
        )
      );
  
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userPages", context.userId], context.previousData);
      errorMsg(err);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["userPages", variables.userId]);
      
    },
  });
  
 
  
  
  
  
  const handleCheckboxChange = async (pageId, isActive,permissions) => {
   
    handleCheckboxMutation( {userId:selectedUser, pageId, isActive,permissions} );
  };

  const { mutate: handlePermissionMutation } = useMutation({
    mutationFn: ({ userId, pageId, permissions }) => updatePagePermissions(userId, pageId, permissions),
    onMutate: async ({ userId, pageId, permissions }) => {
      await queryClient.cancelQueries(["userPages", userId]);
      
      const previousData = queryClient.getQueryData(["userPages", userId]);
  
      queryClient.setQueryData(["userPages", userId], (old) =>
        old.map((page) =>
          page.id === pageId ? { ...page, permissions } : page
        )
      );
  
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userPages", context.userId], context.previousData);
      errorMsg(err);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["userPages", variables.userId]);
      
    },
  });
  
  const handlePermissionChange = async (pageId, permissions) => {
    handlePermissionMutation({ userId: selectedUser, pageId, permissions });
  };
  
  return (
    <div className="w-full min-h-screen">
      {usersLoading||pagesLoading ? (
        <Loader />
      ) : (
        <div className="m-10">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Users</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedUser}
              label="Users"
              onChange={handleChange}
            >
              {usersData?.map((doc) => {
                return (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {selectedUser ? (
            <>
              <div>
                {userPagesState?.length > 0 ? (
                  <>
                    <h1 className="font-medium mt-5 mb-0">Pages accessible:</h1>
                    <TableContainer component={Paper} className="mt-2">
                      <Table>
                        <TableHead>
                          <TableRow className="bg-slate-100">
                            <TableCell align="center">
                              <h1 className="font-bold">S.No</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Page Name</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Access</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Read</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Edit</h1>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userPagesState?.map((page, index) => (
                            <TableRow key={page.id}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{page.name}</TableCell>

                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  checked={page.isActive}                                  
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      page.id,
                                      e.target.checked,
                                      page.permissions
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  checked={page.permissions?.read || false}
                                  onChange={(e) =>
                                    handlePermissionChange(page.id, {
                                      ...page.permissions,
                                      read: e.target.checked,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  checked={page.permissions?.edit || false}
                                  onChange={(e) =>
                                    handlePermissionChange(page.id, {
                                      ...page.permissions,
                                      edit: e.target.checked,
                                    })
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <div className="border-2 mt-5 px-1 text-center  py-2 rounded-lg w-1/6 border-black">
                    <h1 className="font-light italic">Pages Accessible: 0 </h1>
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-medium mt-5 mb-0">Pages not accessible:</h1>
                {restPages?.length > 0 ? (
                  <>
                    <TableContainer component={Paper} className="mt-2">
                      <Table>
                        <TableHead>
                          <TableRow className="bg-slate-100">
                            <TableCell align="center">
                              <h1 className="font-bold">S.No</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Page Name</h1>
                            </TableCell>
                            <TableCell align="center">
                              <h1 className="font-bold">Permissions</h1>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {restPages.map((page, index) => (
                            <TableRow key={page.id}>
                              <TableCell align="center">{index + 1}</TableCell>
                              <TableCell align="center">{page.name}</TableCell>

                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  checked={page.isActive}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      page.id,
                                      e.target.checked,
                                      page.permissions
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <div className="border-2 px-4 py-2 rounded-lg w-1/4 border-black">
                    <h1 className="font-light italic">Pages not Accessible: 0 </h1>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-6 border-2 px-4 py-2 rounded-lg w-1/4 border-black">
              <h1 className="font-medium">
                Please select a user to see permissions!
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PagesPermissions;
