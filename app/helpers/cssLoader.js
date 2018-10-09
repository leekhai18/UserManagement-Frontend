define(['jquery'], function ($) {

    var exists = function (className) {
        var x = document.getElementsByClassName(className);
        console.log(x);
        if (x.length > 1)
            return true;
        return false;
    }

    return {
        loadCss: function (fileName, className) {

            if (!exists(className)) {

                var cssTag = document.createElement("link")
                cssTag.setAttribute("rel", "stylesheet")
                cssTag.setAttribute("type", "text/css")
                cssTag.setAttribute("href", fileName)
                cssTag.setAttribute("class", className)

                document.getElementsByTagName("head")[0].appendChild(cssTag)

            }
        },
        removeModuleCss: function (className) {
            $("." + className).remove();

        },

    };
});