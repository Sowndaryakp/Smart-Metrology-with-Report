<template>
	<div>
	  <textarea v-model="editorData" id="editor"></textarea>

	  <input type="file" @change="loadTemplate">
    <button @click="saveTemplate">Save Template</button>
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
	  let additionalLabels = {};
  `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        `
	  // Fetch additional labels data from the endpoint
	  axios.get('http://172.18.100.240:6060/additional-labels')
		.then(response => {
		  // Extract the additional labels data from the response
		  additionalLabels = response.data;
  
		  // Generate table rows with the fetched data from dimensions endpoint
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
					<td>${item.upper_tolerance}</td>
					<td>${item.lower_tolerance}</td>
					<td>${item.Dim_Type}</td>
				  </tr>`;
			  });
  
			  // Populate editorData with the fetched data
			  this.editorData = `
			  <h1><strong><span style="font-size:26px">&nbsp;REPORT&nbsp;&nbsp;</span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <img alt="" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt5yD4nZYCoGw5E5ssxxm9ipwyugL7ng849VBz9PjWmw&amp;s" style="height:71px; width:120px" /></strong></h1>
			  
				<table align="left" border="1" cellpadding="1" cellspacing="1" style="width:1000px">
				  <tbody>
					<tr>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Date:</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px"><strong>${additionalLabels.Date}</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Quantity:</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px">${additionalLabels.Quantity}</span></td>
					</tr>
					<tr>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Inspection Report No:</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px">${additionalLabels.Inspection_Report_No}</span></td>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Group:</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px">${additionalLabels.Group}</span></td>
					</tr>
					<tr>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Project Name:&nbsp;</strong></span></td>
					  <td style="text-align:center">${additionalLabels.Project_Name}</td>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Part Name:</strong></span></td>
					  <td style="text-align:center"><span style="font-size:16px">${additionalLabels.Part_Name}</span></td>
					</tr>
					<tr>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Project Number:</strong></span></td>
					  <td style="text-align:center">${additionalLabels.Project_Number}</td>
					  <td style="text-align:center"><span style="font-size:16px"><strong>Part Number:</strong></span></td>
					  <td style="text-align:center">${additionalLabels.Part_Number}</td>
					</tr>
				  </tbody>
				</table>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<table align="left" border="1" cellpadding="1" cellspacing="1" style="width:1000px">
				  <tbody>
					<tr>
					  <td style="text-align:center">
						<p><span style="font-size:14px"><strong>ID&nbsp; &nbsp;</strong></span></p>
					  </td>
					  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp;Dimension&nbsp; &nbsp;</strong></span></td>
					  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp;Measured&nbsp; &nbsp;Value </strong></span></td>
					  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp; Upper_Tolerance</strong></span></td>
					  <td style="text-align:center"><span style="font-size:14px"><strong>&nbsp; &nbsp; &nbsp;Lower_Tolerance</strong></span></td>
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
				<p>&nbsp;</p>
				<p>&nbsp;</p>`;
			})
			.catch(error => {
			  console.error('Error fetching data:', error);
			});
		})
		.catch(error => {
		  console.error('Error fetching additional labels data:', error);
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
			editor.ui.addButton('PdfSaveButton', {
			  label: 'Save as PDF',
			  command: 'PdfSave',
			  toolbar: 'document'
			});
  
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
	methods: {
	  saveAsPDF() {
		var content = CKEDITOR.instances.editor.getData();
		var printWindow = window.open('', '_blank');
		printWindow.document.open();
		printWindow.document.write('<html><head><title>PDF</title></head><body>' + content + '</body></html>');
		printWindow.document.close();
		printWindow.print();
	  },
	  saveTemplate() {
  let editor = CKEDITOR.instances.editor;
  const content = editor.getData();
  const blob = new Blob([content], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template.html';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}
,

loadTemplate(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.editorData = reader.result;
    CKEDITOR.instances.editor.setData(this.editorData);
  };
  reader.readAsText(file);
}

	},
	beforeDestroy() {
	  CKEDITOR.instances.editor.destroy();
	}
  };
  </script>
  