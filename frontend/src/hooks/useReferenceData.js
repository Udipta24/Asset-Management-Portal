import { useReferenceDataContext } from "../context/ReferenceDataContext";

export const useReferenceData = () => {
    return useReferenceDataContext();
}