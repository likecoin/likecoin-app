import ArrowLeftIcon from "./arrow-left.svg"
import CrossIcon from "./cross.svg"
import ShareIcon from "./share.svg"

export const icons = {
  back: ArrowLeftIcon,
  close: CrossIcon,
  share: ShareIcon,
}

export type IconTypes = keyof typeof icons
