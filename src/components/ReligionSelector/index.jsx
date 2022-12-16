import RadioButtonGroup from "../RadioButtonGroup";

const RELIGION_SUGGESTIONS = [
  {
    displayName: "✝️",
    value: "Christianity"
  },
  {
    displayName: "☪️",
    value: "Islam"
  },
  {
    displayName: "⚛️",
    value: "Secular"
  },
  {
    displayName: "🕉",
    value: "Hinduism"
  },
  {
    displayName: "☸️",
    value: "Buddhism",
  },
  {
    displayName: "✡️",
    value: "Judaism"
  }
];

const ReligionSelector = ({callback}) => {
  return (
    <RadioButtonGroup
      selections={RELIGION_SUGGESTIONS}
      callback={callback}
      title={null}
      size="small"
      defaultValue="Christianity"
    />
  )
}

export default ReligionSelector;