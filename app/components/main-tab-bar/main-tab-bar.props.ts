import { TabBarIconProps } from "react-navigation"

import { User } from "../../models/user"

export interface MainTabBarIconProps extends TabBarIconProps {
  routeName: string
  user?: User
}
