import MuiButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import CustomDialog from "../CustomDialog";
import Typography from "@mui/material/Typography";
import CustomTextField from "../CustomTextField";
import { styled as muiStyled } from "@mui/material/styles";
import useAlert from "../../hooks/useAlert";
import { KeyboardEvent, ReactEventHandler, useRef } from "react";
import styled from "styled-components";

const StyledBox = muiStyled(Box)`
  margin: 1em;
`;

const StyledTypography = muiStyled(Typography)`
  margin-bottom: 1em;
`;

const Button = muiStyled(MuiButton)`
  margin-right: 1em;
`;

const ButtonContainer = styled.div`
  margin: 1em;
`;

const ConfirmDialog = () => {
  const { alertState, setAlertState } = useAlert();
  const inputRef = useRef(null);

  const closeDialog = () => {
    setAlertState({
      isOpen: false,
      title: null,
      message: null,
      confirmCallback: null,
      promptForInput: false
    });
  };
  const cancel = () => {
    closeDialog();
    alertState.confirmCallback(false);
    alertState.closeCallback && alertState.closeCallback(true);
  };
  const submit = () => {
    const result = inputRef?.current?.value || true;
    setAlertState({
      ...alertState,
      userResponse: result
    });
    closeDialog();
    alertState.confirmCallback(result);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      submit();
    }
  }

  const message = alertState?.message ? (
    <StyledTypography>{alertState?.message}</StyledTypography>
  ) : null;

  const textField = alertState?.promptForInput ? (
    <CustomTextField name="userInput" ref={inputRef} onKeyDown={onKeyDown}/>
  ) : null;

  return (
    <CustomDialog
      showDialog={alertState?.isOpen}
      closeDialog={closeDialog}
      title={alertState?.title}
    >
      <Stack>
        <StyledBox>
          {message}
          {textField}
        </StyledBox>
        <ButtonContainer>
          <Button onClick={cancel}>Close</Button>
          <Button onClick={submit}>Confirm</Button>
        </ButtonContainer>
      </Stack>
    </CustomDialog>
  );
};

export default ConfirmDialog;
