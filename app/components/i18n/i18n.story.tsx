import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { I18n } from "./i18n"

import { Text } from "../text"

import {
  Story,
  StoryScreen,
  UseCase,
} from "../../../storybook/views"
import { Alert } from "react-native"

declare let module: any

storiesOf("I18n", module)
  .addDecorator((fn: () => React.ReactNode) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => {
    return (
      <Story>
        <UseCase
          text="Default"
          usage="Pass <Text/> as children for interpolation"
        >
          <I18n tx="I18nStory.UseCase1">
            <Text
              text="Edmond Yu"
              color="likeGreen"
              weight="600"
              place="liker"
              onPress={() => Alert.alert("Clicked Edmond Yu")}
            />
            <Text
              text="33.1234 LikeCoin"
              color="green"
              weight="600"
              place="amount"
            />
          </I18n>
        </UseCase>
      </Story>
    )
  })
