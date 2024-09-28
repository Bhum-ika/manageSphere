import React, { useEffect, useState, useCallback } from "react";
import {
  accessUserservices,
  fetchUserServices,
  getAllUsersData,
  updateUserServicesAccess,
} from "../../utils/firebaseFunctions.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Loader from "../../utils/Loader.js";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query-firestore";

function ServicesPermission() {
  const [allUsersData, setAllUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [services, setServices] = useState([]);
  const [restServices, setRestServices] = useState([]);
  const [userServicesState, setUserServicesState] = useState([]);
  const queryClient = useQueryClient();

  const { data: usersData, isLoading:usersLoading } = useQuery(
    "allUsers",
    getAllUsersData,
    {
      onSuccess: (data) => {
        setAllUsersData(data);
      },
      onError: (error) => {
        console.error("Error fetching users:", error);
      },
    }
  );

  const { data: allServices, refetch, isLoading:servicesLoading } = useQuery(
    ["userServices", selectedUser],
    () => fetchUserServices(selectedUser),
    {
      onSuccess: (data) => {
        setUserServicesState(data.filter((service) => service.isActive === true));
        setRestServices(data.filter((service) => service.isActive === false));
      },
      onError: (err) => {
        console.log(err);
        errorMsg(err);
      },
      enabled: !!selectedUser,
    }
  );

  useEffect(() => {
    if (selectedUser) {
      refetch();
    }
  }, [selectedUser, refetch]);

  const { mutate: updateMutation } = useMutation({
    mutationFn: ({ userId, serviceId, isActive }) =>
      updateUserServicesAccess(userId, serviceId, isActive),
    onMutate: async ({ userId, serviceId, isActive }) => {
      await queryClient.cancelQueries(["userServices", userId]);

      const previousData = queryClient.getQueryData(["userServices", userId]);

      queryClient.setQueryData(["userServices", userId], (old) =>
        old.map((service) =>
          service.id === serviceId ? { ...service, isActive } : service
        )
      );

      isActive ? AccessGivenMsg() : AccessTakenMsg();
      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["userServices", context.userId], context.previousData);
      errorMsg(err);
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["userServices", variables.userId]);
    },
  });

  const AccessGivenMsg = () =>
    toast.success("Access granted!", {
      style: {
        backgroundColor: "#4BB543",
        color: "white",
      },
    });

  const AccessTakenMsg = () =>
    toast.warning("Access removed!", {
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

  const handleCheckboxChange = 
    (serviceId, isActive) => {
      updateMutation({ userId: selectedUser, serviceId, isActive });
    }
   
  

  return (
    <div className="w-full min-h-screen">
      
      {usersLoading||servicesLoading ? (
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
              {allUsersData?.map((doc) => {
                return (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {selectedUser?<div className="mt-10">
            <div>
            {userServicesState?.length > 0 ? (
              <>
                <h1 className="font-medium mt-5 mb-0">Services accessible:</h1>
                <TableContainer component={Paper} className="mt-2">
                  <Table>
                    <TableHead>
                      <TableRow className="bg-slate-100">
                        <TableCell align="center"><h1 className="font-bold">S.No</h1></TableCell>
                        <TableCell align="center"><h1 className="font-bold">Service Name</h1></TableCell>
                        <TableCell align="center"><h1 className="font-bold">Service Path</h1></TableCell>
                         <TableCell align="center"><h1 className="font-bold">Property File</h1></TableCell> 
                         <TableCell align="center"><h1 className="font-bold">Access</h1></TableCell> 
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userServicesState?.map((service, index) => (
                        <TableRow key={service.id} className="">
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center"><h1 className="capitalize">{service.name}</h1></TableCell> <TableCell align="center">{service.path}</TableCell>
                          <TableCell align="center">{service.propertyFile}</TableCell>
                           
                          <TableCell align="center">
                            <input
                              type="checkbox"
                              checked={service.isActive}
                              onChange={(e) =>
                                handleCheckboxChange(service.id, e.target.checked)
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
              <div className="border-2 px-4 py-2 rounded-lg w-1/6 border-black">
                <h1 className="font-light italic">Services Allowed: <span className="font-bold">0</span> </h1>
              </div>
            )}
          </div>
           <div>
          
            {restServices&&restServices.length > 0 ? (

              <>
               <h1 className="font-medium mt-5 mb-0">Services not accessible:</h1>
                <TableContainer component={Paper} className="mt-2">
                  <Table>
                    <TableHead>
                      <TableRow className="bg-slate-100">
                        <TableCell align="center"><h1 className="font-bold">S.No</h1></TableCell>
                        <TableCell align="center"><h1 className="font-bold">Service Name</h1></TableCell>
                        <TableCell align="center"><h1 className="font-bold">Service Path</h1></TableCell>
                         <TableCell align="center"><h1 className="font-bold">Property File</h1></TableCell> 
                         <TableCell align="center"><h1 className="font-bold">Access</h1></TableCell> 
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {restServices.map((service, index) => (
                        <TableRow key={service.id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center"><h1 className="capitalize">{service.name}</h1></TableCell>
                          <TableCell align="center">{service.path}</TableCell>
                          <TableCell align="center">{service.propertyFile}</TableCell>
                           
                          <TableCell align="center">
                            <input
                              type="checkbox"
                              checked={service.isActive}
                              onChange={(e) =>
                                handleCheckboxChange(service.id, e.target.checked)
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
              <div className="border-2 px-4 py-2 rounded-lg w-1/4 border-black mt-5">
                <h1 className="font-light italic">This user has access to all the Services </h1>
              </div>
            )}
          </div> </div>:<h1>Select a user from dropdown menu.</h1>}
          
        </div>
      )}
    </div>
  );
}

// Memoized TableRow component to optimize rendering
const TableRowMemo = React.memo(({ service, index, onCheckboxChange }) => (
  <TableRow key={service.id}>
    <TableCell align="center">{index + 1}</TableCell>
    <TableCell align="center">
      <h1 className="capitalize">{service.name}</h1>
    </TableCell>
    <TableCell align="center">{service.path}</TableCell>
    <TableCell align="center">{service.propertyFile}</TableCell>
    <TableCell align="center">
      <input
        type="checkbox"
        checked={service.isActive}
        onChange={(e) => onCheckboxChange(service.id, e.target.checked)}
      />
    </TableCell>
  </TableRow>
));

export default ServicesPermission;
