import styled from "styled-components";

const Container = styled.div`
  margin-top: 1em;
  display: inline-block;
  font-size: 0.75em;
  text-align: center;
`;

const Footer = ({disclaimerCallback}) => {
  return (
    <Container>
      This app uses the <a href="https://beta.openai.com/docs/introduction" target="_blank">
        OpenAI API
      </a>&nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="#" onClick={disclaimerCallback}>
        Disclaimer
      </a>
      <br/>
      © 2022 <a href="https://dennis-hodges.com/">
        Dennis Hodges
      </a>
    </Container>
  );
}

export default Footer;