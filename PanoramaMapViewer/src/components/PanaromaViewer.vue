
<template>
  <div class="main">
    <div class="inner" id="threejs-container"></div>
    <div class="inner map" id="buildingpreview"></div>
  </div>
</template>

<script lang="ts">
import { PanoramaViewer } from '../scripts/components/PanoramaViewer';
import { BuildingPreview } from '../scripts/components/BuildingPreview';
export default {
  props: {
    width: Number,
    height: Number
  },
  mounted() {

    var offsetelement = document.getElementsByClassName("main")[0]
    
    const element = document.getElementById("threejs-container")
    if (!element){
      return
    }
    var viewer = new PanoramaViewer(offsetelement, window)
    viewer.setPoint(24)
    element.appendChild(viewer.element)

    const element2 = document.getElementById("buildingpreview")
    if (!element2){
      return
    }
    var preview = new BuildingPreview(window, viewer.canvasControl, element2, viewer)
    preview.setPoints()
    preview.setBuildings()
    element2.appendChild(preview.element)
  }
  
}

</script>
