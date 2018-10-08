define(['jquery'], function ($) {
    return {
        loadCss : function (fileName) {
            var cssTag = document.createElement("link")
            cssTag.setAttribute("rel", "stylesheet")
            cssTag.setAttribute("type", "text/css")
            cssTag.setAttribute("href", fileName)
            cssTag.setAttribute("class", "__dynamicCss")

            document.getElementsByTagName("head")[0].appendChild(cssTag)
        },
        loadCss : function (fileName, className) {
            var cssTag = document.createElement("link")
            cssTag.setAttribute("rel", "stylesheet")
            cssTag.setAttribute("type", "text/css")
            cssTag.setAttribute("href", fileName)
            cssTag.setAttribute("class", className)

            document.getElementsByTagName("head")[0].appendChild(cssTag)
        },
        removeModuleCss: function () {
            $(".__dynamicCss").remove();

        },
        removeModuleCss: function (className) {
            $("." + className).remove();

        },

    };
});