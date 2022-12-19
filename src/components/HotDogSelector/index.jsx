import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import styled from "styled-components";
import hotDogPic from "../../assets/hotdog_64x64.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const Image = styled.img`
  width: 45px;
`;

const HotDogSelector = ({ callback, defaultChecked = true }) => {
  const [checked, setChecked] = useState(defaultChecked);
  useEffect(() => {
    callback(checked);
  }, [checked]);

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const onChange = event => {
    setChecked(!checked);
  };

  return (
    <Container>
      <Image src={hotDogPic} />
      <Switch
        size="small"
        onChange={onChange}
        checked={checked}
      />
    </Container>
  );
};

export default HotDogSelector;
