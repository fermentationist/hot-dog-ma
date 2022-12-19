import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MuiRadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import styled from "styled-components";
import { useEffect, useState } from "react";

const RadioGroup = styled(MuiRadioGroup)`
  display: flex;
  place-content: center;
  place-items: center;
  max-width: 75vw;
`;

const RadioButtonGroup = ({ selections, callback, title, size, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    callback(value);
  }, [value]);

  const onChange = event => {
    setValue(event.target.value);
  }

  return (
    <FormControl>
      {title ? <FormLabel>{title}</FormLabel> : null}
      <RadioGroup
        row
        name={title}
        onChange={onChange}
        value={value}
      >
        {selections.map((selection, index) => {
          return (
            <FormControlLabel
              key={index}
              value={selection.value}
              control={<Radio />}
              label={selection.displayName}
              size={size}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
