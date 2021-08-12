import * as React from "react"
import { ViewProps } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import styled from "styled-components/native"

import { gradient } from "../../theme"

const StyledLinearGradient = styled(LinearGradient)`
  width: 100%;
`

export interface GradientViewProps extends ViewProps {
  children?: React.ReactNode
}

export const GradientView = (props: GradientViewProps) => (
  <StyledLinearGradient
    colors={gradient.LikeCoin}
    start={{ x: 0.0, y: 1.0 }}
    end={{ x: 1.0, y: 0.0 }}
    {...props}
  />
)
