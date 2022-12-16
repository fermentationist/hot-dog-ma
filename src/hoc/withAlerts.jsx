import useAlert from "../hooks/useAlert";

const withAlerts = (Component) => { // for use with class components
  return (props) => {
    const {callAlert} = useAlert();
    return (
      <Component callAlert={callAlert} {...props} />
    )

  }
}

export default withAlerts;
