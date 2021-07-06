import { User } from "../../models/user"

export interface MainTabBarIconProps {
  focused: boolean
  tintColor?: string
  horizontal?: boolean
  routeName: string
  user?: User
}
