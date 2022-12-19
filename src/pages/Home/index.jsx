import { useEffect, useRef, useState, Fragment } from "react";
import styled from "styled-components";
import CopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/IosShare";
import Page from "../../components/Page";
import HotDogSelector from "../../components/HotDogSelector";
import CustomTextField from "../../components/CustomTextField";
import ReligionSelector from "../../components/ReligionSelector";
import withLoadingSpinner from "../../hoc/withLoadingSpinner";
import useAlert from "../../hooks/useAlert";
import useFetch from "../../hooks/useFetch";
import { parseQueryString } from "../../utils/helpers.js";

const INTRO = `Enter a subject (a word or short phrase) and click "submit" to generate a unique "prayer" using the OpenAI GPT-3 Chatbot.`;

const DISCLAIMER = `Intended for entertainment purposes only. Prayers are NOT guaranteed to work. (Not unless you REALLY mean it.) No claims are made regarding the authenticity of generated prayers in relation to the selected target religion. Generated prayers may contain elements of hot dog orthodoxy.`

const StyledPage = styled(Page)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 95vh;
  width: auto;
  max-width: clamp(50vw, 85vw, 900px);
`;

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

const PrayerContainer = styled.div`
  user-select: text;
`;

const CopyIconContainer = styled.div`
  position: absolute;
  right: 0;
  cursor: pointer;
`;

const ShareIconContainer = styled.div`
  position: absolute;
  left: 0;
  cursor: pointer;
`;

const Footer = styled.div`
  margin-top: 1em;
  display: inline-block;
  font-size: 0.75em;
  text-align: center;
`;

const Home = ({
  startLoading,
  doneLoading
}) => {
  const [prayer, setPrayer] = useState("");
  const selectedReligion = useRef("Christianity");
  const inputRef = useRef(null);
  const hotDogRef = useRef(true);
  const {alertError, callAlertProm, callAlert} = useAlert();
  const {data: prayerData, error, loading, refresh, updateUrl} = useFetch(null);

  useEffect(() => {
    const [prompt, style, hotdog] = parseQueryString(["prompt", "style", "hotdog"], window.location.search);
    if (prompt) {
      inputRef.current.value = decodeURIComponent(prompt);
      selectedReligion.current = decodeURIComponent(style);
      hotDogRef.current = hotdog === "false" ? false : true;
      updateUrl(`/api/openai/prayer?prompt=${prompt}&style=${style}&hotdog=${hotdog}`);
    } else {
      callAlertProm(INTRO).then(() => inputRef.current.focus());
    }
  }, [window.location.search]);

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
      updateUrl(`/api/openai/prayer?prompt=${encodeURIComponent(prompt)}&style=${encodeURIComponent(selectedReligion.current)}&hotdog=${encodeURIComponent(hotDogRef.current)}`);
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
    const prompt = inputRef.current.value;
    if (event.key === "Enter" && prompt) {
      event.preventDefault();
      submit();
    }
  }

  const hotDogSelectorCallback = boolean => {
    hotDogRef.current = boolean;
    submit();
  }

  const copyPrayer = () => {
    navigator.clipboard.writeText(prayer);
    callAlert("Prayer copied to clipboard");
  }

  const sharePrayer = async () => {
    let queryString = window.location.search;
    if (!queryString) {
      queryString = `?prompt=${encodeURIComponent(inputRef.current.value)}&style=${encodeURIComponent(selectedReligion.current)}&hotdog=${encodeURIComponent(hotDogRef.current)}`
    }
    const [url] = window.location.href.split("?");
    const shareData = {
      title: "Hot Dog-ma Prayer Generator",
      text: `A prayer about "${inputRef.current.value}"`,
      url: url + queryString
    }
    const canShare = await navigator.canShare(shareData);
    if (canShare) {
      await navigator.share(shareData);
    }
  }

  return (
    <StyledPage>
      <Container>
        <InputContainer>
          <CustomTextField
            name="urlInput"
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Enter a word or phrase"
            margin="0 0 0 1.5em"
            maxLength={256}
          />
          <Button onClick={submit}>SUBMIT</Button>
        </InputContainer>
        <ReligionSelector callback={religionSelectorCallback} defaultSelected={selectedReligion.current}/>
        <HotDogSelector
          callback={hotDogSelectorCallback}
          defaultChecked={hotDogRef.current}
        />
        <br/>
        <PrayerContainer>
          {
            prayer.length ? (
              <>
                <CopyIconContainer>
                  <CopyIcon onClick={copyPrayer}/>
                </CopyIconContainer>
                {
                  "canShare" in navigator ? (
                    <ShareIconContainer>
                      <ShareIcon onClick={sharePrayer} />
                    </ShareIconContainer>
                  ) : null
                }
              </>
            ) : null
          }
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
        </PrayerContainer>
      </Container>
      <Footer>
        This app uses the <a href="https://openai.com/api/" target="_blank">
          OpenAI API
        </a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#" onClick={() => callAlertProm(DISCLAIMER).then(() => inputRef.current.focus())}>
          Disclaimer
        </a>
        <br/>
        © 2022 <a href="https://dennis-hodges.com/">
          Dennis Hodges
        </a>
      </Footer>
    </StyledPage>);
};

export default withLoadingSpinner(Home);
