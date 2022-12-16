import React from "react";
import styled from "styled-components";
import logo from "../../assets/airlock_square.gif";

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Image = styled.img`
  position: absolute;
  width: 100px;
  z-index: 10;
  border-radius: 50%;
`;

const SpinningBorder = styled.div`
  position: relative;
  border: 5px solid #F79420;
  border-radius: 50%;
  border-left-color: transparent;
  animation: load 1.1s infinite ease;
  width: 90px;
  height: 90px;
  z-index: 100;
  @keyframes load {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = (props) => {
  return (
    <Container className={props.className ? props.className : ""}>
      <Image src={logo} />
      <SpinningBorder role="status"></SpinningBorder>
    </Container>
  );
}

export default LoadingSpinner;
