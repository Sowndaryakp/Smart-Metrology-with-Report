<template>
    <div>
      <textarea v-model="editorData" id="editor"></textarea>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        editorData: '<p>Hello, world!</p>'
      };
    },
    mounted() {
      // Replace 'editor' with the id of your textarea
      CKEDITOR.replace('editor', {
        toolbar: [
          { name: 'document', items: ['Source', '-', 'Save'] },
          { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
          { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'] },
          { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
          { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
          '/',
          { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
          { name: 'about', items: ['About'] }
        ],
        language: 'en',
        // Add any other configuration options here
      });
    },
    beforeDestroy() {
      CKEDITOR.instances.editor.destroy();
    }
  };
  </script>
  
  
  