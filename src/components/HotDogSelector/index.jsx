import Switch from "@mui/material/Switch";
import styled from "styled-components";
import hotDogPic from "../../assets/hotdog_64x64.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const Image = styled.img``;

const HotDogSelector = ({ callback, defaultChecked = true }) => {
  const onChange = (event) => {
    const checked = event.currentTarget.checked;
    callback(checked);
  };

  return (
    <Container>
      <Image src={hotDogPic} />
      <Switch
        size="small"
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
    </Container>
  );
};

export default HotDogSelector;
