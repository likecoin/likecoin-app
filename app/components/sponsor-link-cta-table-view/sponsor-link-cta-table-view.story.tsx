import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { SponsorLinkCTATableView } from "./sponsor-link-cta-table-view"

declare let module

storiesOf("SponsorLinkCTATableView", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noBackground text="Default" usage="The default usage">
        <SponsorLinkCTATableView likerID="ckxpress" />
      </UseCase>
    </Story>
  ))
