sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        'sap/m/MessageToast'
    ],
    function (Controller, JSONModel, MessageToast) {
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
            },
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
                        return response.json();
                    })
                    .then((data) => { // Use an arrow function to access the controller context
                        console.log(data);
                        MessageToast.show("Items Added");
                        this.getView().getModel("addItem").setData({
                            productName: "",
                            productID: "",
                            price: "",
                            supplier: "",
                            description: ""
                        });
                    })
                    .catch(function (error) {
                        console.error("Error:", error);
                        MessageToast.show(error);
                    });
            },
            onCancel: function () {
                console.log("I am Here")
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
