import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { CivicLikerV3SummaryView } from "./summary-view"

declare let module

storiesOf("CivicLikerV3SummaryView", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noBackground text="Default" usage="The default usage">
        <CivicLikerV3SummaryView
          validatorName="Civic Liker"
          status="inactive"
          stakingAmount={0}
          stakingAmountTarget={100}
        />
      </UseCase>
      <UseCase noBackground text="Default Layout" usage="The default usage">
        <CivicLikerV3SummaryView
          preset="default"
        />
      </UseCase>
      <UseCase noBackground text="CTA Layout" usage="The default usage">
        <CivicLikerV3SummaryView
          preset="cta"
        />
      </UseCase>
      <UseCase noBackground text="Mini Layout" usage="The default usage">
        <CivicLikerV3SummaryView
          preset="mini"
        />
      </UseCase>
      <UseCase noBackground text="Loading" usage="Show fetching data">
        <CivicLikerV3SummaryView status="loading" />
      </UseCase>
      <UseCase noBackground text="Partially staked">
        <CivicLikerV3SummaryView
          status="inactive"
          stakingAmount={29.00009}
          stakingAmountTarget={100}
        />
      </UseCase>
      <UseCase noBackground text="Fulfilled" usage="Activating">
        <CivicLikerV3SummaryView
          status="activating"
          stakingAmount={100}
          stakingAmountTarget={100}
        />
      </UseCase>
      <UseCase noBackground text="Fulfilled" usage="Active yet">
        <CivicLikerV3SummaryView
          status="active"
          stakingAmount={130}
          stakingAmountTarget={100}
        />
      </UseCase>
    </Story>
  ))
