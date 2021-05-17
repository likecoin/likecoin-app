import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { LikeCoinButton } from "./"

// eslint-disable-next-line no-var
declare var module

storiesOf("LikeCoinButton", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Default">
        <LikeCoinButton />
      </UseCase>
      <UseCase text="1 like">
        <LikeCoinButton likeCount={1} />
      </UseCase>
      <UseCase text="5 likes" usage="Disabled Super Like">
        <LikeCoinButton likeCount={5} />
      </UseCase>
      <UseCase text="5 likes, enabled Super Like" usage="Cooling down">
        <LikeCoinButton
          likeCount={5}
          isSuperLikeEnabled={true}
          canSuperLike={false}
          cooldownValue={0.33}
        />
      </UseCase>
      <UseCase text="5 likes, enabled Super Like" usage="Can Super Like">
        <LikeCoinButton
          likeCount={5}
          isSuperLikeEnabled={true}
          canSuperLike={true}
          cooldownValue={0}
        />
      </UseCase>
      <UseCase text="5 likes, enabled Super Like, has Super Like" usage="Cooling down">
        <LikeCoinButton
          likeCount={5}
          isSuperLikeEnabled={true}
          canSuperLike={false}
          hasSuperLiked={true}
          cooldownValue={0.33}
        />
      </UseCase>
      <UseCase text="5 likes, enabled Super Like, has Super Like" usage="Can Super Like">
        <LikeCoinButton
          likeCount={5}
          isSuperLikeEnabled={true}
          canSuperLike={true}
          hasSuperLiked={true}
          cooldownValue={0}
        />
      </UseCase>
    </Story>
  ))
