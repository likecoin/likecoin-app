import { NavigationScreenProps } from "react-navigation"

export interface WebsiteSignInWebviewScreenNavigationParams {
  url: string
}

export interface WebsiteSignInWebviewScreenProps
  extends NavigationScreenProps<WebsiteSignInWebviewScreenNavigationParams> {}
