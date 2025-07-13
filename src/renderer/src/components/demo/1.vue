<template>
  <div class="flex-container">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <Main />
  </div>
</template>


<script setup lang="ts">
//flex-direction
//该属性用于定义主轴的方向，决定了弹性项目的排列方向。可选值有：
//row（默认值）：主轴为水平方向，项目从左到右排列。
//row-reverse：主轴为水平方向，项目从右到左排列。
//column：主轴为垂直方向，项目从上到下排列。
//column-reverse：主轴为垂直方向，项目从下到上排列。

//flex-wrap
//nowrap（默认值）：不换行，所有项目在一行内显示。
//wrap：换行，项目会根据容器宽度自动换行。
//wrap-reverse：换行，方向与 wrap 相反。

//3. justify-content
//该属性用于定义弹性项目在主轴上的对齐方式。可选值有：
//flex-start（默认值）：项目从主轴起始位置开始排列。
//flex-end：项目从主轴结束位置开始排列。
//center：项目在主轴上居中排列。
//space-between：项目在主轴上均匀分布，首尾项目紧贴容器边缘。
//space-around：项目在主轴上均匀分布，每个项目两侧的间距相等。
//space-evenly：项目在主轴上均匀分布，所有间距相等。

// align-items
// 此属性用于定义弹性项目在交叉轴上的对齐方式。可选值有：
// stretch（默认值）：项目在交叉轴上拉伸以填充容器。
// flex-start：项目在交叉轴起始位置对齐。
// flex-end：项目在交叉轴结束位置对齐。
// center：项目在交叉轴上居中对齐。
// baseline：项目根据基线对齐。

// item属性

// 1. flex-grow
// 该属性定义项目的放大比例，默认值为 0，表示不放大。如果所有项目的 flex-grow 值都为 1，则它们会平均分配剩余空间。

// 4. flex
// 这是 flex-grow、flex-shrink 和 flex-basis 的缩写属性，推荐使用该属性来设置项目的弹性。常见的取值有：
// auto：相当于 1 1 auto。
// none：相当于 0 0 auto。

import Main from './mode/2.vue'
</script>


<style>

.flex-container {
  display: flex;
  //flex-direction: row;
  //flex-wrap: wrap;
  //align-content: space-between;
  justify-content: center;
  background-color: lightgray;
}

.flex-item {
  background-color: lightcoral;
  margin: 10px;
  padding: 20px;
  font-size: 30px;
  flex-grow: 1;
}
</style>
