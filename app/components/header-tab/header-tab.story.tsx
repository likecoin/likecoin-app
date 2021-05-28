import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { HeaderTab, HeaderTabItem } from "./"

declare let module

function InteractiveHeaderTab() {
  const [value, setValue] = React.useState("item1")
  return (
    <HeaderTab value={value} onChange={setValue}>
      <HeaderTabItem
        value="item1"
        title="Title1"
        subtitle="Subtitle1"
      />
      <HeaderTabItem
        value="item2"
        title="Title2"
        subtitle="Subtitle2"
      />
    </HeaderTab>
  )
}

function InteractiveHeaderTabWithIcon() {
  const [value, setValue] = React.useState("item1")
  return (
    <HeaderTab value={value} onChange={setValue}>
      <HeaderTabItem
        value="item1"
        icon="bookmarks"
        subtitle="Bookmarks"
      />
      <HeaderTabItem
        value="item2"
        icon="super-like"
        subtitle="Super Likes"
      />
    </HeaderTab>
  )
}

storiesOf("HeaderTab", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Title & Subtitle", () => (
    <Story>
      <UseCase noPad text="Default">
        <InteractiveHeaderTab />
      </UseCase>
    </Story>
  ))
  .add("Icon", () => (
    <Story>
      <UseCase noPad text="Default">
        <InteractiveHeaderTabWithIcon />
      </UseCase>
    </Story>
  ))
