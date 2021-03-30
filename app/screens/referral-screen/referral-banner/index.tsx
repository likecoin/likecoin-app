import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../../../components/text";
import Arrow from "./arrow";
import Dollars from "./dollars";
import StripsLeft from "./strips-left";
import StripsRight from "./strips-right";

import { ReferralBannerStyle as Style } from "./styles";

export interface ReferralBannerProps {
  style?: StyleProp<ViewStyle>
}

export default function ReferralBanner({ style }: ReferralBannerProps) {
  return (
    <View style={[Style.Root, style]}>
      <View style={Style.ContentWrapper}>
        <Text tx="SponsorLinkCTA.Line1" style={Style.Text} />
        <Text tx="SponsorLinkCTA.Line2" style={Style.TextSmall} />
      </View>
      <View style={Style.ArrowWrapper}>
        <Arrow style={Style.Arrow} />
      </View>
      <StripsLeft style={Style.StripsLeft} />
      <StripsRight style={Style.StripsRight} />
      <Dollars style={Style.Dollars} />
    </View>
  )
}
