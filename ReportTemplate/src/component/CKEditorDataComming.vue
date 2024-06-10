<template>
	<div>
	  <textarea v-model="editorData" id="editor"></textarea>
	</div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
	data() {
	  return {
		editorData: ``
	  };
	},
	mounted() {
	  let tableRows = '';
	  // Make an HTTP request to fetch the data from the endpoint
	  axios.get('http://172.18.100.240:6060/dimensions')
		.then(response => {
		  // Extract the data from the response
		  const fetchedData = response.data;
  
		  // Generate table rows with the fetched data
		  fetchedData.forEach(item => {
			tableRows += `
			  <tr>
				<td>${item.ID}</td>
				<td>${item.Dimension}</td>
				<td>${item.Measured}</td>
				<td>${item.Upper_Tolerance}</td>
				<td>${item.Lower_Tolerance}</td>
				<td>${item.Dim_Type}</td>
			  </tr>`;
		  });
  
		  // Populate editorData with the fetched data
		  this.editorData = `
			<h1><strong><span style="font-size:26px">&nbsp;REPORT&nbsp;&nbsp;</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<img alt="" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt5yD4nZYCoGw5E5ssxxm9ipwyugL7ng849VBz9PjWmw&amp;s" style="height:71px; width:120px" /></strong></h1>
  
			<p><span style="font-size:16px"><strong>&nbsp;Date:</strong>&nbsp;<strong>05/02/2024</strong></span></p>
  
			<table align="left" border="1" cellpadding="1" cellspacing="1" style="width:700px">
			  <tbody>
				<tr>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Inspection number:</strong></span></td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>12345</strong></span></td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Group:</strong></span></td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Group A</strong></span></td>
				</tr>
				<tr>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Project Name:&nbsp;</strong></span></td>
				  <td style="text-align:center">Project ABC</td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Part Name:</strong></span></td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Part XYZ</strong></span></td>
				</tr>
				<tr>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Project Number:</strong></span></td>
				  <td style="text-align:center">P123</td>
				  <td style="text-align:center"><span style="font-size:16px"><strong>Part Number:</strong></span></td>
				  <td style="text-align:center">123XYZ</td>
				</tr>
			  </tbody>
			</table>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<table align="left" border="1" cellpadding="1" cellspacing="1" style="width:700px">
			  <tbody>
				<tr>
				  <td style="text-align:center">
					<p><span style="font-size:14px"><strong>ID&nbsp; &nbsp;</strong></span></p>
				  </td>
				  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp;Dimension&nbsp; &nbsp;</strong></span></td>
				  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp;Measured&nbsp; &nbsp;Value </strong></span></td>
				  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp; Upper Tolerance</strong></span></td>
				  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp; &nbsp;Lower Tolerance</strong></span></td>
				  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp; Dim_Type</strong></span></td>
				</tr>
				${tableRows}
			  </tbody>
			</table>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>
  
			<p>&nbsp;</p>`;
		})
		.catch(error => {
		  console.error('Error fetching data:', error);
		});
  
	  // Initialize CKEditor
	  CKEDITOR.replace('editor', {
		toolbar: [
		  { name: 'document', items: ['Source', '-', 'Save', 'Print'] },
		  { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
		  { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt'] },
		  { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
		  { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'uploadImage'] },
		  '/',
		  { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
		  { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
		  { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
		  { name: 'colors', items: ['TextColor', 'BGColor'] },
		  { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
		  { name: 'about', items: ['About'] }
		],
		language: 'en',
		removePlugins: 'about,about:blank',
		// Add any other configuration options here
		on: {
		  instanceReady: function(evt) {
			var editor = evt.editor;
  
			// Add custom command to save as PDF
			editor.addCommand('PdfSave', {
			  exec: function(editor) {
				var content = editor.getData();
				var printWindow = window.open('', '_blank');
				printWindow.document.open();
				printWindow.document.write('<html><head><title>PDF</title></head><body>' + content + '</body></html>');
				printWindow.document.close();
				printWindow.print();
			  }
			});
  
			// Bind the custom command to the 'Save' button
			editor.on('save', function(evt) {
			  var content = evt.editor.getData();
			  var printWindow = window.open('', '_blank');
			  printWindow.document.open();
			  printWindow.document.write('<html><head><title>PDF</title></head><body>' + content + '</body></html>');
			  printWindow.document.close();
			  printWindow.print();
			});
  
			// Enable the Save button in the toolbar
			self.editorData = self.editorData;
  
			// Add custom upload image button
			CKEDITOR.instances.editor.addCommand('uploadImage', {
			  exec: function(editor) {
				var input = document.createElement('input');
				input.type = 'file';
				input.accept = 'image/png';
				input.onchange = function(e) {
				  var file = e.target.files[0];
				  var reader = new FileReader();
				  reader.onload = function(event) {
					var imgSrc = event.target.result;
					var imgHtml = '<img src="' + imgSrc + '" />';
					editor.insertHtml(imgHtml);
				  }
				  reader.readAsDataURL(file);
				}
				input.click();
			  }
			});
			CKEDITOR.instances.editor.ui.addButton('Image', {
			  label: 'Insert Image',
			  command: 'uploadImage',
			  toolbar: 'insert'
			});
		  }
		}
	  });
	},
	beforeDestroy() {
	  CKEDITOR.instances.editor.destroy();
	}
  };
  </script>
  