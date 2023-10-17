sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
        "use strict";

        return BaseController.extend("project1.controller.Create", {

            onInit: function () {

                // create the views based on the url/hash
                this.getRouter().initialize();
            }
        });
    }
);
