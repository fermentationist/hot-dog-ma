import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/lab/LoadingButton";
import { styled as muiStyled } from "@mui/material/styles";

const StyledContent = muiStyled(DialogContent)`
  padding-top: 1em;
  margin-top: 1em;
`;

const CustomDialog = ({
  showDialog,
  closeDialog,
  className,
  children,
  title,
  confirm,
  loading,
  style
}) => {
  return (
    <>
      {showDialog ? (
        <Dialog
          open={showDialog}
          onClose={closeDialog}
          style={style}
        >
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          <StyledContent className={className}>{children}</StyledContent>
          {confirm ? (
            <DialogActions>
              <Button
                onClick={() => {
                  closeDialog();
                  return false;
                }}
              >
                Cancel
              </Button>
              <Button onClick={confirm} loading={loading}>
                Confirm
              </Button>
            </DialogActions>
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
};

export default CustomDialog;
