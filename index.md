# 基于Vue+Fabric实现一个h5可视化图片编辑器

背景介绍

为了提高企业研发效能和对客户需求的快速响应，现在很多企业都在着手数字化转型，不仅仅是大厂(阿里，字节，腾讯，百度)在做低代码可视化这一块，很多中小企业也在做，拥有可视化低代码相关技术背景的程序员也越来受重视.
大家现在跟我一起做一个图片编辑器.

预览界面
![kaitu](/assets/index_demo.png)

Github地址: [传送门](https://github.com/kai-tu-cn/kaitu-image-editor)

项目搭建和技术选型
- vue 前端主流框架(react,vue,angular)之一
- element-ui vue组件库
- fabric canvas操作组件库
- file-saver 文件下载
- localforage 本地离线存储
- nanoid uuid生成器

我们先安装`fabric`

```bash
yarn add fabric
```

```js
<canvas id="c" width="300" height="300"></canvas>

import { fabric } from "fabric";
export default {

}
mounted () {
  this.initEditor()
},
methods: {
  initEditor() {
    const canvas =  new fabric.Canvas('c')
    const shape = new fabric.Rect({
      width : 60,
      height : 60,
      fill : '#1ab394',
      left: 30,
      top: 30
    })
    canvas.add(shape);
  }
}
```
这样我们就创建好了一个画布，并在画布中插入了一个矩形，如下

![kaitu](/assets/rect_demo.png)

想要了解fabric.js,请前往 [fabric](http://fabricjs.com/docs/)

## 编辑器设计

页面布局
- 顶部 工具栏
- 左侧
  - 模板
  - 组件 可拖拽的组件
- 中间
 - 编辑区
- 右侧
 - 图纸设置/操作
 - 组件属性设置
### 1.画布
画布中间有一块编辑区,拖拽组件到该区域,就完成添加元素,拖拽到编辑区之外的,元素变成不可见,这里利用了`canvas`的 `globalCompositeOperation: source-atop` 目标图形和源图形内容重叠的部分的目标图形会被绘制
![kaitu](/assets/editor_canvas.png)

### 2.1 模板
点击模板,即可使用该模板,模板保存在本地,用户可以新增模板和删除模板,使用`localforage`做本地离线数据处理
![kaitu](/assets/editor_temp.png)

### 2.2 组件
组件 主要有如文本，图片，直线，矩形，圆形，三角形，箭头，也根据自己扩展更多的基本图元,在组件tab页面,拖拽任意一个元素到 `画布`,即可添加到`画布上`,
![kaitu](/assets/editor_com.png)

### 3.1 设置
设置画布的大小和颜色,和渐变色,大家可以自由扩展,添加更多的颜色
![kaitu](/assets/editor_set.png)

### 3.2 属性
属性编辑主要是用来对图形属性进行配置的，比如填充颜色，描边颜色，描边宽度，目前我主要定义了这3个属性，大家也可以基于此继续扩展更多的可编辑属性,例如 width/height/top/left/....等等
![kaitu](/assets/editor_attr.png)

### 下载图片功能实现
我们想要保存的不是整个画布,不能使用`canvas.toDataURL(''image/png)`,
我们先获取到原有的画布数据,再使用`fabric`的静态画布`StaticCanvas`,创建一个不可见的`画布`,把原有的数据一一添加到 新的不可见`画布`中去,

```js
disposeImage() {
  //处理画布数据并生成图片
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
  // 组件缩放到整个画布
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
```



### 模版保存实现

在设计图片编辑器的过程中我们也要考虑保存用户的资产，比如做的比较好的图片可以保存为模版，以便下次复用.
fabric 提供了序列化画布的方法 toDatalessJSON()，我们在保存模版的时候只要把序列化后的 json 和图片一起保存即可,这里方便处理数据,使用了 localforage,

保存模版的具体实现如下

```js
const self = this
canvas.discardActiveObject()
canvas.renderAll();
const json = canvas.toDatalessJSON()
const img = self.disposeImage()// 处理图片,特别说明
const id = nanoid(6)
localforage.getItem('kt_temps').then(res => {
  const temps = JSON.parse(res || '{}')
  temps[id] = {json, title: self.tempTitle, img};
  localforage.setItem('kt_temps', JSON.stringify(temps)).then(res => {
    //再次获取模板列表
  })
})
```

### 引用模版功能实现

引用模版的本质是反序列化 Json Schema，所以我们可以直接将模板的 json 直接加载到画布
```js
  canvas.clear();
  canvas.loadFromJSON(json, canvas.renderAll.bind(canvas))
```
### 导出Json
调用 fabric.js 的 toDatalessJSON 和FileSaver.js
```js
canvas.discardActiveObject() //先取消选中
canvas.renderAll();
const json = canvas.toDatalessJSON()
let content = JSON.stringify(json)
FileSaver.saveAs(
  new Blob([content], { type: 'text/plain;charset=utf-8' }),
  `导出.json`
);
```

### 导入Json
选择本地json,再一次调用 反序列化 Json Schema, 把 json 直接加载到画布
```js
const input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json'
input.onchange = (event) => {
  const elem = event.target;
  if (elem.files && elem.files[0]) {
    const file = elem.files[0]
    const reader = new FileReader();
    reader.onloadend = (e) => {
      canvas.clear();
      canvas.loadFromJSON(e.target.result, canvas.renderAll.bind(canvas))
    };
    reader.readAsText(file, 'utf-8');
  }
};
input.click();
```
这款图片编辑器我已经在 github 开源了，大家可以基于本项目进行二次开发,开发出更强大的图片编辑器，对于图片编辑器的后期规划，我确定了几个可行的方向，如果大家感兴趣也可以联系我参与到项目中来。

### 后期规划
- [x] 撤销重做
- [x] 键盘快捷键
- [x] 丰富图形组件库
- [x] 图片滤镜配置
- [x] 模块化界面

如果大家对可视化搭建或者低代码感兴趣，可以在评论区交流你的想法和心得.

github: kaitu-image-editor | 轻量级且可扩展的图片/图形编辑器解决方案
首发：掘金技术社区
作者：南极熊的鼻涕
Github地址: [传送门](https://github.com/kai-tu-cn/kaitu-image-editor)
