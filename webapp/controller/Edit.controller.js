sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], function (JSONModel, Controller, MessageToast) {
    "use strict";
    return Controller.extend("project1.controller.Edit", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("edit").attachPatternMatched(this._onProductMatched, this);
        },
        _onProductMatched: function (oEvent) {
            var oProductsModel = new JSONModel();
            var productId = oEvent.getParameter("arguments").id || "0";
            var oModel = this.getView().getModel("products");
            if (oModel) {
                var data = oModel.oData.value[productId];
                var requestData = {
                    "ItemCode": data.ItemCode,
                    "ItemName": data.ItemName,
                    "BarCode": data.BarCode,
                    "ForeignName": data.ForeignName,
                    "Price": data.ItemPrices[0].Price
                }
                oProductsModel.setData(requestData);
                this.getView().setModel(oProductsModel, "ItemDetails");
            }
        },
        onCancel: function () {
            this.oRouter.navTo("list");
        },
        onSubmit: function () {
            var data = this.getView().getModel("ItemDetails");
            const updateData = {
                "ItemName": data.oData.ItemName,
                "ItemType": data.oData.ItemType,
                "BarCode": data.oData.BarCode,
                "ForeignName": data.oData.ForeignName,
                "ItemPrices": [
                    {
                        "PriceList": 1,
                        "Price": data.oData.Price
                    }
                ]
            }
            if (data.oData.ItemCode) {
                var apiUrl = `http://44.193.177.66:50001/b1s/v1/Items('${data.oData.ItemCode}')`;
                var username = `{"UserName": "manager", "CompanyDB": "AC_Demo"}`;
                var password = "Nixon@123";

                var credentials = btoa(username + ":" + password);
                sap.ui.core.BusyIndicator.show();

                fetch(apiUrl, {
                    method: "PATCH", // Use POST method for a POST request
                    headers: {
                        "Authorization": "Basic " + credentials,
                        "Content-Type": "application/json" // Set the content type for JSON data
                    },
                    body: JSON.stringify(updateData) // Convert the data to a JSON string
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return; // If you expect a response in JSON format
                    })
                    .then(function () {
                        sap.ui.core.BusyIndicator.hide();
                        MessageToast.show("Item Updated");
                    })
                    .catch(function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        console.error("Error:", error);
                    });
            }
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
                    this.getView().getModel("products").setData(data);
                }.bind(this))
                .catch(function (error) {
                    MessageToast.show(error);
                    console.error("Error:", error);
                });
            this.oRouter.navTo("list");
        }
    });
});