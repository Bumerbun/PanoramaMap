
<template>
    <div id="threejs-container"></div>
</template>

<script lang="ts">
import { PanoramaViewer } from '../classes/PanoramaViewer';

export default {
  props: {
    width: Number,
    height: Number
  },
  mounted() {
    const element = document.getElementById("threejs-container")
    if (!element){
      return
    }
    
    console.log(element.getBoundingClientRect())
    var viewer = new PanoramaViewer(this.width??1200, this.height??600, window)
    viewer.setPoint(1)
    element.appendChild(viewer.element)
  }
  
}

</script>
