import { useEffect, useRef, useState, Fragment } from "react";
import CopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/IosShare";
import Page from "../../components/Page";
import Footer from "../../components/Footer";
import HotDogSelector from "../../components/HotDogSelector";
import CustomTextField from "../../components/CustomTextField";
import ReligionSelector from "../../components/ReligionSelector";
import withLoadingSpinner from "../../hoc/withLoadingSpinner";
import useAlert from "../../hooks/useAlert";
import useFetch from "../../hooks/useFetch";
import { parseQueryString } from "../../utils/helpers.js";
import {StyledPage, MainContainer, Button, InputContainer, PrayerContainer, CopyIconContainer, ShareIconContainer} from "./styled";

const INTRO = `Enter a subject (a word or short phrase) and click "submit" to generate a "prayer" about it, using the OpenAI GPT-3 Chatbot. (Chatbot responses are cached by user query for up to 24 hours. Limit of 15 requests per user, per hour.)`;

const DISCLAIMER = `Intended for entertainment purposes only. Limit of 15 requests per hour. Prayers are NOT guaranteed to work. No claims are made regarding the authenticity of generated prayers in relation to the selected target religion. Generated prayers may contain elements of hot dog orthodoxy. Use at your own spiritual risk.`;

const Home = ({ startLoading, doneLoading }) => {
  const [prayer, setPrayer] = useState("");
  const selectedReligion = useRef("Christianity");
  const inputRef = useRef(null);
  const hotDogRef = useRef(true);
  const { alertError, callAlertProm, callAlert } = useAlert();
  const {
    data: prayerData,
    error,
    loading,
    refresh,
    updateUrl,
  } = useFetch(null);

  useEffect(() => {
    const [prompt, style, hotdog] = parseQueryString(
      ["prompt", "style", "hotdog"],
      window.location.search
    );
    if (prompt) {
      inputRef.current.value = decodeURIComponent(prompt.replace(/\+/g, " "));
      selectedReligion.current = decodeURIComponent(style);
      hotDogRef.current = hotdog === "false" ? false : true;
      updateUrl(
        `/api/openai/prayer?prompt=${prompt}&style=${style}&hotdog=${hotdog}`
      );
    } else {
      callAlertProm(INTRO).then(() => inputRef.current.focus());
    }
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
    };
  }, [startLoading, doneLoading, prayerData, loading, error]);

  const submit = () => {
    const prompt = inputRef.current.value;
    if (prompt) {
      const searchParams = new URLSearchParams();
      searchParams.set("prompt", prompt);
      searchParams.set("style", selectedReligion.current);
      searchParams.set("hotdog", hotDogRef.current);
      const [url] = window.location.href.split("?");
      window.history.replaceState(
        {},
        null,
        `${url}?${searchParams.toString()}`
      );
      updateUrl(`/api/openai/prayer?${searchParams.toString()}`);
    }
  };

  const religionSelectorCallback = (religion) => {
    selectedReligion.current = religion;
    submit();
  };

  const onKeyDown = (event) => {
    const prompt = inputRef.current.value;
    if (event.key === "Enter" && prompt) {
      event.preventDefault();
      submit();
    }
  };

  const hotDogSelectorCallback = (boolean) => {
    hotDogRef.current = boolean;
    submit();
  };

  const copyPrayer = () => {
    navigator.clipboard.writeText(prayer);
    callAlert("Prayer copied to clipboard");
  };

  const sharePrayer = async () => {
    let queryString = window.location.search;
    if (!queryString) {
      queryString = `?prompt=${encodeURIComponent(
        inputRef.current.value
      )}&style=${encodeURIComponent(
        selectedReligion.current
      )}&hotdog=${encodeURIComponent(hotDogRef.current)}`;
    }
    // const [url] = window.location.href.split("?");
    const url = "https://www.hotdogisasandwich.com"
    const shareData = {
      url: encodeURI(url + queryString),
      title: "Hot Dog-ma Prayer Generator",
      text: `🌭 a Prayer for ${inputRef.current.value} 🌭`,
    };
    const canShare =
      "canShare" in navigator && (await navigator.canShare(shareData));
    if (canShare) {
      await navigator.share(shareData);
    }
  };

  return (
    <StyledPage>
      <MainContainer>
        <InputContainer>
          <CustomTextField
            name="urlInput"
            ref={inputRef}
            onKeyDown={onKeyDown}
            placeholder="Enter a word or phrase"
            margin="0 0 0 1.5em"
            maxLength={256}
            autoCapitalize="none"
          />
          <Button onClick={submit}>SUBMIT</Button>
        </InputContainer>
        <ReligionSelector
          callback={religionSelectorCallback}
          defaultSelected={selectedReligion.current}
        />
        <HotDogSelector
          callback={hotDogSelectorCallback}
          defaultChecked={hotDogRef.current}
        />
        <br />
        <PrayerContainer>
          {prayer.length ? (
            <>
              <CopyIconContainer>
                <CopyIcon onClick={copyPrayer} />
              </CopyIconContainer>
              {"canShare" in navigator ? (
                <ShareIconContainer>
                  <ShareIcon onClick={sharePrayer} />
                </ShareIconContainer>
              ) : null}
            </>
          ) : null}
          <br />
          {prayer.trim().split("\n\n").map((stanza, stanzaIndex) => {
            return (
              <p key={stanzaIndex}>
                {stanza.split("\n").map((line, lineIndex) => {
                  return (
                    <Fragment key={lineIndex}>
                      <span key={lineIndex}>{line}</span>
                      <br />
                    </Fragment>
                  );
                })}
              </p>
            );
          })}
        </PrayerContainer>
      </MainContainer>
      <Footer
        disclaimerCallback={() =>
          callAlertProm(DISCLAIMER).then(() => inputRef.current.focus())
        }
      />
    </StyledPage>
  );
};

export default withLoadingSpinner(Home);
