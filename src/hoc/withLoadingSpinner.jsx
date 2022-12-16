import React, {useState, FunctionComponent, useCallback} from "react";
import Page from "../components/Page";
import LoadingSpinner from "../components/styled/StyledSpinner";

const MIN_DURATION = 750;

const withLoadingSpinner = (WrappedComponent, minDuration = MIN_DURATION) => {
  return (props) => {
    const [loaded, setLoaded] = useState(false);
    const [wrapperStyle, setWrapperStyle] = useState({
      display: "none"
    });
    const doneLoading = () => {
      const timeout = setTimeout(() => {
        setLoaded(true);
        setWrapperStyle({
          display: "unset"
        });
      }, minDuration);
    }
    const startLoading = () => {
      setLoaded(false);
      setWrapperStyle({
        display: "none",
        behavior: "smooth"
      });
    }
    return (
      <>
        {
          !loaded ? (
            <Page>
              <LoadingSpinner />
            </Page>
          ) : null
        }
        <div style={wrapperStyle}>
          <WrappedComponent 
            doneLoading={useCallback(doneLoading, [])}
            startLoading={useCallback(startLoading, [])}
            {...props} 
          />
        </div>
      </>
    )
  }
}

export default withLoadingSpinner;
