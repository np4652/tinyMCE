var Q;
(Q => {
    Q.removeEditor = () => {
        if (tinymce.editors.length > 0) {
            tinymce.remove('textarea');
            tinymce.execCommand('mceRemoveEditor', true, 'textarea');
        }
    };

    Q.initEditor = () => {
		 var replacementKeys = function (editor) {
			 let list=[
			  {text: 'Select key', value: '0'},
              {text: 'Key - 1', value: '{Key1}'},
              {text: 'Key - 2', value: '{Key2}'},
              {text: 'Key - 3', value: '{Key3}'},
              {text: 'Key - 4', value: '{Key4}'},
          ];
            editor.addButton('replacementKeys', {
                  type: 'listbox',
				  text: 'Keys',
				  icon: false,
				  onselect: function(e) {
				  	//tinyMCE.execCommand(this.value());
					tinyMCE.execCommand('mceInsertContent',false,this.value());
				  },
				  values:list,
				   // onPostRender: function() {
			    	// // Select the firts item by default
			    	// this.value('JustifyLeft');
			    // }
            });
        };

		
		
        var initImageUpload = function (editor) {
            var inp = $('<input id="tinymce-uploader" type="file" name="pic" accept="image/*" style="display:none">');
            $(editor.getElement()).parent().append(inp);
            editor.addButton('imageupload', {
                text: '',
                icon: 'image',
                onclick: function (e) {
                    inp.trigger('click');
                }
            });
            inp.on("change", function (e) {
                uploadFile($(this), editor);
            });
        };

        var uploadFile = function (inp, editor) {
            if (inp.val() !== undefined && inp.val() !== '') {
                var input = inp.get(0);
                var data = new FormData();
                data.append('file', input.files[0]);
                $.ajax({
                    url: '/uploadTinyMCEImage',
                    type: 'POST',
                    data: data,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        editor.insertContent('<img class="content-img" src="' + data + '"/>');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR.responseText) {
                            errors = JSON.parse(jqXHR.responseText).errors
                            alert('Error uploading image: ' + errors.join(", ") + '. Make sure the file is an image and has extension jpg/jpeg/png.');
                        }
                    }
                });
            }
        };

        if (tinymce.editors.length > 0) {
            tinymce.remove('textarea');
        }
        tinymce.init({
            selector: 'textarea',
            height: 400,
            theme: 'modern',
            plugins: ['advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools'
            ],
            toolbar1: 'insertfile undo redo  |fontselect  fontsizeselect forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent table imageupload | preview code | replacementKeys ',
            setup: function (editor) {
                initImageUpload(editor);
				replacementKeys(editor);
            },
            image_advtab: true,
            templates: [
                { title: 'Test template 1', content: 'Test 1' },
                { title: 'Test template 2', content: 'Test 2' }
            ],
            content_css: ['//www.tinymce.com/css/codepen.min.css'
            ]
        });
    };

    Q.htmlEditor = () => {
        import('lib/TinyMCE/tinymce.min.js')
            .then(obj => Q.initEditor())
            .catch(err => console.log('loading error, no such module exists'));
    };
})(Q || (Q = {}));