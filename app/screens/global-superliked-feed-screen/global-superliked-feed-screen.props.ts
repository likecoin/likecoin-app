import { SuperLikeGlobalStore } from "../../models/super-like-global-store"
import { ContentListScreenProps } from "../../components/content-list-screen"

export interface GlobalSuperLikedFeedScreenProps
  extends ContentListScreenProps {
  superLikeGlobalStore?: SuperLikeGlobalStore
}
