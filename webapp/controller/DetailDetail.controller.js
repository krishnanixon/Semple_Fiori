sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    'sap/f/library'
], function (JSONModel, Controller, fioriLibrary) {
    "use strict";

    return Controller.extend("project1.controller.DetailDetail", {
        onInit: function () {
            var oOwnerComponent = this.getOwnerComponent();

            this.oRouter = oOwnerComponent.getRouter();
            this.oModel = oOwnerComponent.getModel();

            this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPatternMatch, this);
        },

        _onPatternMatch: function (oEvent) {

            console.log(this._product)

        },
        handleAboutPress: function () {
            this.oRouter.navTo("page2", { layout: fioriLibrary.LayoutType.EndColumnFullScreen });
        },
        onExit: function () {
            this.oRouter.getRoute("detailDetail").detachPatternMatched(this._onPatternMatch, this);
        }
    });
});