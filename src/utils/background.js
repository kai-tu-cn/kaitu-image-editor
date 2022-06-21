import { fabric } from 'fabric'
// @ts-ignore
export class BackgroundObject extends fabric.Rect {
  static type = 'Background'
  initialize (options) {
    super.initialize({
      ...options,
      selectable: false,
      hasControls: true,
      hasBorders: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 0,
      evented: true,
      hoverCursor: 'default'
    })
    return this
  }

  toObject (propertiesToInclude) {
    return super.toObject(propertiesToInclude)
  }

  toJSON (propertiesToInclude) {
    return super.toObject(propertiesToInclude)
  }

  static fromObject (options, callback) {
    return callback && callback(new fabric.Background(options))
  }
}

fabric.Background = fabric.util.createClass(BackgroundObject, {
  type: BackgroundObject.type
})
fabric.Background.fromObject = BackgroundObject.fromObject
