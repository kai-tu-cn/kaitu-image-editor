import { fabric } from 'fabric'
import localforage from 'localforage'
import { nanoid } from 'nanoid'
import * as FileSaver from 'file-saver'
import '@/utils/arrow'
import '@/utils/background'
import { initAligningGuidelines } from '@/utils/aligning_guidelines'
let _fabricObj = null
let background = null
export default {
  data () {
    return {
      activeName: 'material',
      tempTitle: '778',
      tempVisible: false,
      tempList: [],
      setting: {
        width: 600,
        height: 400,
        background: '#fff'
      },
      material: [
        {
          name: '文本',
          icon: '#icon-wenben',
          type: 'IText'
        },
        {
          name: '矩形',
          icon: '#icon-juxing',
          type: 'Rect'
        },
        {
          name: '圆形',
          icon: '#icon-circle',
          type: 'Circle'
        },
        {
          name: '三角形',
          icon: '#icon-xingzhuang-sanjiaoxing',
          type: 'Triangle'
        },
        {
          name: '线条',
          icon: '#icon-zhixian',
          type: 'Line'
        },
        {
          name: '箭头',
          icon: '#icon-jiantou',
          type: 'Arrow'
        },
        {
          name: '图片1',
          icon: '/static/img/1.jpg',
          type: 'Image'
        },
        {
          name: '图片2',
          icon: '/static/img/2.jpg',
          type: 'Image'
        }
      ],
      backgroundGradient: [
        {
          background: 'linear-gradient(0deg, rgb(142, 197, 252) 0%, rgb(224, 195, 252) 100%)',
          angle: 0,
          colorStops: [
            { offset: 0, color: 'rgb(142, 197, 252)' },
            { offset: 1, color: 'rgb(224, 195, 252)' }
          ]
        },
        {
          background: 'linear-gradient(45deg, rgb(133, 255, 189) 0%, rgb(255, 251, 125) 100%)',
          angle: 45,
          colorStops: [
            { offset: 0, color: 'rgb(133, 255, 189)' },
            { offset: 1, color: 'rgb(255, 251, 125)' }
          ]
        },
        {
          background: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
          angle: 43,
          colorStops: [
            { offset: 0, color: '#4158D0' },
            { offset: 0.46, color: '#C850C0' },
            { offset: 1, color: '#FFCC70' }
          ]
        },
        {
          background: 'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
          angle: 90,
          colorStops: [
            { offset: 0, color: '#FF9A8B' },
            { offset: 0.55, color: '#FF6A88' },
            { offset: 1, color: '#FF99AC' }
          ]
        }
      ],
      menuList: [
        {
          name: '上移图层',
          value: 'bringForward'
        },
        {
          name: '下移图层',
          value: 'bringToFront'
        },
        {
          name: '置顶',
          value: 'sendBackwards'
        },
        {
          name: '置底',
          value: 'sendToBack'
        },
        {
          name: '删除',
          value: 'delete'
        }
      ],
      editObject: {}
    }
  },
  mounted () {
    this.initEditor()
    this.loadFormworkList()
  },
  methods: {
    initEditor () {
      /* eslint-disable */
      const self = this
      const $_container = self.$refs['ui-editor_container']
      const width = $_container.offsetWidth
      const height = $_container.offsetHeight
      _fabricObj = new fabric.Canvas('editor_canvas', {
        width,
        height,
        stopContextMenu: false,
        fireRightClick: true,
        enableRetinaScaling: true,
        preserveObjectStacking: true,
        selectionBorderColor: '#0069d9',
        selectionColor: 'rgba(64,158,255, 0.2)',
      })
      fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: '#fff',
        borderColor: '#0069d9',
        cornerStyle: 'circle',
        cornerSize: 12,
        cornerStrokeColor: '#ccc',
        borderScaleFactor: 1,
        borderOpacityWhenMoving: 3,
        borderOpacity: 1,
      })
      initAligningGuidelines(_fabricObj)
      self.initBackground()
      _fabricObj.on({
        'mouse:down': function(e) {
          self.hideMenu()
        },
        'selection:created': (e) => {
          //选中，动态更新赋值
          self.canvasSelectObject(e)
        },
        'selection:updated': (e) => {
          //选中更新
          self.canvasSelectObject(e)
        },
      })
    },
    initBackground() {
      background = new fabric.Background({
        width: 600,
        height: 400,
        fill: '#f6f7f9',
        id: 'background',
      })
      _fabricObj.add(background)
      background.center()
    },
    handleBackgroundSet() {
      const self = this
      const obj = {
        width: +self.setting.width,
        height: +self.setting.height,
        fill: self.setting.background
      }
      background.set(obj).center()
      _fabricObj.renderAll()
    },
    handleBackgroundGradient(item) {
      const angle = item.angle
      const colorStops = item.colorStops
      let anglePI = (-parseInt(angle, 10)) * (Math.PI / 180)
      var coords = {
        x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
        x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
        y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
        y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100,
      };
      let gradient = new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'percentage',
        coords: coords,
        colorStops: colorStops
      })
      background.set({
        fill: gradient
      }).setCoords()
      _fabricObj.renderAll()
    },
    saveFormwork() {
      const self = this
      _fabricObj.discardActiveObject()
      _fabricObj.renderAll();
      const json = _fabricObj.toDatalessJSON()
      const img = self.disposeImage()
      const id = nanoid(6)
      localforage.getItem('kt_temps').then(res => {
        const temps = JSON.parse(res || '{}')
        temps[id] = {json, title: self.tempTitle, img};
        localforage.setItem('kt_temps', JSON.stringify(temps)).then(res => {
          self.loadFormworkList()
          self.closeTempDialog()
        })
      })
    },
    openFormwork() {
      const self = this
      self.tempVisible = true
      self.tempTitle = ''
    },
    closeTempDialog() {
      const self = this
      self.tempVisible = false
    },
    loadFormworkList() {
      const self = this
      localforage.getItem('kt_temps').then(res => {
        const temps = JSON.parse(res || '{}')
        self.tempList = Object.keys(temps).map(item => ({
          title: temps[item].title,
          id: item, 
          img: temps[item].img,
          json: temps[item].json
        }))
      })
    },
    loadFormwork (item) {
      _fabricObj.clear();
      _fabricObj.loadFromJSON(item.json, _fabricObj.renderAll.bind(_fabricObj))
    },
    deleteFormwork(e, index, item) {
      const self = this
      e.stopPropagation()
      self.tempList.splice(index, 1)
      const temps = {}
      self.tempList.forEach(e => {
        temps[e.id] = {
          json: e.json,
          title: e.tempTitle,
          img: e.img
        } 
      })
      localforage.setItem('kt_temps', JSON.stringify(temps)).then(res => {
        self.loadFormworkList()
      })
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
    addMaterialToEditor(e, data) {
      const { clientX, clientY } = e
      const { offsetTop, offsetLeft } = document.querySelector('.ui-editor_container')
      const top = clientY - offsetTop
      const left = clientX - offsetLeft
      let Shape = null
      switch (data.type) {
        case 'IText':
          Shape = new fabric.IText('开图-图片编辑器',{
            id: nanoid(6),
            left: left - 20,
            top: top,
            fontSize: 40,
            fill: '#409EFF',
          });
          break;
        case 'Rect':
          Shape = new fabric.Rect({
            id: nanoid(6),
            left: left - 60,
            top: top - 40,
            width: 120,
            height: 80,
            fill: '#409EFF',
          });
          break;
        case 'Circle':
          Shape = new fabric.Circle({
            id: nanoid(6),
            left: left - 20,
            top: top - 20,
            radius: 40,
            fill: '#409EFF',
          });
          break;
        case 'Triangle':
          Shape = new fabric.Triangle({
            id: nanoid(6),
            left: left - 60,
            top: top - 60,
            width: 120,
            height: 120,
            fill: '#409EFF',
          });
          break;
        case 'Line':
          Shape = new fabric.Line([0, 200, 200, 0],{
            id: nanoid(6),
            left: left - 100,
            top: top - 100,
            stroke: '#409EFF',
            strokeWidth: 2,
          });
          break;
        case 'Arrow':
          Shape = new fabric.Arrow([0, 200, 200, 0],{
            id: nanoid(6),
            left: left - 50,
            top: top - 50,
            stroke: '#409EFF',
            strokeWidth: 2,
          });
          break;
        case 'Image':
          fabric.Image.fromURL(data.icon, oImg => {
            oImg.set({
              id: nanoid(8),
              left: left - oImg.width/2,
              top: top - oImg.height/2,
              globalCompositeOperation: 'source-atop',
            })
            _fabricObj.add(oImg)
            _fabricObj.setActiveObject(oImg)
            _fabricObj.renderAll()
          })
          return
          break;
      }
      Shape.set({
        globalCompositeOperation: 'source-atop',
      })
      _fabricObj.add(Shape)
      _fabricObj.setActiveObject(Shape)
      _fabricObj.renderAll()
    },
    hideMenu() {
      const self = this
      self.$refs['editorMenu'].style = `
      display: none;
      `
    },
    showMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      const self = this
      const menu = self.$refs['editorMenu']
      const pointX = event.clientX
      const pointY = event.clientY
      menu.style = `
        display: block;
        left: ${pointX}px;
        top: ${pointY}px;
      `
    },
    handleMenu(item) {
      const key = item.value
      const self = this
      const activeObject = _fabricObj.getActiveObject()
      if (activeObject) {
        switch(key) {
          case 'bringForward':
            _fabricObj.bringForward(activeObject)
            break
          case 'bringToFront':
            _fabricObj.bringToFront(activeObject)
            break
          case 'sendBackwards':
            _fabricObj.sendBackwards(activeObject)
            break
          case 'sendToBack':
            _fabricObj.sendToBack(activeObject)
            break
          case 'delete':
            _fabricObj.getActiveObjects().forEach(obj => {
              _fabricObj.remove(obj)
            })
            _fabricObj.discardActiveObject()
            break
        }
        _fabricObj.renderAll()
      }
      self.hideMenu()
    },
    downloadImg() {
      const self = this
      _fabricObj.discardActiveObject()
      _fabricObj.renderAll();
      const img = self.disposeImage()
      FileSaver.saveAs(img, `开图_${nanoid(6)}.png`);
    },
    disposeImage() {
      const self = this
      const canvas = new fabric.StaticCanvas(null, {
        width: self.setting.width,
        height: self.setting.height,
      })
      _fabricObj.getObjects().forEach(e => {
        canvas.add(e)
      })
      canvas.renderAll()
      self.canvasFitView(canvas)
      return canvas.toDataURL('image/png')
    },
    canvasFitView(canvas) {
      var objects = canvas.getObjects();
      if (!objects.length) return
      canvas.setZoom(1);
      canvas.absolutePan({ x: 0, y: 0 });
      if (objects.length > 0) {
        var rect = objects[0].getBoundingRect();
        var minX = rect.left;
        var minY = rect.top;
        var maxX = rect.left + rect.width;
        var maxY = rect.top + rect.height;
        for (var i = 1; i < objects.length; i++) {
          rect = objects[i].getBoundingRect();
          minX = Math.min(minX, rect.left);
          minY = Math.min(minY, rect.top);
          maxX = Math.max(maxX, rect.left + rect.width);
          maxY = Math.max(maxY, rect.top + rect.height);
        }
      }
      var panX = (maxX - minX - canvas.width) / 2 + minX;
      var panY = (maxY - minY - canvas.height) / 2 + minY;
      canvas.absolutePan({ x: panX, y: panY });
      var zoom = Math.min(canvas.width  / (maxX - minX), canvas.height  / (maxY - minY));
      zoom = Math.min(5, zoom)
      zoom = Math.max(0.2, zoom)
      var zoomPoint = new fabric.Point(canvas.width / 2, canvas.height / 2);
      canvas.zoomToPoint(zoomPoint, zoom);
    },
    importJson() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json'
      input.onchange = (event) => {
        const elem = event.target;
        if (elem.files && elem.files[0]) {
          const file = elem.files[0]
          const reader = new FileReader();
          reader.onloadend = (e) => {
            _fabricObj.clear();
            _fabricObj.loadFromJSON(e.target.result, _fabricObj.renderAll.bind(_fabricObj))
          };
          reader.readAsText(file, 'utf-8');
        }
      };
      input.click();
    },
    downloadJson() {
      _fabricObj.discardActiveObject()
      _fabricObj.renderAll();
      const json = _fabricObj.toDatalessJSON()
      let content = JSON.stringify(json)
      FileSaver.saveAs(
        new Blob([content], { type: 'text/plain;charset=utf-8' }),
        `开图_${nanoid(6)}.json`
      );
    },
    canvasSelectObject(e){
      const self = this
      const row = e.selected[0]
      self.editObject = row.toJSON()
    },
    handleChangeObject(obj) {
      const currentActive = _fabricObj.getActiveObject()
      currentActive.set(obj)
      _fabricObj.renderAll()
    },
    openSoft() {
      const url = 'http://139.159.160.146/'
      window.open(url,'_blank')
    }
  }
}