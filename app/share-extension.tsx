import * as React from "react"
import { AppRegistry, YellowBox } from "react-native"

import { ShareDialog } from "./screens/share-dialog"

/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
YellowBox.ignoreWarnings([
  "componentWillMount is deprecated",
  "componentWillReceiveProps is deprecated",
])

/**
 * This is the root component of the share extension.
 */
export class ShareExtension extends React.Component {
  render() {
    return <ShareDialog />
  }
}

AppRegistry.registerComponent("LikerLandShare", () => ShareExtension)
