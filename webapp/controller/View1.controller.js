sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {

                // Extra ******
                var oProductsModel;
                oProductsModel = new JSONModel(sap.ui.require.toUrl("project1/mockdata/products.json"));
                oProductsModel.setSizeLimit(1000);
                this.getView().setModel(oProductsModel, 'products');
                // *******//** */

                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            },

            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");

                // Save the current route name
                this.currentRouteName = sRouteName;
                this.currentProduct = oArguments.product;
                this.currentSupplier = oArguments.supplier;
            },

            onStateChanged: function (oEvent) {
                var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
                    sLayout = oEvent.getParameter("layout");

                // Replace the URL with the new layout if a navigation arrow was used
                if (bIsNavigationArrow) {
                    this.oRouter.navTo(this.currentRouteName, { layout: sLayout, product: this.currentProduct, supplier: this.currentSupplier }, true);
                }
            },

            onExit: function () {
                this.oRouter.detachRouteMatched(this.onRouteMatched, this);
            }
        });
    });
