import React, { useEffect, useState } from "react";
import {
  addService,
  fetchServices,
  deleteServiceAndData,
} from "../../utils/firebaseFunctions.js";
import {
  FormControl,
  InputLabel,
  Input,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import Loader from "../../utils/Loader.js";
import { MdDelete, MdEdit } from "react-icons/md";
import { BsSaveFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import {
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase.js";
import { toast } from "react-toastify";
import { useQueryClient, useMutation,useQuery } from "react-query-firestore";
function ServicesPage() {
  const [serviceName, setServiceName] = useState("");
  const [propertyFile, setPropertyFile] = useState("");
  const [path, setPath] = useState("");
const[services,setServices]=useState([])
  const [loading, setLoading] = useState(false);
  const [isUpdate, setUpdate] = useState("");
  const [msg, setMsg] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const queryClient = useQueryClient();
  const { data: allServices, isLoading ,refetch} = useQuery("services", fetchServices, {
    onSuccess: (data) => setServices(data),
    onError: (error) => {
      console.error("Error fetching pages:", error);
      errorMsg(error);
    },
    enabled:false,
  });
  
  useEffect(()=>{
    if(allServices){
      setServices(allServices);
    }else{
      refetch()
    }
  },[allServices,refetch])
 
  const { mutateAsync: deleteServiceMutateAsync } = useMutation({
    mutationFn:deleteServiceAndData,
    onSuccess:(serviceId)=>{
      queryClient.invalidateQueries("services");
      setServices((prev) => prev.filter((service) => service.id !== serviceId));
      //deleteSuccess();
    },onError:(err)=>{
      console.log(err);
    },
    onSettled: () => setLoading(false),
      
  });
  const { mutate: addServiceMutation } = useMutation( {
    mutationFn:({ serviceName, servicePath, propertyFile })=>addService(serviceName, servicePath, propertyFile),
    onSucess:()=>{
      queryClient.invalidateQueries("services");
      setPath("")
      successMsg("Service added")
      setLoading(false)
    },onError:(err)=>{
      console.log(err)},
      onSettled: () => setLoading(false),



  });
  // Function to generate service path based on service name
  const generateServicePath = (name) => {
    return `services/${encodeURIComponent(
      name.trim().replace(/\s+/g, "-")
    )}/path`;
  };
  const successMsg = (msg) =>
    toast.success(msg, {
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
  useEffect(() => {
    setPath(generateServicePath(serviceName));
  }, [serviceName]);
  
  const submit = async () => {
   setLoading(true);
    addServiceMutation( { serviceName, servicePath: path, propertyFile })
  };
  const handleDelete = async (serviceId) => {
    setLoading(true)
   deleteServiceMutateAsync(serviceId)
  };

  const updatePageMutation = useMutation(
    async ({ serviceId, serviceName }) => {
      const pageDocRef = doc(db, "services", serviceId);
      await updateDoc(pageDocRef, { name: serviceName });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("pages");
        successMsg();
      },
      onError: (error) => {
        errorMsg(error);
      },
      onSettled: () => {
        setLoading(false);
      },
    }
  );
  const handleEdit = (serviceId) => {
    //setLoading(true);
    updatePageMutation.mutate({ serviceId, serviceName });
  };


  const helperUpdate = (service) => {
    setUpdate(service.id);
    setServiceName(service.name);
    setPath(service.path);
    setPropertyFile(service.propertyFile);
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      setServices(allServices);
      return;
    }

    // Filter the results from the fetched services
    const searchResult = allServices.filter((service) =>
      service.name.toLowerCase().includes(value.toLowerCase())
    );

    if (searchResult.length > 0) {
      setServices(searchResult);
      setIsSearch(false);
    } else {
      setIsSearch(true);
      setMsg("Not Found");
      setServices([]); // or handle the "not found" case as needed
    }
  };

  return (
    <div className="w-full min-h-screen">
      {isLoading||loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between">
            <div className="m-10 flex gap-4 py-2">
              <FormControl>
                <InputLabel htmlFor="service-name-input">
                  Service Name
                </InputLabel>
                <Input
                  id="service-name-input"
                  aria-describedby="service-name-helper-text"
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="service-path-input">
                  Service Path
                </InputLabel>
                <Input
                  id="service-path-input"
                  aria-describedby="service-path-helper-text"
                  value={serviceName ? path : ""}
                  onChange={(e) => setPath(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="property-file-input">
                  Property File
                </InputLabel>
                <Input
                  id="property-file-input"
                  aria-describedby="property-file-helper-text"
                  onChange={(e) => setPropertyFile(e.target.value)}
                />
              </FormControl>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded shadow-md ml-4 px-4"
                onClick={() => submit()}
              >
                Add Service
              </button>
            </div>
            <div className="flex m-10 border-2 px-3 py-4  rounded-xl border-zinc-400 hover:border-black w-44 h-14 ">
              <input
                className="w-28 outline-none"
                placeholder="Search Service"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FaSearch size={20} />
            </div>
          </div>
          <div>
            {loading ? (
              <Loader />
            ) : services && services.length > 0 ? (
              <TableContainer component={Paper} className="mt-8 ml-4">
                <Table>
                  <TableHead>
                    <TableRow className="bg-blue-100">
                      <TableCell align="center">
                        <h1 className="font-semibold">S.No</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-semibold">Service Name</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-semibold">Service Path</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-semibold">Property File</h1>
                      </TableCell>
                      <TableCell align="center">
                        <h1 className="font-semibold">Action</h1>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services &&
                      services.map((service, index) => (
                        <TableRow key={service.id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {isUpdate === service.id ? (
                              <>
                                {" "}
                                <FormControl>
                                  <InputLabel htmlFor="service-name-input">
                                    Service Name
                                  </InputLabel>
                                  <Input
                                    id="service-name-input"
                                    aria-describedby="service-name-helper-text"
                                    value={serviceName}
                                    onChange={(e) =>
                                      setServiceName(e.target.value)
                                    }
                                  />
                                </FormControl>
                              </>
                            ) : (
                              <h1 className="capitalize">{service.name}</h1>
                            )}
                          </TableCell>

                          <TableCell align="center">
                            {isUpdate === service.id ? (
                              <>
                                {" "}
                                <FormControl>
                                  <InputLabel htmlFor="service-name-input">
                                    Service Path
                                  </InputLabel>
                                  <Input
                                    id="service-name-input"
                                    aria-describedby="service-name-helper-text"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                  />
                                </FormControl>
                              </>
                            ) : (
                              <div className="relative group">
                              <h1 className="underline underline-offset-2 hover:text-blue-500 hover:cursor-pointer">
                    
                                {service.path?.substring(0,15)}...
                              </h1>
                              <div className="absolute hidden bg-blue-500 right-0 text-white p-2 rounded text-xs w-max group-hover:block">
                              <h1>{service.path}</h1>
                              </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {isUpdate === service.id ? (
                              <>
                                {" "}
                                <FormControl>
                                  <InputLabel htmlFor="service-name-input">
                                    PropertyFile
                                  </InputLabel>
                                  <Input
                                    id="service-name-input"
                                    aria-describedby="service-name-helper-text"
                                    value={propertyFile}
                                    onChange={(e) =>
                                      setPropertyFile(e.target.value)
                                    }
                                  />
                                </FormControl>
                              </>
                            ) : (
                              service.propertyFile
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={
                                isUpdate
                                  ? () =>
                                      handleEdit({
                                        id: isUpdate,
                                        name: serviceName,
                                        path,
                                        propertyFile,
                                      })
                                  : () => helperUpdate(service)
                              }
                            >
                              {isUpdate ? (
                                <BsSaveFill size={20} />
                              ) : (
                                <MdEdit size={20} />
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDelete(service.id)}
                              disabled={loading}
                            >
                              <MdDelete size={20} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className="border-2 px-4 py-2 rounded-lg w-[8vw] mx-2 flex place-items-center border-black mt-5">
                <h1 className="font-light italic">
                  {isSearch ? msg : "No services"}{" "}
                </h1>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ServicesPage;
