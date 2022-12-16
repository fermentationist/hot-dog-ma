import LoadingSpinner from "../LoadingSpinner";
import styled from "styled-components";

const StyledSpinner = styled(LoadingSpinner)`
  margin-top: 25vh;
  /* margin-left: calc(50vw - 107px); */
  opacity: 0.5;

  @media screen and (max-width: 600px) {
    margin-top: calc(50vh - 130px);
    /* margin-left: calc(50vw - 57px); */
}
`;

export default StyledSpinner;
