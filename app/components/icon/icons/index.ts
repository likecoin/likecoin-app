import AlertCircle from "./alert-circle.svg"
import ArchiveIcon from "./archive.svg"
import ArrowIncrease from "./arrow-increase.svg"
import ArrowDecrease from "./arrow-decrease.svg"
import ArrowDownIcon from "./arrow-down.svg"
import ArrowLeftIcon from "./arrow-left.svg"
import ArrowRightIcon from "./arrow-right.svg"
import ArrowUpIcon from "./arrow-up.svg"
import Bell from "./bell.svg"
import BookmarksIcon from "./bookmarks.svg"
import BookmarkFilledIcon from "./bookmark-filled.svg"
import BookmarkOutlinedIcon from "./bookmark-outlined.svg"
import Checkmark from "./checkmark.svg"
import CrossIcon from "./cross.svg"
import DisconnectIcon from "./disconnect.svg"
import ExternalLinkIcon from "./external-link"
import LikeClap from "./like-clap.svg"
import Lock from "./lock.svg"
import NFTDashboardIcon from "./nft-dashboard"
import NFTStackIcon from "./nft-stack"
import Person from "./person.svg"
import PlusIcon from "./plus"
import QRCodeScan from "./qrcode-scan.svg"
import ReaderFeatured from "./reader-featured.svg"
import ReaderFollowing from "./reader-following.svg"
import ShareIcon from "./share.svg"
import SeenIcon from "./seen.svg"
import SuperLikeIcon from "./super-like.svg"
import TabWallet from "./tab-wallet.svg"
import { ThreeDotHorizontalIcon } from "./three-dot-horizontal"
import ThreeDotVertical from "./three-dot-vertical.svg"
import UndoIcon from "./undo.svg"

import { DiscordIcon } from "./discord"
import { GitHubIcon } from "./github"
import { GlobalEyeIcon } from "./global-eye"
import { MediumIcon } from "./medium"
import { PublicIcon } from "./PublicIcon"
import { TabSettingsIcon } from "./tab-settings"
import { TwitterIcon } from "./twitter"
import { WallctConnectIcon } from "./wallet-connect"
import TickIcon from "./tick"

export const icons = {
  "alert-circle": AlertCircle,
  "archive": ArchiveIcon,
  "arrow-increase": ArrowIncrease,
  "arrow-decrease": ArrowDecrease,
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
  back: ArrowLeftIcon,
  bell: Bell,
  "bookmarks": BookmarksIcon,
  "bookmark-filled": BookmarkFilledIcon,
  "bookmark-outlined": BookmarkOutlinedIcon,
  checkmark: Checkmark,
  close: CrossIcon,
  disconnect: DisconnectIcon,
  discord: DiscordIcon,
  "external-link": ExternalLinkIcon,
  github: GitHubIcon,
  "global-eye": GlobalEyeIcon,
  "like-clap": LikeClap,
  lock: Lock,
  medium: MediumIcon,
  "nft-dashboard": NFTDashboardIcon,
  "nft-stack": NFTStackIcon,
  person: Person,
  plus: PlusIcon,
  "public": PublicIcon,
  "qrcode-scan": QRCodeScan,
  "reader-featured": ReaderFeatured,
  "reader-following": ReaderFollowing,
  share: ShareIcon,
  seen: SeenIcon,
  "super-like": SuperLikeIcon,
  twitter: TwitterIcon,
  "tab-settings": TabSettingsIcon,
  "tab-wallet": TabWallet,
  "three-dot-horizontal": ThreeDotHorizontalIcon,
  "three-dot-vertical": ThreeDotVertical,
  "tick": TickIcon,
  undo: UndoIcon,
  "wallet-connect": WallctConnectIcon,
}

export type IconTypes = keyof typeof icons
