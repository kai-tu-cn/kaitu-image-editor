<template>
  <div class="ui-index">
    <div class="ui-index_header">
      <div></div>
      <div class="project">图片编辑器</div>
      <el-button type="primary">Github</el-button>
    </div>
    <div class="ui-index_content">
      <div class="ui-editor">
        <div class="ui-editor_formwork">
          <el-tabs type="border-card" v-model="activeName" >
            <el-tab-pane label="模板" name="template">
              <ul class="ui-editor_formwork_template">
                <li v-for="i in 10" :key="i"
                 @click="appendFormwork">
                  <img src="/static/img/logo.png" alt="">
                  <div>777</div>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="素材" name="material">
              <ul class="ui-editor_formwork_material">
                <li v-for="(item, index) in material" :key="index"
                dragtype="image"
                draggable
                @dragstart="handleDragStart($event,item)"
                >
                  <template v-if="item.type == 'Image'">
                    <img :src="item.icon" alt="">
                  </template>
                  <template>
                    <i></i>
                  </template>
                  <div>{{item.name}}</div>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="ui-editor_workspace">
          <div class="ui-editor_container"
            @drop="handleDrop"
            @dragover="handleDragOver"
          >
            <canvas id="editor_canvas" :width="setting.width" :height="setting.height"></canvas>
          </div>
        </div>
        <div class="ui-editor_property">
          <el-tabs type="border-card">
            <el-tab-pane label="设置">
              <div class="">
                <el-form
                class="ui-margin-top"
                ref="form"
                :model="form"
                label-width="50px"
              >
                <el-form-item label="宽度">
                  <el-input v-model="setting.width"></el-input>
                </el-form-item>
                <el-form-item label="高度">
                  <el-input v-model="setting.height"></el-input>
                </el-form-item>
                <el-form-item label="背景">
                  <el-color-picker v-model="setting.background"></el-color-picker>
                </el-form-item>
              </el-form>
                <div class="ui-margin-top">
                  <el-button class="ui-block" type="primary"
                    >导入JSON</el-button
                  >
                </div>
                <div class="ui-margin-top">
                  <el-button class="ui-block" type="primary"
                    >下载图片</el-button
                  >
                </div>
                <div class="ui-margin-top">
                  <el-button class="ui-block">保存模板</el-button>
                </div>
                <div class="ui-margin-top">
                  <el-button class="ui-block">下载JSON</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性">
              <el-form
                class="ui-margin-top"
                ref="form"
                :model="form"
                label-width="80px"
              >
                <el-form-item label="图纸设置">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动名称">
                  <el-color-picker v-model="form.color"></el-color-picker>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="ui-index_footer">copyright@rolitter</div>
  </div>
</template>

<script>
import Index from './index'
export default Index
</script>
