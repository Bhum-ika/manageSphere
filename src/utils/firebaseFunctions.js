import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { query, startAfter,startAt, limit,orderBy } from "firebase/firestore";

const baseUrl = "http://localhost:3000";

// Function to add a new page

export const addPage = async (pageName) => {
  if (pageName.trim() === "") throw new Error("Page name cannot be empty");
  //pageUrl
  const pageUrl = `${baseUrl}/${encodeURIComponent(
    pageName.trim().replace(/\s+/g, "-")
  )}`;
  // Create a new document in the pages collection with the page name and URL
  const newPageDoc = await addDoc(collection(db, "pages"), {
    name: pageName,
    url: pageUrl,
  });
  //fetching users
  const usersCollectionSnapshot = await getDocs(collection(db, "users"));
  const usersList = usersCollectionSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  //marking every created page as false
  for (const user of usersList) {
    await setDoc(doc(db, `users/${user.id}/accessiblePages`, newPageDoc.id), {
      isActive: false,
    });
  }
};

// Function to fetch all pages and their access status for a specific users

export const userPages = async (userId) => {
  //fetching all pages
  const pagesSnapshot = await getDocs(collection(db, "pages"));
  //fetching users' page
  const userPagesSnapshot = await getDocs(
    collection(db, `users/${userId}/accessiblePages`)
  );

  const pagesList = pagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const userPagesList = userPagesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return pagesList.map((page) => {
    const userPage = userPagesList.find((p) => p.id === page.id);
    return {
      ...page,
      isActive: userPage ? userPage.isActive : false,
      permissions: userPage ? userPage.permissions : false,
    };
  });
};

// Function to update user page access
export const updateUserPageAccess = async (userId, pageId, isActive) => {
  console.log(userId, pageId,isActive);
  if (!userId || !pageId) {
    throw new Error("Invalid userId or pageId");
  }
  try {
    // Reference to the specific document in the user's accessiblePages subcollection
    const pageDocRef = doc(db, `users/${userId}/accessiblePages`, pageId);
    await   setDoc(pageDocRef, { isActive }, {permissions:null},{ merge: true });
     const docSnapshot = await getDoc(pageDocRef);
    if (docSnapshot.exists()) {
      const data = { id: docSnapshot.id, ...docSnapshot.data() };
      return data;
    } else {
      throw new Error("Document does not exist");
    }

  } catch (error) {
    console.error("Error updating page access:", error);
    throw new Error("Failed to update page access");
  }
};

export const updatePagePermissions = async (userId, pageId, permissions) => {
  if (!userId || !pageId) throw new Error("Invalid userId or pageId");
  const userPermissionsRef = doc(
    db,
    "users",
    userId,
    "accessiblePages",
    pageId
  );
  await updateDoc(userPermissionsRef, { permissions });
  const pagesSnapshot=await getDoc(userPermissionsRef);
  if(pagesSnapshot.exists()){
    const data = { id: pagesSnapshot.id, ...pagesSnapshot.data() };
    return data;
  }else{
    throw new Error("Document does not exist");
  }
};

export const accessUserPages = async (uid) => {
  //accessing particular user's pages
  const accessedPages = await getDocs(
    collection(db, `users/${uid}/accessiblePages`)
  );
  const pages = accessedPages.docs
    .map((page) => ({ id: page.id, ...page.data() }))
    .filter((page) => page.isActive === true);
  const pagesName = [];
  //adding only those pages whose permissions are allowed to each user
  for (const page of pages) {
    const pageRef = doc(db, "pages", page.id);
    const pageDocSnap = await getDoc(pageRef);
    if (pageDocSnap.exists()) {
      pagesName.push({ id: page.id, ...pageDocSnap.data() });
    }
  }
  return pagesName;
};

export const deletePageAndData = async (pageId) => {
  try {
    // Delete the page document
    await deleteDoc(doc(db, "pages", pageId));

    // Get all users
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const users = usersSnapshot.docs.map((doc) => doc.id);

    // Delete the page from each user's accessiblePages subcollection
    for (const userId of users) {
      await deleteDoc(doc(db, `users/${userId}/accessiblePages`, pageId));
    }
  } catch (error) {
    console.error("Error deleting page and data:", error);
    throw new Error("Failed to delete page and associated data");
  }
};

// Function to fetch paginated data of users
export const getData = async (pageSize, lastDoc = null, startAtDoc = null) => {
  const userCollectionRef = collection(db, "users");
  let userQuery;
  // debugger
  console.log(lastDoc)

  const orderByField = "name"; // Adjust this to your desired field
  userQuery = query(
    userCollectionRef,
    orderBy(orderByField),
    startAfter(lastDoc),
    limit(pageSize)
  );

  // if (startAtDoc) {
  //   userQuery = query(
  //     userCollectionRef,
  //     orderBy(orderByField), 
  //     startAt(startAtDoc),
  //     limit(pageSize)
  //   );
  // } else if (lastDoc) {
  //   userQuery = query(
  //     userCollectionRef,
  //     orderBy(orderByField),
  //     startAfter(lastDoc),
  //     limit(pageSize)
  //   );
  // } else {
  //   userQuery = query(
  //     userCollectionRef,
  //     orderBy(orderByField), 
  //     limit(pageSize)
  //   );
  // }

  // Fetch documents based on the query
  const querySnapshot = await getDocs(userQuery);
  console.log(querySnapshot)

  // Process each document
  const dataList = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const userData = doc.data();

      
      // Fetching pages permission
      const accessiblePagesSnapshot = await getDocs(
        collection(db, `users/${doc.id}/accessiblePages`)
      );
      const accessiblePages = accessiblePagesSnapshot.docs
        .map((pageDoc) => pageDoc.data())
        .filter((pageData) => pageData.isActive === true);

      // Fetching services permission
      const accessibleServicesSnapshot = await getDocs(
        collection(db, `users/${doc.id}/accessibleServices`)
      );
      const accessibleServices = accessibleServicesSnapshot.docs
        .map((serviceDoc) => serviceDoc.data())
        .filter((serviceData) => serviceData.isActive === true);

      // Returning user data with permissions count
      return {
        ...userData,
        id: doc.id,
        Pagesaccess: accessiblePages.length,
        Servicesaccess: accessibleServices.length,
      };
    })
  );


  //const filteredDataList = dataList.filter((item) => item.roles.includes("user"));

  // Find the last visible document that's a user
  let lastVisible;
  for (let i = querySnapshot.docs.length - 1; i >= 0; i--) {
    const doc = querySnapshot.docs[i];
    
      lastVisible = doc;
      break;
    
  }

  // Find the first visible document that's a user
  let firstVisible = null;
  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];
  
      firstVisible = doc;
      break;
    
  }

  return { users: dataList, lastVisible, firstVisible };
};



//fetch all Users
export const getAllUsersData = async () => {
  const docSnapshot = await getDocs(collection(db, "users"));
  return docSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((doc) => doc.roles.includes("user"));
};

export const addService = async (serviceName, servicePath, propertyFile) => {
  if (!serviceName || serviceName.trim() === "")
    throw new Error("Service name cannot be empty");
  if (!servicePath) throw new Error("Service path cannot be empty");
  if (typeof propertyFile === "undefined")
    throw new Error("Property file cannot be undefined");

  // Reference to the 'services' collection
  const servicesCollectionRef = collection(db, "services");
  const newServiceDocRef = await addDoc(servicesCollectionRef, {
    name: serviceName,
    path: servicePath,
    propertyFile,
  });

  // Fetch all users and update their accessibleServices subcollection
  const usersCollectionRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollectionRef);
  const usersList = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // For each user, add the new service to their accessibleServices subcollection
  for (const user of usersList) {
    const userAccessibleServicesDocRef = doc(
      db,
      `users/${user.id}/accessibleServices`,
      newServiceDocRef.id
    );
    await setDoc(userAccessibleServicesDocRef, { isActive: false });
  }
};

export const fetchServices = async () => {
  try {
    const servicesSnapshot = await getDocs(collection(db, "services"));
    const servicesList = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return servicesList;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateUserServicesAccess = async (userId, serviceId, isActive) => {
  try {
    if (!userId || !serviceId) {
      throw new Error("Invalid userId or pageId");
    }

    const serviceDoc = doc(db, `users/${userId}/accessibleServices`, serviceId);
    await setDoc(serviceDoc, { isActive }, { merge: true });
    console.log(
      `Successfully updated access for service ${serviceId} for user ${userId}`
    );
  } catch (error) {
    console.error("Error updating service access:", error);
    throw new Error("Failed to update service access");
  }
};

export const fetchUserServices = async (userId) => {
  try {
    const serviceSnapshot = await getDocs(collection(db, "services"));
    const userServicesSnapshot = await getDocs(
      collection(db, "users", userId, "accessibleServices")
    );

    const servicesList = serviceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const userServicesList = userServicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return servicesList.map((service) => {
      const userService = userServicesList.find((s) => s.id === service.id);
      return {
        ...service,
        isActive: userService ? userService.isActive : false,
      };
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteServiceAndData = async (serviceId) => {
  try {
    // Delete the page document
    await deleteDoc(doc(db, "services", serviceId));

    // Get all users
    const usersCollectionRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollectionRef);
    const users = usersSnapshot.docs.map((doc) => doc.id);

    for (const userId of users) {
      await deleteDoc(doc(db, `users/${userId}/accessibleServices`, serviceId));
    }
  } catch (error) {
    console.error("Error deleting service and data:", error);
    throw new Error("Failed to delete service and associated data");
  }
};
