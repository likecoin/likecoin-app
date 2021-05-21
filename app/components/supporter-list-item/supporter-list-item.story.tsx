import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { PureSupporterListItem } from "./supporter-list-item.pure"

declare var module

storiesOf("SupporterListItem", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Default">
        <PureSupporterListItem displayName="Example" quantity={5} />
      </UseCase>
    </Story>
  ))
