import * as React from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { ThemeProvider } from "styled-components/native"

import { defaultTheme } from "../../app/theme/styled"

export interface StoryProps {
  children?: React.ReactNode
}

const ROOT: ViewStyle = { flex: 1 }

export function Story(props: StoryProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <View style={ROOT}>
        <ScrollView>{props.children}</ScrollView>
      </View>
    </ThemeProvider>
  )
}
