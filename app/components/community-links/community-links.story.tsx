import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { CommunityLinks } from "./community-links"

declare let module

storiesOf("CommunityLinks", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noBackground text="Default" usage="The default usage">
        <CommunityLinks />
      </UseCase>
    </Story>
  ))
