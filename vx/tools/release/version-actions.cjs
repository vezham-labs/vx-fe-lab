const { join } = require('node:path')

const { parseDocument } = require('yaml')
const jsRelease = require('@nx/js/src/release/version-actions')

const JsVersionActions = jsRelease.default ?? jsRelease

class VxVersionActions extends JsVersionActions {
  async updateProjectVersion(tree, newVersion) {
    const logMessages = await super.updateProjectVersion(tree, newVersion)
    const vxConfigPath = join(this.projectGraphNode.data.root, 'vx.app.yaml')

    if (!tree.exists(vxConfigPath)) {
      return logMessages
    }

    const document = parseDocument(tree.read(vxConfigPath, 'utf-8'))
    if (document.errors.length) throw document.errors[0]
    document.setIn(['core', 'version'], newVersion)
    tree.write(vxConfigPath, document.toString())

    return [
      ...logMessages,
      `✍️  New version ${newVersion} written to Vx app config: ${vxConfigPath}`
    ]
  }
}

module.exports = VxVersionActions
module.exports.afterAllProjectsVersioned = jsRelease.afterAllProjectsVersioned
