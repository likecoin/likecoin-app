import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import styled from "styled-components/native"

import { StoryScreen, Story } from "../../../storybook/views"

import { ScrollView } from "./"

declare let module

const View1 = styled.View`
  height: 300px;
  background-color: palevioletred;
`
const View2 = styled.View`
  height: 500px;
  background-color: palegreen;
`
const View3 = styled.View`
  height: 700px;
  background-color: paleturquoise;
`

storiesOf("ScrollView", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story isScrolling={false}>
      <ScrollView isWithShadow={true}>
        <View1 />
        <View2 />
        <View3 />
      </ScrollView>
    </Story>
  ))
