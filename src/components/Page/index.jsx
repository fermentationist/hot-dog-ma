import Paper from "@mui/material/Paper";
import styled from "styled-components";

const Background = styled.div`
  min-height: 100vh;
  overflow: auto;
  width: 100%;
  background-color: ${props => props.theme?.palette?.background?.default || "#242424"};
  position: relative;
`;

const PageContainer = styled.div`
  position: absolute;
  max-width: 100vw;
  min-height: 100vh;
  margin: 1em;
`;

const StyledPaper = styled(Paper)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const Page = ({children, className}) => {
  return (
    <Background>
      <StyledPaper>
        <PageContainer className={`page-container${className ? " " + className : ""}`}>
          {children}
        </PageContainer>
      </StyledPaper>
    </Background>
  )
}

export default Page;
