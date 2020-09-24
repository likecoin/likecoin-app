import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { Avatar } from "./avatar"

declare let module

const IMAGE_SRC = "https://liker.land/logo.png"

storiesOf("Avatar", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase text="Default" usage="With size 28.">
        <Avatar src={IMAGE_SRC} size={28} />
      </UseCase>
      <UseCase text="Halo" usage="With size 28 and halo.">
        <Avatar src={IMAGE_SRC} size={28} isCivicLiker={true} />
      </UseCase>
      <UseCase text="Large" usage="With size 44 and halo.">
        <Avatar src={IMAGE_SRC} size={44} isCivicLiker={true} />
      </UseCase>
      <UseCase text="XL" usage="With size 128 and halo.">
        <Avatar src={IMAGE_SRC} size={128} isCivicLiker={true} />
      </UseCase>
    </Story>
  ))
