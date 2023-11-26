// DOCS =>
// 1. This hook is used to perform CRUD operations on firestore
// 2. We have loadings for get , add , delete and update operations
// 3. We need to pass collection name to perform operations on that collection
// 4. We have onBefore and onAfter callbacks to perform some actions before and after api call
// 5. We have handleErrors function to handle errors and display custom messages according to error code
// 6. We have getDocs , getDocsByQuery , addDoc , deleteDoc , updateDoc , getSingleDoc functions
// 7. We have 6 API functions and 4 loading states

import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, getDoc, query } from "firebase/firestore";
import { firebaseStore } from "../config/firebase";
import { notifyError } from "../animations/Toastify";

const handleErrors = (err) => {
    const errorMappings = {
        // Firestore Errors
        "permission-denied": "Permission denied. You do not have access to perform this action.",
        "not-found": "The requested document does not exist.",
        aborted: "The operation was aborted.",
        unavailable: "The service is currently unavailable. Please try again later.",
        "data-loss": "There was a data loss during the operation.",
    };

    if (err?.code in errorMappings) return notifyError(errorMappings[err?.code]);
    return notifyError(err.message || "Something went wrong");
};

const useFirestore = (initialState = null, collectionName) => {
    const [getLoading, setGetLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    const collectionRef = collection(firebaseStore, collectionName);

    const executeOnAfter = (onAfter = null, data = null) => onAfter && onAfter(data);
    const executeOnBefore = (onBefore = null) => onBefore && onBefore();

    // const takeOnParameter = {
    //     onAfter: null,
    //     onBefore: null,
    // };
    const apiGetDocs = async ({ ...takeOnParameter }) => {
        try {
            setGetLoading(true);
            executeOnBefore(takeOnParameter?.onBefore);
            const response = await getDocs(collectionRef);
            const filteredDocs = response.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            }));
            setGetLoading(false);
            executeOnAfter(takeOnParameter?.onAfter, filteredDocs);
        } catch (err) {
            handleErrors(err);
        } finally {
            setGetLoading(false);
        }
    };
    const apiGetDocsByQuery = async ({ ...takeOnParameter }, queryParam) => {
        try {
            const myQuery = query(collectionRef, queryParam);

            setGetLoading(true);
            executeOnBefore(takeOnParameter?.onBefore);
            const response = await getDocs(myQuery);
            const filteredDocs = response.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            }));
            setGetLoading(false);
            executeOnAfter(takeOnParameter?.onAfter, filteredDocs);
        } catch (err) {
            handleErrors(err);
        } finally {
            setGetLoading(false);
        }
    };
    const apiAddDoc = async ({ ...takeOnParameter }, values) => {
        try {
            setAddLoading(true);
            executeOnBefore(takeOnParameter?.onBefore);
            const response = await addDoc(collectionRef, values);
            setAddLoading(false);
            executeOnAfter(takeOnParameter?.onAfter, response);
        } catch (err) {
            handleErrors(err);
        } finally {
            setAddLoading(false);
        }
    };
    const apiDeleteDoc = async ({ ...takeOnParameter }, id) => {
        try {
            setDeleteLoading(true);
            executeOnBefore(takeOnParameter?.onBefore);
            await deleteDoc(doc(firebaseStore, collectionName, id));
            setDeleteLoading(false);
            executeOnAfter(takeOnParameter?.onAfter);
        } catch (err) {
            handleErrors(err);
        } finally {
            setDeleteLoading(false);
        }
    };
    const apiUpdateDoc = async ({ ...takeOnParameter }, id, newValues) => {
        try {
            setUpdateLoading(true);
            executeOnBefore(takeOnParameter?.onBefore);
            const response = await updateDoc(doc(firebaseStore, collectionName, id), newValues);
            setUpdateLoading(false);
            executeOnAfter(takeOnParameter?.onAfter, response);
        } catch (err) {
            handleErrors(err);
        } finally {
            setUpdateLoading(false);
        }
    };
    const getSingleDoc = async ({ ...takeOnParameter }, id) => {
        try {
            executeOnBefore(takeOnParameter?.onBefore);
            const response = await getDoc(doc(firebaseStore, collectionName, id));
            executeOnAfter(takeOnParameter?.onAfter, response?.data());
        } catch (err) {
            handleErrors(err);
        }
    };

    return {
        apiGetDocs,
        apiAddDoc,
        apiDeleteDoc,
        apiUpdateDoc,
        getSingleDoc,
        apiGetDocsByQuery,
        getLoading,
        addLoading,
        deleteLoading,
        updateLoading,
    };
};

export default useFirestore;
