import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * AuthCore User
 */
export const AuthCoreUserModel = types
  .model("AuthCoreUser")
  .props({
    id: types.identifier,
    profileName: types.maybe(types.string),
    displayName: types.maybe(types.string),
    primaryEmail: types.maybe(types.string),
    primaryEmailVerified: types.maybe(types.string),
    primaryPhone: types.maybe(types.string),
    primaryPhoneVerified: types.maybe(types.string),
    smsAuthentication: types.optional(types.boolean, false),
    totpAuthentication: types.optional(types.boolean, false),
  })

type AuthCoreUserType = Instance<typeof AuthCoreUserModel>
export interface AuthCoreUser extends AuthCoreUserType {}
type AuthCoreUserSnapshotType = SnapshotOut<typeof AuthCoreUserModel>
export interface AuthCoreUserSnapshot extends AuthCoreUserSnapshotType {}
