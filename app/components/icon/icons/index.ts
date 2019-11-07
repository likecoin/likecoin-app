import ArrowDownIcon from "./arrow-down.svg"
import ArrowLeftIcon from "./arrow-left.svg"
import ArrowUpIcon from "./arrow-up.svg"
import CrossIcon from "./cross.svg"
import ShareIcon from "./share.svg"

export const icons = {
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-up": ArrowUpIcon,
  back: ArrowLeftIcon,
  close: CrossIcon,
  share: ShareIcon,
}

export type IconTypes = keyof typeof icons
