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
            arr = ko.toJS(arr);

            let result = [];

            for (i = 0; i < arr.length; i++) {
                if (mainIndex == i) {
                    result.push({
                        id: arr[i].value.id,
                        isMain: true,
                    })
                } else {
                    result.push({
                        id: arr[i].value.id,
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

        self.jsonSerializeInputTextForNumber = function (arr, mainIndex) {
            arr = ko.toJS(arr);

            let result = [];

            for (i = 0; i < arr.length; i++) {

                if (arr[i].value == undefined) {
                    break;
                }
                    

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

        self.jsonSerializeInputTextForEmail = function (arr, mainIndex) {
            arr = ko.toJS(arr);

            let result = [];

            for (i = 0; i < arr.length; i++) {
                if (arr[i].value == "")
                    break;

                if (mainIndex == i) {
                    result.push({
                        address: arr[i].value,
                        isMain: true,
                    })
                } else {
                    result.push({
                        address: arr[i].value,
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