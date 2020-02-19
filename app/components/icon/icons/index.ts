import ArrowDownIcon from "./arrow-down.svg"
import ArrowLeftIcon from "./arrow-left.svg"
import ArrowUpIcon from "./arrow-up.svg"
import BookmarkFilledIcon from "./bookmark-filled.svg"
import BookmarkOutlinedIcon from "./bookmark-outlined.svg"
import CrossIcon from "./cross.svg"
import LikeClap from "./like-clap.svg"
import Lock from "./lock.svg"
import QRCodeScan from "./qrcode-scan.svg"
import ReaderFeatured from "./reader-featured.svg"
import ReaderFollowing from "./reader-following.svg"
import ShareIcon from "./share.svg"
import SeenIcon from "./seen.svg"
import TabBookmark from "./tab-bookmark.svg"
import TabReader from "./tab-reader.svg"
import TabSettings from "./tab-settings.svg"
import TabWallet from "./tab-wallet.svg"
import ThreeDotHorizontal from "./three-dot-horizontal.svg"
import ThreeDotVertical from "./three-dot-vertical.svg"
import UndoIcon from "./undo.svg"

export const icons = {
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-up": ArrowUpIcon,
  back: ArrowLeftIcon,
  "bookmark-filled": BookmarkFilledIcon,
  "bookmark-outlined": BookmarkOutlinedIcon,
  close: CrossIcon,
  "like-clap": LikeClap,
  lock: Lock,
  "qrcode-scan": QRCodeScan,
  "reader-featured": ReaderFeatured,
  "reader-following": ReaderFollowing,
  share: ShareIcon,
  seen: SeenIcon,
  "tab-bookmark": TabBookmark,
  "tab-reader": TabReader,
  "tab-settings": TabSettings,
  "tab-wallet": TabWallet,
  "three-dot-horizontal": ThreeDotHorizontal,
  "three-dot-vertical": ThreeDotVertical,
  undo: UndoIcon,
}

export type IconTypes = keyof typeof icons
