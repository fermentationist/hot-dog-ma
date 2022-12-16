import { useContext } from "react";
import { AlertStateContext } from "../context/AlertStateProvider";

const useAlert = () => {
  return useContext(AlertStateContext);
}
export default useAlert;
