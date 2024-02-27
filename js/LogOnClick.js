import { Component, Property } from '@wonderlandengine/api'
import { vec3, mat4, quat } from 'gl-matrix'

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
    this.tmpVec = vec3.create()
    this.tmpVec1 = vec3.create()
  }

  start() {
    this.active = false
    console.log(this.infoBox)
    console.log(this.infoTextObject)
    const target = this.object.getComponent('cursor-target')

    if (this.infoTextObject) {
      this.informationText = this.infoTextObject.getComponent('text')
    } else {
      console.log('no object')
    }
    this.infoTextObject.active = this.active
    this.infoBox.active = this.active
    target.addClickFunction(this.onClick.bind(this))
  }

  onClick() {
    this.active = !this.active

    if (this.active && this.informationText) {
      this.informationText.text = this.message

      // Fetch the current position of the camera to orient the info box towards it
      const cameraPosition = this.getCameraPosition()

      // Ensure the info box faces the camera
      this.makeInfoBoxFaceCamera(cameraPosition)

      // Calculate the new position for the info box to ensure it's properly placed
      // relative to the object and above it, while facing the camera.
      let objectPosition = this.object.getPositionWorld()
      let newPosition = vec3.create()

      // Example adjustment: position the info box slightly above the object
      vec3.set(
        newPosition,
        objectPosition[0],
        objectPosition[1] + 1,
        objectPosition[2]
      ) // Adjust Y-axis as needed

      // Set the new position for the info box
      this.infoBox.setPositionWorld(newPosition)
    }

    // Toggle the visibility of the text and the box
    this.infoTextObject.active = this.active
    this.infoBox.active = this.active
  }

  getCameraPosition() {
    return this.vrCamera.getPositionWorld()
  }

  makeInfoBoxFaceCamera(cameraPosition) {
    this.infoBoxPosition = this.infoBox.getPositionWorld()
    this.directionToCamera = vec3.subtract(
      vec3.create(),
      [cameraPosition[0], this.infoBoxPosition[1], cameraPosition[2]],
      this.infoBoxPosition
    )
    vec3.normalize(this.directionToCamera, this.directionToCamera)
    this.angle = Math.atan2(
      this.directionToCamera[2],
      this.directionToCamera[0]
    )
    this.rotation = quat.create()
    quat.rotateY(this.rotation, quat.create(), -this.angle)
    console.log('infotextobject', this.infoTextObject)
    this.infoBox.setRotationWorld(this.rotation)
  }
}
