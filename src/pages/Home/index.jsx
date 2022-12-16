import { useEffect, useRef, useState, Fragment } from "react";
import styled from "styled-components";
import Page from "../../components/Page";
import HotDogSelector from "../../components/HotDogSelector";
import CustomTextField from "../../components/CustomTextField";
import ReligionSelector from "../../components/ReligionSelector";
import withLoadingSpinner from "../../hoc/withLoadingSpinner";
import useAlert from "../../hooks/useAlert";
import useFetch from "../../hooks/useFetch";

const INTRO = "Enter a subject (a word or short phrase) to generate a unique prayer using ChatGPT AI";

const Button = styled.button`
  margin: 1em;
`;

const Container = styled.div`
  max-width: 85vw;
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  place-content: center;
  place-items: center;
`;

const Home = ({
  startLoading,
  doneLoading
}) => {
  const [prayer, setPrayer] = useState("");
  const selectedReligion = useRef("christian");
  const inputRef = useRef(null);
  const hotDogRef = useRef(true);
  const {alertError, callAlertProm} = useAlert();
  const {data: prayerData, error, loading, refresh, updateUrl} = useFetch(null);

  useEffect(() => {
    callAlertProm(INTRO).then(() => inputRef.current.focus());
  }, []);

  useEffect(() => {
    let focusTimeout;
    startLoading();
    if (!loading) {
      doneLoading();
      if (error) {
        alertError(error);
      }
      if (prayerData) {
        console.log(prayerData);
        setPrayer(prayerData.prayer || "");
      }
      // because loading spinner has a minimum duration of 750ms
      focusTimeout = setTimeout(() => inputRef.current.focus(), 800);
    }
    return () => {
      clearTimeout(focusTimeout);
    }
  }, [startLoading, doneLoading, prayerData, loading, error]);

  const submit = () => {
    const prompt = inputRef.current.value;
    if (prompt) {
      updateUrl(`/api/openai/prayer?prompt=${encodeURIComponent(inputRef.current.value)}&style=${encodeURIComponent(selectedReligion.current)}&hotdog=${encodeURIComponent(hotDogRef.current)}`);
      refresh();
    }
  };

  const religionSelectorCallback = religion => {
    selectedReligion.current = religion;
    if (inputRef.current.value) {
      submit();
    }
  }

  const onKeyDown = event => {
    console.log("event.key:", event.key);
    const prompt = inputRef.current.value;
    if (event.key === "Enter" && prompt) {
      event.preventDefault();
      submit();
    }
  }

  const hotDogSelectorCallback = boolean => {
    console.log("hotDogSelectorCallback:", boolean);
    hotDogRef.current = boolean;
    submit();
  }

  return (
    <Page>
      <Container>
        <InputContainer>
          <CustomTextField
            name="urlInput"
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Enter a word or phrase"
            margin="0 0 0 1.5em"
          />
          <Button onClick={submit}>SUBMIT</Button>
        </InputContainer>
        <ReligionSelector callback={religionSelectorCallback}/>
        <HotDogSelector
          callback={hotDogSelectorCallback}
        />
        <br/>
        {
          prayer.split("\n\n").map((stanza, stanzaIndex) => {
            return (
              <p key={stanzaIndex}>
                {
                  stanza.split("\n").map((line, lineIndex) => {
                    return (
                      <Fragment key={lineIndex}>
                        <span key={lineIndex}>{line}</span>
                        <br/>
                      </Fragment>
                    )
                  })
                }
              </p>
            )
          })
        }
      </Container>
    </Page>);
};

export default withLoadingSpinner(Home);
