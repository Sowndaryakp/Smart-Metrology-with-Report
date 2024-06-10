<template>

<div class="root">
    <div class="layers-list">
        <div class="layers-header">Layers</div>
        <div v-if="layers !== null" class="layer-item">
            <input type="checkbox" :checked="showAll" @change="_ToggleAll"/>
            <label class="text-italic">All layers</label>
        </div>
        <div v-if="layers !== null" v-for="layer in layers" :key="layer.name" class="layer-item">
            <!-- <div class="layer-color" :style="{backgroundColor: _GetCssColor(layer.color)}"></div> -->
            <input type="checkbox" :checked="layer.isVisible" @change="e => _ToggleLayer(layer, e)"/>
            <label class="fieldName">{{layer.displayName}}</label>
        </div>
    </div>
</div>

</template>

<script>

export default {
    name: "LayersList",

    props: {
        layers: {
            /* Expecting array of {name: string, color: number, isVisible: boolean} */
            type: Array,
            default: null
        }
    },

    watch: {
        layers() {
            this.showAll = null
        }
    },

    data() {
        return {
            showAll: null
        }
    },

    methods: {
        _ToggleLayer(layer, newState) {
            this.$emit("toggleLayer", layer, newState.target.checked)
            this.showAll = null
        },

        _ToggleAll(newState) {
            this.showAll = newState.target.checked
            this.$emit("toggleAll", newState.target.checked)
        },

        _GetCssColor(value) {
            let s = value.toString(16)
            while (s.length < 6) {
                s = "0" + s
            }
            return "#" + s
        }
    }
}

</script>

<style scoped lang="less">
@font-face {
    font-family: 'CustomFont'; /* Specify the name of your font */
    src: url('../assets/fonts/Montserrat-SemiBold.ttf') format('truetype'); /* Adjust the path to your font file */
    /* You can include additional font variations (e.g., bold, italic) if available */
}

// .fieldName{
//     font-family: 'CustomFont', Arial, sans-serif;  
// }
.root,
.layers-header,
.layer-item label {
    font-family: 'CustomFont', Arial, sans-serif; /* Use your custom font as a fallback */
}
.root {
    height: 100%;
    max-height: 100%;
    width: 300px;
    font-family: 'CustomFont', Arial, sans-serif;
}

.layers-list {
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    width: 28vh;
}

.layers-header {
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.layer-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.layer-item input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
}

.layer-item label {
    color: #555;
    cursor: pointer;
}

.layer-item label:hover {
    text-decoration: underline;
}

/* Style for checkboxes when checked */
.layer-item input[type="checkbox"]:checked + label {
    color: #0d8840;
    font-weight: bold;
}

/* Style for checkboxes */
input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
}

/* Style for checkboxes when checked */
input[type="checkbox"]:checked + label {
    color: #07be54; /* Change text color when checked */
    font-weight: bold;
}

/* Style for checkboxes when hovered */
input[type="checkbox"]:hover {
    opacity: 0.7;
}

/* Style for layer items when hovered */
.layer-item:hover {
    border-radius: 5px; /* Add border radius when hovered */
}

</style>
