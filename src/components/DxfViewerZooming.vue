<template>
<div class="canvasContainer" ref="canvasContainer">
    <div v-if="isDxfLoaded" class="buttons">
      <q-btn @click="zoomIn">Zoom In</q-btn>
      <q-btn @click="zoomOut">Zoom Out</q-btn>
      <q-btn @click="panLeft">Pan Left</q-btn>
      <q-btn @click="panRight">Pan Right</q-btn>
      <q-btn @click="panUp">Pan Up</q-btn>
      <q-btn @click="panDown">Pan Down</q-btn>
    </div>
    <!-- <div class="debug-info">DXF file loaded: {{ isDxfLoaded }}</div> -->
    <q-inner-loading :showing="isLoading" color="primary" style="z-index: 10"/>
    <div v-if="progress !== null" class="progress">
        <q-linear-progress color="primary" :indeterminate="progress < 0" :value="progress" />
        <div v-if="progressText !== null" class="progressText">{{progressText}}</div>
    </div>
    <div v-if="error !== null" class="error" :title="error">
        <q-icon name="warning" class="text-red" style="font-size: 4rem;" /> Error occurred: {{error}}
    </div>
     
</div>
</template>

<script>
import {DxfViewer} from "dxf-viewer"
import * as three from "three"
import DxfViewerWorker from "worker-loader!./DxfViewerWorker"
import panzoom from 'panzoom';
// import wheelzoom from 'wheel-zoom'; 


/** Events: all DxfViewer supported events (see DxfViewer.Subscribe()), prefixed with "dxf-". */
export default {
    name: "DxfViewer",

    props: {
        dxfUrl: {
            default: null
        },
        /** List of font URLs. Files should have TTF format. Fonts are used in the specified order,
         * each one is checked until necessary glyph is found. Text is not rendered if fonts are not
         * specified.
         */
        fonts: {
            default: null
        },
        options: {
            default() {
                return {
                    clearColor: new three.Color("#fff"),
                    autoResize: true,
                    colorCorrection: true,
                    sceneOptions: {
                        wireframeMesh: true
                    }
                }
            }
        }
    },

    data() {
        return {
            isLoading: false,
            progress: null,
            progressText: null,
            curProgressPhase: null,
            error: null,
            dxfViewer: null,
      isDxfLoaded: false,
      zoomLevel: 1, // Initial zoom level
            translateX: 0, // Initial translation on X-axis
            translateY: 0, // Initial translation on Y-axis
        }
    },

    watch: {
        async dxfUrl(dxfUrl) {
            if (dxfUrl !== null) {
                await this.Load(dxfUrl)
            } else {
                this.dxfViewer.Clear()
                this.error = null
                this.isLoading = false
                this.progress = null
                this.clearViewer();
            }
        }
    },

    methods: {
    async Load(url) {
      this.isLoading = true;
      this.error = null;
      try {
        this.dxfViewer = new DxfViewer(this.$refs.canvasContainer, this.options);
        await this.dxfViewer.Load({
          url,
          fonts: this.fonts,
          progressCbk: this._OnProgress.bind(this),
          workerFactory: DxfViewerWorker
        });
        this.isDxfLoaded = true; // Set isDxfLoaded to true only after successful load
        // Emit a custom event when a handle is clicked
        this.dxfViewer.Subscribe("handleClick", (handle) => {
          this.$emit("handle-click", handle);
        });
      } catch (error) {
        console.warn(error);
        this.error = error.toString();
      } finally {
        this.isLoading = false;
        this.progressText = null;
        this.progress = null;
        this.curProgressPhase = null;
      }
    },
    clearViewer() {
      if (this.dxfViewer) {
        this.dxfViewer.Clear();
        this.dxfViewer.Destroy();
        this.dxfViewer = null;
        this.isDxfLoaded = false;
      }
    },

    zoomIn() {
            this.zoomLevel *= 1.2; // Increase zoom level by 20%
            this.updateTransform();
        },

        zoomOut() {
            this.zoomLevel /= 1.2; // Decrease zoom level by 20%
            this.updateTransform();
        },

        panLeft() {
            this.translateX -= 50; // Move 50 pixels to the left
            this.updateTransform();
        },

        panRight() {
            this.translateX += 50; // Move 50 pixels to the right
            this.updateTransform();
        },

        panUp() {
            this.translateY -= 50; // Move 50 pixels up
            this.updateTransform();
        },

        panDown() {
            this.translateY += 50; // Move 50 pixels down
            this.updateTransform();
        },

        updateTransform() {
            const canvasContainer = this.$refs.canvasContainer;
            canvasContainer.style.transform = `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`;
        },
    ChangeDimensionColor(handle, color) {
      // Implement the logic to change the color of the specified dimension in the DXF diagram
      // For example, change the color or apply a visual highlight to the dimension
      console.log(`Dimension with handle ${handle} color changed to ${color}`);
    },

    HighlightHandle(handle) {
      // Implement the logic to highlight the specified handle in the DXF diagram
      // For example, change the color or apply a visual highlight to the handle
      console.log(`Handle ${handle} highlighted in the DXF diagram.`);
    },

        /** @return {DxfViewer} */
        GetViewer() {
            return this.dxfViewer
        },
        
        _OnProgress(phase, size, totalSize) {
            if (phase !== this.curProgressPhase) {
                switch(phase) {
                case "font":
                    this.progressText = "Fetching fonts..."
                    break
                case "fetch":
                    this.progressText = "Fetching file..."
                    break
                case "parse":
                    this.progressText = "Parsing file..."
                    break
                case "prepare":
                    this.progressText = "Preparing rendering data..."
                    break
                }
                this.curProgressPhase = phase
            }
            if (totalSize === null) {
                this.progress = -1
            } else {
                this.progress = size / totalSize
            }
        }
    },
    
    mounted() {
        this.dxfViewer = new DxfViewer(this.$refs.canvasContainer, this.options)
        const Subscribe = eventName => {
            this.dxfViewer.Subscribe(eventName, e => this.$emit("dxf-" + eventName, e))
        }
        for (const eventName of ["loaded", "cleared", "destroyed", "resized", "pointerdown",
                                 "pointerup", "viewChanged", "message"]) {
            Subscribe(eventName)
        }
        const container = this.$refs.canvasContainer;
    this.panzoomInstance = panzoom(container);
    wheelzoom(container);
    },

    destroyed() {
        this.dxfViewer.Destroy()
        this.dxfViewer = null
        this.clearViewer();
    }
}
</script>

<style scoped lang="less">

.canvasContainer {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 100px;
    min-height: 100px;

    .progress {
        position: absolute;
        z-index: 20;
        width: 90%;
        margin: 20px 5%;

        .progressText {
            margin: 10px 20px;
            font-size: 14px;
            color: #262d33;
            text-align: center;
        }
    }

    .error {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 20;
        padding: 30px;

        img {
            width: 24px;
            height: 24px;
            vertical-align: middle;
            margin: 4px;
        }
    }
}


</style>
