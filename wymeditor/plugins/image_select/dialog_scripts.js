if (window.opener.ImageSelect === undefined) {
	throw 'ImageSelect is not defined';
}

var wym = window.opener.WYMeditor.INSTANCES[document.body.getAttribute('data-index')],
	imageSelect;


/** Ugly way to find ImageSelect instance */
for (var i in wym) {
	if (typeof wym[i] === 'object' && wym[i] instanceof window.opener.ImageSelect) {
		imageSelect = wym[i];
		break;
	}
}

if (imageSelect === undefined) {
	throw 'ImageSelect instance not found';
}

jQuery('#wym_select_image_add').click(function (e) {
	e.preventDefault();
	var radio_list = document.forms.wym_select_image_form.img;

	for (var i = 0, l = radio_list.length; i < l; ++i) {
		if (radio_list[i].checked) {
			imageSelect.insert_image(radio_list[i].value);
			window.close();
			break;
		}
	}

	alert('Select image or cancel');
});