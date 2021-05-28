import * as React from "react"
import { Animated } from "react-native"
import styled from "styled-components/native"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story } from "../../../storybook/views"

import { HeaderTabItem } from "../header-tab"

import { HeaderTabContainerView } from "./"

declare let module

const ScrollView = styled(Animated.ScrollView)`
  flex: 1;
`
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

storiesOf("HeaderTabContainerView", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story isScrolling={false}>
      <HeaderTabContainerView
        value="tab1"
        items={[
          <HeaderTabItem
            key="tab1"
            value="tab1"
            title="Tab 1"
            subtitle="Tab One"
          />,
          <HeaderTabItem
            key="tab2"
            value="tab2"
            title="Tab 2"
            subtitle="Tab Two"
          />
        ]}
      >
        {props => (
          <ScrollView {...props}>
            <View1 />
            <View2 />
            <View3 />
          </ScrollView>
        )}
      </HeaderTabContainerView>
    </Story>
  ))
