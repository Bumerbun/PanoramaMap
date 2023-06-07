
<template>
    <h1> Test </h1>
    <div id="threejs-container"></div>
</template>

<script lang="ts">
import { PanoramaViewer } from '../classes/PanoramaViewer';

export default {
  mounted() {
    var viewer = new PanoramaViewer(800, 600, window);
    viewer.setPoint(1)
    document.getElementById("threejs-container")?.appendChild(viewer.element)
  }
}

</script>
