import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CustomDialog from "../CustomDialog";
import Typography from "@mui/material/Typography";
import {styled as muiStyled} from "@mui/material/styles";
import useAlert from "../../hooks/useAlert";

const StyledBox = muiStyled(Box)`
  margin: 1em;
`;

const CustomAlert = () => {
  const {alertState, resetAlertState} = useAlert();
  const closeDialog = () => {
    resetAlertState();
    alertState.closeCallback && alertState.closeCallback(true);
  }
  return (
    <CustomDialog
      showDialog={alertState?.isOpen}
      closeDialog={closeDialog}
      title={alertState?.title}
    >
      <Stack>
        <StyledBox>
          <Typography>
            {alertState?.message}
          </Typography>
            {alertState?.child}
        </StyledBox>
        <Button onClick={closeDialog}>Close</Button>
      </Stack>
    </CustomDialog>
  );
}

export default CustomAlert;
