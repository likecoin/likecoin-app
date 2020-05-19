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
    url: "https://tw.appledaily.com/",
    logo: require("./icons/applydaily.png"),
  },
  {
    id: "Appledailyhk",
    url: "https://hk.appledaily.com/",
    logo: require("./icons/applydaily.png"),
  },
  {
    id: "Substack",
    url: "https://substack.com/",
    logo: require("./icons/substack.png"),
  },
  {
    id: "Daodu",
    url: "https://daodu.tech/",
    logo: require("./icons/daodu.png"),
  },
  {
    id: "Nytimes",
    url: "https://www.nytimes.com/",
    logo: require("./icons/nytimes.png"),
  },
]

export interface WebsiteSignInScreenProps extends NavigationScreenProps {}
