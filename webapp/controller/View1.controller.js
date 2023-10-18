sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                var oProductsModel = new JSONModel();
                var apiUrl = "http://44.193.177.66:50001/b1s/v1/Items";
                var username = `{"UserName": "manager", "CompanyDB": "AC_Demo"}`;
                var password = "Nixon@123";

                // Encode credentials in base64
                var credentials = btoa(username + ":" + password);

                fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Authorization": "Basic " + credentials,
                        "Content-Type": "application/json"
                    }
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        // Set the retrieved data to the JSONModel
                        oProductsModel.setData(data);

                        // Set the JSONModel to the "products" model of the view
                        this.getView().setModel(oProductsModel, "products");
                    }.bind(this)) // Bind the "this" context to access the view

                    .catch(function (error) {
                        console.error("Error:", error);
                    });

                // The rest of your initialization code
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
