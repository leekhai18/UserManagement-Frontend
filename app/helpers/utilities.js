define([
    'knockout',
], function (ko) {


    // 
    // 
    // Custom binding
    // 
    // 

    // Bind Twitter tooltip
    ko.bindingHandlers.tooltip = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element, options, tooltip;
            options = ko.utils.unwrapObservable(valueAccessor());
            $element = $(element);
            tooltip = $element.data('tooltip');
            if (tooltip) {
                $.extend(tooltip.options, options);
            } else {
                $element.tooltip(options);
            }
        }
    };

    // 
    // 
    // Define model 
    // 
    // 

    var UtilitiesModel = function () {
        var self = this;


        // 
        // 
        // Json serialize selected option 
        // 
        //

        self.jsonSerializeSelected = function (arr, mainIndex) {
            var result = [];

            console.log("mainIndex---------------");
            console.log(mainIndex);

            for (i = 0; i < arr.length; i++) {
                if (mainIndex == i) {
                    result.push({
                        id: arr[i].id,
                        isMain: true,
                    })
                } else {
                    result.push({
                        id: arr[i].id,
                        isMain: false,
                    })
                }
            }

            return result;
        }


        // 
        // 
        // Json serialize text input
        // 
        //

        self.jsonSerializeInputText = function (arr, mainIndex) {
            arr = ko.toJS(arr);

            var result = [];

            for (i = 0; i < arr.length; i++) {
                if (mainIndex == i) {
                    result.push({
                        number: arr[i].value,
                        isMain: true,
                    })
                } else {
                    result.push({
                        number: arr[i].value,
                        isMain: false,
                    })
                }
            }

            return result;
        }


        // 
        // 
        // Upload image encoded format base 64
        // 
        //

        self.UploadImageBase64 = function (e) {
            //    
        }

    }

    return new UtilitiesModel();
});