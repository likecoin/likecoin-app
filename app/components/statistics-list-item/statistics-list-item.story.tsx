import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import {
  StatisticsListItem,
} from "./statistics-list-item"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

declare var module: any

storiesOf("StatisticsListItem", module)
  .addDecorator((fn: () => React.ReactNode) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Type", () => {
    return (
      <Story>
        <UseCase text="Rewarded Content" usage="rewarded-content" noPad>
          <StatisticsListItem
            type="rewarded-content"
            title="Rewarded Content"
          />
        </UseCase>
        <UseCase text="Rewarded Daily Content" usage="rewarded-daily-content" noPad>
          <StatisticsListItem
            type="rewarded-daily-content"
            title="Rewarded Daily Content"
          />
        </UseCase>
        <UseCase text="Supported Content" usage="supported-content" noPad>
          <StatisticsListItem
            type="supported-content"
            title="Supported Content"
          />
        </UseCase>
        <UseCase text="Supported Creator" usage="supported-creator" noPad>
          <StatisticsListItem
            type="supported-creator"
            title="Supported Creator"
            avatarURL="https://via.placeholder.com/100"
            numOfWorks={1}
          />
        </UseCase>
      </Story>
    )
  })
