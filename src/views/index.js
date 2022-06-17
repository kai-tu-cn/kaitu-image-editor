import { fabric } from 'fabric'
import localforage from 'localforage'
import { nanoid } from 'nanoid'
let _fabricObj = null
export default {
  data () {
    return {
      activeName: 'material',
      setting: {
        width: 600,
        height: 400,
        background: '#fff'
      },
      material: [
        {
          name: '文本',
          icon: '',
          type: 'IText'
        },
        {
          name: '矩形',
          icon: '',
          type: 'Rect'
        },
        {
          name: '圆形',
          icon: '',
          type: 'Circle'
        },
        {
          name: '三角形',
          icon: '',
          type: 'Triangle'
        },
        {
          name: '线条',
          icon: '',
          type: 'Line'
        },
        {
          name: '箭头',
          icon: '',
          type: 'Arrow'
        },
        {
          name: 'Image',
          icon: '/static/img/1.jpg',
          type: 'Image'
        },
        {
          name: 'Image',
          icon: '/static/img/2.jpg',
          type: 'Image'
        },
        {
          name: 'Image',
          icon: '/static/img/3.jpg',
          type: 'Image'
        },
        {
          name: 'Image',
          icon: '/static/img/4.jpg',
          type: 'Image'
        }
      ],
      form: {
        name: '',
        region: '',
        color: '#fc0',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      /* eslint-disable */
      const self = this
      _fabricObj = new fabric.Canvas('editor_canvas', {
        stopContextMenu: false,
        backgroundColor: self.setting.background,
        enableRetinaScaling: true,
        preserveObjectStacking: true
      })
    },
    appendFormwork() {

    },
    loadFormwork () {
      nanoid(6)
    },
    handleDragStart(e, item) {
      e.dataTransfer.setData('data', JSON.stringify(item))
    },
    handleDrop(e) {
      const self = this
      e.preventDefault()
      e.stopPropagation()
      if(e.dataTransfer.getData('data')) {
        const data = JSON.parse(e.dataTransfer.getData('data'))
        self.addMaterialToEditor(e, data)
      }
    },
    handleDragOver(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    saveFormwork () {
      localforage.setItem('copy-data').then(() => {
      })
    },
    addMaterialToEditor(e, data) {
      const { clientX, clientY } = e
      const { offsetTop, offsetLeft } = document.querySelector('.ui-editor_container') // 距离顶部和左边
      let Shape = null;
      const top = clientY - offsetTop
      const left = clientX - offsetLeft
      switch (data.type) {
        case 'IText':
          Shape = new fabric.IText('开图-图片编辑器',{
            id: nanoid(6),
            left: left,
            top: top,
            fontSize: 40,
            fill: '#409EFF',
          });
          break;
        case 'Rect':
          Shape = new fabric.Rect({
            id: nanoid(6),
            left: left,
            top: top,
            width: 120,
            height: 80,
            fill: '#409EFF',
          });
          break;
        case 'Circle':
          Shape = new fabric.Circle({
            id: nanoid(6),
            left: left,
            top: top,
            radius: 40,
            fill: '#409EFF',
          });
          break;
        case 'Triangle':
          Shape = new fabric.Triangle({
            id: nanoid(6),
            left: left,
            top: top,
            width: 120,
            height: 120,
            fill: '#409EFF',
          });
          break;
        case 'Line':
          Shape = new fabric.Line([0, 200, 200, 0],{
            id: nanoid(6),
            left: left,
            top: top,
            fill: '#409EFF',
          });
          break;
        case 'Arrow':
          Shape = new fabric.Arrow([0, 200, 200, 0],{
            id: nanoid(6),
            left: left,
            top: top,
            fill: '#409EFF',
          });
          break;
        case 'Image':
          fabric.Image.fromURL(data.icon, oImg => {
            let imageWidth = Math.max(100, oImg.width)
            let scaleX = _fabricObj.width / 2 / imageWidth
            oImg.set({
              id: nanoid(8),
              left: clientX - oImg.width*scaleX,
              top: clientY,
              scaleX: scaleX,
              scaleY: scaleX,
            })
            _fabricObj.add(oImg)
            _fabricObj.setActiveObject(oImg)
            _fabricObj.renderAll()
          })
          return
          break;
      }
      _fabricObj.add(Shape)
      _fabricObj.setActiveObject(Shape)
      _fabricObj.renderAll()
    }
  }
}