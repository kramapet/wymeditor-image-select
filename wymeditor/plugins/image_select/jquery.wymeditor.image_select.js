// Fugue icons by Yusuke Kamiyamane http://p.yusukekamiyamane.com/
// and licensed under Creative Commons Attribution


function ImageFromAttribute(attribute, options) {
	this.attribute = attribute;
	this.options = jQuery.extend({
		pathFormat: {
			normal: '/wymeditor/plugins/image_select/normal_{id}.jpg',
			thumbnail: '/wymeditor/plugins/image_select/thumbnail_{id}.jpg'
		}
	}, options);
}

ImageFromAttribute.prototype.get_images = function (el) {
	var attr = el.getAttribute(this.attribute);

	// if attribute is not specified or empty
	if (attr === null || attr.replace(/\s*/g, '') === '') {
		return [];
	}

	// delete additional whitespaces
	return attr.replace(/\s+/g, ' ').split(' ');
};

ImageFromAttribute.prototype.get_normal_path = function (id) {
	return this.get_format_path('normal', {'id': id});
};

ImageFromAttribute.prototype.get_thumbnail_path = function (id) {
	return this.get_format_path('thumbnail', {'id': id})
};

ImageFromAttribute.prototype.get_format_path = function (name, injects) {
	return this.get_path(this.options.pathFormat[name], injects);
};

ImageFromAttribute.prototype.get_path = function (format, injects) {
	// replace tags {}	
	for (var i in injects) {
		format = format.replace('{' + i + '}', injects[i]);	
	}

	return format;
};

function ImageSelect(options, wym) {
	this._options = jQuery.extend({
		selectImage: String() +
		'<li class="wym_tools_select_image">' +
			'<a name="select_image" href="#" ' + 
				'style="background-image: url(\'' + 
					wym._options.basePath + 
					'/plugins/image_select/image_select_icon.png\');' + 
					'background-position: center center" ' +
				'title="Select image">' +
			'Select image</a>' +
		'</li>',
		selectImageSelector: 'li.wym_tools_select_image a'
	}, options);
	this._wym = wym;
	this.init();
}

ImageSelect.prototype.init = function () {
	this._wym.imageSelect = this;
	var wym = this._wym,
		tools = jQuery(wym._box).find(wym._options.toolsSelector + wym._options.toolsListSelector);

	tools.append(this._options.selectImage);
	this.bindEvents();
};

ImageSelect.prototype.bindEvents = function () {
	var imageSelect = this,
		wym = imageSelect._wym,
		image_ids = imageSelect._options.images.get_images(wym._element.context);

	jQuery(wym._box).find(imageSelect._options.selectImageSelector).click(function (e) {
		e.preventDefault();

		if (image_ids.length === 0) {
			alert('There are no images to select');
			return;
		}

		var dialogHtml = String() + 
		'<body class="wym-dialog" data-index="' + WYMeditor.INDEX + '" onload="WYMeditor.INIT_DIALOG(\'' + WYMeditor.INDEX + '\');">' +
			'<form name="wym_select_image_form">' +
				imageSelect.generate_input_html(imageSelect.prepare_images_from_ids(imageSelect._options.images, image_ids)) + 
				'<button id="wym_select_image_add">add</button>' +
				'<button class="wym_cancel">cancel</button>' +
			'</form>' +
			'<script type="text/javascript" src="' + wym._options.basePath + 'plugins/image_select/dialog_scripts.js"></script>' +
		'</body>';
		wym.dialog(null, null, dialogHtml);
	});
};

ImageSelect.prototype.prepare_images_from_ids = function (pathgen, ids) {
	var images = [];
	for (var i = 0, l = ids.length; i < l; ++i) {
		var id = ids[i];
		images[id] = {
			'normal': pathgen.get_normal_path(id),
			'thumbnail': pathgen.get_thumbnail_path(id)
		};
	}

	return images;
}

ImageSelect.prototype.generate_input_html = function (images) {
	var html = [];
	for (var i in images) {
		var input = '<input id="img-' + i + '" type="radio" name="img" value="' + i + '">',
			label = '<label for="img-' + i + '"><img src="' + images[i].thumbnail + '"></label>';

		html.push(input);
		html.push(label);
	}
	return String() + html.join("\n") + "<br>";
};

ImageSelect.prototype.insert_image = function (id) {
	var pathgen = this._options.images,
		img = document.createElement('img'),
		wym = this._wym;

	img.src = pathgen.get_normal_path(id);
	var afterSel = wym.nodeAfterSel();

	if (afterSel === undefined) {
		this._wym.selectedContainer().appendChild(img);
	} else {
		afterSel.parentNode.insertBefore(img, afterSel);
	}
};