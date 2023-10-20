sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/routing/History",
        'sap/m/MessageToast',
        'sap/f/library'
    ],
    function (Controller, JSONModel, MessageToast, History, fioriLibrary) {
        "use strict";

        return Controller.extend("project1.controller.AddItem", {
            onInit: function () {
                var oModel = new JSONModel({
                    productName: "",
                    productID: "",
                    price: "",
                    supplier: "",
                    description: ""
                });
                this.getView().setModel(oModel, "addItem");
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            dataFetch: function () {
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
                    }.bind(this)) // Bind the "this" context to access the view
                    .catch(function (error) {
                        MessageToast.show(error);
                        console.error("Error:", error);
                    });
            },
            onNavBack: function () {
                this.getView().getModel("addItem").setData({
                    productName: "",
                    productID: "",
                    price: "",
                    supplier: "",
                    description: ""
                });
                this.oRouter.navTo("list");
            }
            ,
            onSubmit: function () {
                var data = this.getView().getModel("addItem").getData();
                var requestData = {
                    "ItemCode": data.productID,
                    "ItemName": data.productName,
                    "BarCode": data.supplier,
                    "ForeignName": data.description,
                    "ItemPrices": [
                        {
                            "PriceList": 1,
                            "Price": data.price
                        }
                    ]
                }
                var apiUrl = "http://44.193.177.66:50001/b1s/v1/Items";
                var username = `{"UserName": "manager", "CompanyDB": "AC_Demo"}`;
                var password = "Nixon@123";

                var credentials = btoa(username + ":" + password);
                sap.ui.core.BusyIndicator.show()

                fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": "Basic " + credentials,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return;
                    })
                    .then(() => { // Use an arrow function to access the controller context
                        sap.ui.core.BusyIndicator.hide()
                        this.getView().getModel("addItem").setData({
                            productName: "",
                            productID: "",
                            price: "",
                            supplier: "",
                            description: ""
                        });
                        this.oRouter.navTo("list");
                        MessageToast.show("Item Added")
                        this.dataFetch()
                    })
                    .catch(function (error) {
                        sap.ui.core.BusyIndicator.hide()
                        console.error("Error:", error);
                        MessageToast.show(error);
                    });
            },
            onCancel: function () {
                this.getView().getModel("addItem").setData({
                    productName: "",
                    productID: "",
                    price: "",
                    supplier: "",
                    description: ""
                })
                this.getOwnerComponent().getRouter().navTo("");
            }
        });
    }
);
