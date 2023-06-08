jest.mock("react-native/Libraries/Components/TextInput/TextInput", () => {
  const RealComponent = require.requireActual("react-native/Libraries/Components/TextInput/TextInput")
  const React = require("React")

  class TextInput extends React.Component {
    render() {
      return React.createElement(
        "TextInput",
        { ...this.props, autoFocus: false },
        this.props.children,
      )
    }
  }
  TextInput.propTypes = RealComponent.propTypes
  return TextInput
})
