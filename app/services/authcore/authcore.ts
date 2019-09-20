import { AUTHCORE_ROOT_URL as apiBaseURL } from "react-native-dotenv"

import { AuthCoreAuthClient } from "authcore-js/build/main.js"

/**
 * AuthCore callback functions to-be called
 */
export interface AuthCoreCallback {
  unauthenticated?: Function
}

/**
 * AuthCore Manager
 */
export class AuthCoreAPI {
  /**
   * The instance interacting between client and AuthCore AuthAPI server.
   */
  authClient: AuthCoreAuthClient

  /**
   * The set of callback functions to-be called.
   */
  callbacks: AuthCoreCallback

  constructor(callbacks = {}) {
    this.callbacks = callbacks
  }

  async setup(accessToken: string) {
    this.authClient = await new AuthCoreAuthClient({
      apiBaseURL,
      callbacks: this.callbacks,
      accessToken,
    })
  }

  /**
   * Sign out AuthCore
   */
  signOut() {
    return this.authClient.signOut()
  }
}
