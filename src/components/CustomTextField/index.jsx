import { forwardRef } from "react";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";

const CustomLabel = styled.label`
  margin: 1em;
`;

const CustomInput = muiStyled(TextField)`
  margin: ${(props) => props.marginoverride || "1 em"};
  width: ${(props) => props.width || "250px"};
`;

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || "column"};
`;

const CustomTextField = forwardRef((props, forwardedRef) => {
  const Input = (
    <CustomInput
      width={props.width}
      marginoverride={props.margin}
      type={props.type || "text"}
      // pattern={/\d/}
      label={props.internalLabel}
      id={props.name}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      value={props.value}
      inputRef={forwardedRef}
      inputProps={{
        onBlur: props.onBlur,
        onFocus: props.onFocus,
        onChange: props.onChange,
        onInput: props.onInput,
        onKeyDown: props.onKeyDown,
        step: props.step || "1",
        min: props.min,
        maxLength: props.maxLength
      }}
      className={props.className || ""}
      {...(props.register && props.register(props.name, props.validation))}
    />
  );
  return (
    <>
      {props.label ? (
        <Container flexDirection={props.flexDirection}>
          <CustomLabel htmlFor={props.name}>{props.label}</CustomLabel>
          {Input}
        </Container>
      ) : (
        <>{Input}</>
      )}
    </>
  );
});

export default CustomTextField;
