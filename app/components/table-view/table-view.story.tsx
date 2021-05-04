import * as React from "react"
import { storiesOf } from "@storybook/react-native"

import { StoryScreen, Story, UseCase } from "../../../storybook/views"

import { TableView } from "./table-view"
import { TableViewCell } from "./table-view-cell"
import { Icon } from "../icon"

declare let module

storiesOf("TableViewCell", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noBackground text="Single Cell" usage="The default usage">
        <TableViewCell title="Title" />
      </UseCase>
      <UseCase noBackground text="Table View" usage="The default usage">
        <TableView>
          <TableViewCell title="Title" />
          <TableViewCell
            title="With accessory icon"
            accessoryIcon="navigate-next"
          />
          <TableViewCell
            title="With subtitle"
            subtitle="Subtitle"
            accessoryIcon="launch"
          />
          <TableViewCell
            title="With element append before title"
            append={(
              <Icon
                name="public"
                color="#4a4a4a"
                width={18}
                height={18}
              />
            )}
          />
        </TableView>
      </UseCase>
    </Story>
  ))
