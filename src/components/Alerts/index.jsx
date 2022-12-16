import useAlert from "../../hooks/useAlert";
import ConfirmDialog from "../ConfirmDialog";
import CustomAlert from "../CustomAlert";

const Alerts = () => {
  const {alertState} = useAlert();
  return alertState?.confirmCallback ? (
    <ConfirmDialog />
  ) : (
    <CustomAlert />
  )
}

export default Alerts;
