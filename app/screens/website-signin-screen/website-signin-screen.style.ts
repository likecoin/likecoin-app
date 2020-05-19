import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native"

import { color, spacing } from "../../theme"
import { sizes } from "../../components/text/text.sizes"

export const WebsiteSignInScreenStyle = StyleSheet.create({
  List: {
    flex: 1,
    padding: spacing[3],
  } as ViewStyle,
  ListFooter: {
    marginTop: spacing[3],
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  ListItem: {
    paddingHorizontal: spacing[3],
  } as ViewStyle,
  ListItemImage: {
    width: 32,
    height: 32,
    marginRight: spacing[2],
    borderRadius: 8,
  } as ImageStyle,
  ListItemLayout: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  ListItemTitle: {
    fontSize: sizes.medium,
    marginVertical: spacing[1],
  } as TextStyle,
  ListSeparator: {
    height: spacing[3],
  } as ViewStyle,
  Root: {
    flex: 1,
    backgroundColor: color.primary,
  } as ViewStyle,
  TextInput: {
    marginVertical: spacing[3],
    paddingTop: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: color.palette.greyf2,
    borderRadius: 14,
  } as TextStyle,
})
