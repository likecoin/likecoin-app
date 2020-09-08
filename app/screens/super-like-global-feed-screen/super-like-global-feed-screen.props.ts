import { SuperLikeGlobalStore } from "../../models/super-like-global-store"

import { ContentListScreenProps } from "../../components/content-list-screen"

export interface SuperLikeGlobalFeedScreenProps extends ContentListScreenProps {
  superLikeGlobalStore?: SuperLikeGlobalStore
}
