import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseStore } from "../config/firebase";
import { useState } from "react";

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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
        }
    };

    return { apiGetDocs, apiAddDoc, apiDeleteDoc, apiUpdateDoc, getLoading, addLoading, deleteLoading, updateLoading };
};

export default useFirestore;
