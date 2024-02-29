import { Component, Property } from '@wonderlandengine/api'
import { vec3 } from 'gl-matrix'

/**
 * LogOnClick
 */
export class LogOnClick extends Component {
  static TypeName = 'log-on-click'

  static Properties = {
    vrCamera: Property.object(),
    title: Property.string(),
    description: Property.string(),
    infoBox: Property.object(),
  }

  init() {
    this.direction = vec3.create()
    this.positionInFrontOfEye = vec3.create()
  }

  start() {
    this.active = false
    const target = this.object.getComponent('cursor-target')
    this.infoTitle = this.infoBox.children[0]
    this.infoDescription = this.infoBox.children[1]
    if (this.infoTitle && this.infoDescription) {
      this.titleText = this.infoTitle.getComponent('text')
      this.descriptionText = this.infoDescription.getComponent('text')
    }
    this.infoTitle.active = this.active
    this.infoDescription.active = this.active
    this.infoBox.active = this.active
    target.addClickFunction(this.onClick.bind(this))
  }

  onClick() {
    this.active = !this.active
    if (this.active && this.titleText) {
      this.texts = this.description.split('\\n')
      this.titleText.text = this.title
      this.descriptionText.text = this.texts.join('\n')
      this.positionInfoBoxInFrontOfLeftEye()
    }
    this.infoTitle.active = this.active
    this.infoDescription.active = this.active
    this.infoBox.active = this.active
  }

  positionInfoBoxInFrontOfLeftEye() {
    const eyePosition = this.vrCamera.getPositionWorld()
    const eyeForward = this.vrCamera.getForwardWorld(this.direction)

    const distanceInFront = 2
    vec3.scaleAndAdd(
      this.positionInFrontOfEye,
      eyePosition,
      eyeForward,
      distanceInFront
    )

    this.infoBox.setPositionWorld(this.positionInFrontOfEye)

    const cameraOrientation = this.vrCamera.getRotationWorld()
    this.infoBox.setRotationWorld(cameraOrientation)
  }
}
