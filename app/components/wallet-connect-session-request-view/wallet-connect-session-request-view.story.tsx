import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { WalletConnectSessionRequestView } from "./"

declare let module

storiesOf("WalletConnectSessionRequestView", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <WalletConnectSessionRequestView />
      </UseCase>
    </Story>
  ))
