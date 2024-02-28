import { Component, Property } from '@wonderlandengine/api'
import { vec3 } from 'gl-matrix'

/**
 * LogOnClick
 */
export class LogOnClick extends Component {
  static TypeName = 'log-on-click'

  static Properties = {
    vrCamera: Property.object(),
    message: Property.string('It was clicked!'),
    infoTextObject: Property.object(),
    infoBox: Property.object(),
  }

  init() {
    this.direction = vec3.create()
    this.positionInFrontOfEye = vec3.create()
  }

  start() {
    this.active = false
    const target = this.object.getComponent('cursor-target')

    if (this.infoTextObject) {
      this.informationText = this.infoTextObject.getComponent('text')
    }

    this.infoTextObject.active = this.active
    this.infoBox.active = this.active
    target.addClickFunction(this.onClick.bind(this))
  }

  onClick() {
    this.active = !this.active
    this.infoTextObject.active = this.active
    this.infoBox.active = this.active

    if (this.active && this.informationText) {
      this.informationText.text = this.message
      this.positionInfoBoxInFrontOfLeftEye()
    }
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
