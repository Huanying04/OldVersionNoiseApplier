function buildUI(thisObj) {
    thisUI = (thisObj instanceof Panel ? thisObj : new Window("palette", "Old Version Noise Applier", undefined, {
        resizeable: true
    }));
    var res = "group{orientation:'column',\
        Amount: Panel{orientation:'row',\
			text: \"Amount of Noise\",\
            slider: Slider{minvalue:0,maxvalue:100},\
            sliderText: EditText{text:\"0\", minimumSize:[60, 20], maximumSize:[60,20]}\
        },\
        otherOptions: Group{\
            noiseTypeBox: Checkbox{text:'Use Color Noise'},\
            clippingBox: Checkbox{text:'Clipping'}\
        },\
        buttonGroup: Group{\
            applyButton: Button{text:'Apply'},\
            addButton: Button{text:'Add'}\
        }\
    }";

    thisUI.grp = thisUI.add(res);

    thisUI.layout.layout(true);
    thisUI.layout.resize();

    var updateAmountText = function() {
        thisUI.grp.Amount.sliderText.text = thisUI.grp.Amount.slider.value;
    };

    thisUI.grp.Amount.slider.onChanging = function() {
        updateAmountText();
    };

    thisUI.grp.Amount.sliderText.onChange = function() {
        if (isNaN(parseFloat(thisUI.grp.Amount.sliderText.text))) {
            return 0;
        }
        if (parseFloat(thisUI.grp.Amount.sliderText.text) < 0 || parseFloat(thisUI.grp.Amount.sliderText.text) > 100) {
            return 0;
        }
        thisUI.grp.Amount.slider.value = parseFloat(thisUI.grp.Amount.sliderText.text);
    };

    thisUI.grp.buttonGroup.applyButton.onClick = function() {
        var comp = app.project.activeItem;
        if (comp == null && !(comp instanceof CompItem)) {
            alert('no comp selected');
            return 0;
        }

        var selectedLayer = comp.selectedLayers;
        if (selectedLayer.length === 0) {
            alert('No layer selected');
            return 0;
        }

        for (var i = 0; i < selectedLayer.length; i++) {
            var noise = selectedLayer[i].property("Effects").addProperty("ADBE Noise");
            noise.property("ADBE Noise-0001").setValue(thisUI.grp.Amount.slider.value);
            noise.property("ADBE Noise-0002").setValue(thisUI.grp.otherOptions.noiseTypeBox.value);
            noise.property("ADBE Noise-0003").setValue(thisUI.grp.otherOptions.clippingBox.value);
        }
    };

    thisUI.grp.buttonGroup.addButton.onClick = function() {
        var comp = app.project.activeItem;
        if (comp == null && !(comp instanceof CompItem)) {
            alert('no comp selected');
            return 0;
        }

        var solid = comp.layers.addSolid([0, 0, 0], "Noise Solid", comp.width, comp.height, 1.0);
        var noise = solid.property("Effects").addProperty("ADBE Noise");
        noise.property("ADBE Noise-0001").setValue(thisUI.grp.Amount.slider.value);
        noise.property("ADBE Noise-0002").setValue(thisUI.grp.otherOptions.noiseTypeBox.value);
        noise.property("ADBE Noise-0003").setValue(thisUI.grp.otherOptions.clippingBox.value);
    };

    return thisUI;
}

buildUI(this);