import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseStore } from "../config/firebase";

const useFirestore = (initialState = null, collectionName) => {
    const collectionRef = collection(collectionName);

    const executeAfterFunctionWork = (afterFunctionWork, data = null) => {
        afterFunctionWork && afterFunctionWork(data);
    };

    const apiGetDocs = async (afterFunctionWork = null) => {
        try {
            const response = await getDocs(collectionRef);
            const filteredDocs = response.docs.map((doc) => ({
                id: doc?.id,
                ...doc?.data(),
            }));

            executeAfterFunctionWork(afterFunctionWork, filteredDocs);
        } catch (err) {
            console.log(err);
        }
    };
    const apiAddDoc = async (afterFunctionWork = null, values) => {
        try {
            await addDoc(collectionRef, values);
            executeAfterFunctionWork(afterFunctionWork);
        } catch (err) {
            console.log(err);
        }
    };
    const apiDeleteDoc = async (afterFunctionWork = null, id) => {
        try {
            await deleteDoc(doc(firebaseStore, collectionName, id));
            executeAfterFunctionWork(afterFunctionWork);
        } catch (err) {
            console.log(err);
        }
    };
    const apiUpdateDoc = async (afterFunctionWork = null, id, newValues) => {
        try {
            await updateDoc(doc(firebaseStore, collectionName, id), newValues);
            executeAfterFunctionWork(afterFunctionWork);
        } catch (err) {
            console.log(err);
        }
    };

    return { apiGetDocs, apiAddDoc, apiDeleteDoc, apiUpdateDoc };
};

export default useFirestore;
