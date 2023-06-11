
<template>
    <div id="threejs-container"></div>
    <div id="buildingpreview"></div>
</template>

<script lang="ts">
import { PanoramaViewer } from '../classes/PanoramaViewer';
import { BuildingPreview } from '../classes/BuildingPreview';
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

    const elem2 = document.getElementById("buildingpreview")
    var preview = new BuildingPreview(this.width??1200, this.height??600, window, viewer.camera)
    preview.setPoints()
    elem2?.appendChild(preview.element)
    console.log(preview)
  }
  
}

</script>
