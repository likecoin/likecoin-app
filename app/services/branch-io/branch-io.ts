import branch from 'react-native-branch'

export class BranchIO {
  /**
   * The config object
   */
  private params: any

  async setup() {
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }
      this.params = params
    })
  }

  getBranchInstance() {
    return branch
  }

  getParams() {
    return this.params
  }

  getLatestParams() {
    return branch.getLatestReferringParams()
  }

  getInstallParams() {
    return branch.getFirstReferringParams()
  }
}
