sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'sap/f/library'
], function (UIComponent, JSONModel, fioriLibrary) {
    'use strict';

    return UIComponent.extend('project1.Component', {

        metadata: {
            manifest: 'json'
        },

        init: function () {
            var oModel, oRouter, editObj;

            UIComponent.prototype.init.apply(this, arguments);

            oModel = new JSONModel();
            this.setModel(oModel);

            editObj = new JSONModel()
            this.setModel(editObj, "ItemDetails")

            oRouter = this.getRouter();
            oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
            oRouter.initialize();
        },

        _onBeforeRouteMatched: function (oEvent) {
            var oModel = this.getModel(),
                sLayout = oEvent.getParameters().arguments.layout;

            // If there is no layout parameter, set a default layout (normally OneColumn)
            if (!sLayout) {
                sLayout = fioriLibrary.LayoutType.OneColumn;
            }

            oModel.setProperty("/layout", sLayout);
        }
    });
});