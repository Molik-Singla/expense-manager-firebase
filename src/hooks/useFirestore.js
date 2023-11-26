import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseStore } from "../config/firebase";
import { useState } from "react";
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

    return { apiGetDocs, apiAddDoc, apiDeleteDoc, apiUpdateDoc, getLoading, addLoading, deleteLoading, updateLoading };
};

export default useFirestore;
