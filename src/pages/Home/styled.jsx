import Page from "../../components/Page";
import styled from "styled-components";

export const StyledPage = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 95vh;
  width: auto;
  max-width: clamp(50vw, 85vw, 900px);
`;

export const MainContainer = styled.div`
  max-width: 85vw;
  display: flex;
  flex-direction: column;
  place-items: center;
  &::before {
    display: flex;
    place-items: center;
    position: absolute;
    content: "Hot Dog-ma Prayer Generator";
    font-size: 4em;
    font-weight: 900;
    min-height: 90vh;
    line-height: 1.5em;
    z-index: 0;
    color: #222222;
    max-width: 100vw;
  }
`;

export const Button = styled.button`
  margin: 1em;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  place-content: center;
  place-items: center;
  z-index: 1;
`;

export const PrayerContainer = styled.div`
  user-select: text;
  z-index: 1;
`;

export const CopyIconContainer = styled.div`
  position: absolute;
  right: 0;
  cursor: pointer;
`;

export const ShareIconContainer = styled.div`
  position: absolute;
  left: 0;
  cursor: pointer;
`;