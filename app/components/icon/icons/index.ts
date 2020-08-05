import ArrowIncrease from "./arrow-increase.svg"
import ArrowDecrease from "./arrow-decrease.svg"
import ArrowDownIcon from "./arrow-down.svg"
import ArrowLeftIcon from "./arrow-left.svg"
import ArrowRightIcon from "./arrow-right.svg"
import ArrowUpIcon from "./arrow-up.svg"
import Bell from "./bell.svg"
import BookmarkFilledIcon from "./bookmark-filled.svg"
import BookmarkOutlinedIcon from "./bookmark-outlined.svg"
import CrossIcon from "./cross.svg"
import GlobalEye from "./global-eye.svg"
import LikeClap from "./like-clap.svg"
import Lock from "./lock.svg"
import Person from "./person.svg"
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
  "arrow-increase": ArrowIncrease,
  "arrow-decrease": ArrowDecrease,
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
  back: ArrowLeftIcon,
  bell: Bell,
  "bookmark-filled": BookmarkFilledIcon,
  "bookmark-outlined": BookmarkOutlinedIcon,
  close: CrossIcon,
  "global-eye": GlobalEye,
  "like-clap": LikeClap,
  lock: Lock,
  person: Person,
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
