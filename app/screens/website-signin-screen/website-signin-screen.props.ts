import { ImageRequireSource } from "react-native"
import { NavigationScreenProps } from "react-navigation"

export interface WebsiteSignInItem {
  id: string
  url: string
  logo: ImageRequireSource
}

export const WEBSITE_SIGNIN_ITEMS: ReadonlyArray<WebsiteSignInItem> = [
  {
    id: "Matters",
    url: "https://matters.news/",
    logo: require("./icons/matters.png"),
  },
  {
    id: "Appledailytw",
    url: "https://auth.appledaily.com/web/v7/apps/598aee773b729200504d1f31/login?region=TW&lang=zh_tw",
    logo: require("./icons/applydaily.png"),
  },
  {
    id: "Appledailyhk",
    url: "https://auth.appledaily.com/web/v7/apps/598aee533b729200504d1f2e/login?region=HK&lang=zh_hk",
    logo: require("./icons/applydaily.png"),
  },
  {
    id: "Substack",
    url: "https://substack.com/account/login",
    logo: require("./icons/substack.png"),
  },
  {
    id: "Daodu",
    url: "https://daodu.tech/wp-login.php",
    logo: require("./icons/daodu.png"),
  },
  {
    id: "Nytimes",
    url: "https://myaccount.nytimes.com/auth/login?response_type=cookie",
    logo: require("./icons/nytimes.png"),
  },
]

export interface WebsiteSignInScreenProps extends NavigationScreenProps {}
