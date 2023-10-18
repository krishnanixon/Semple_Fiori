sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/m/MessageToast',
    'sap/f/library'
], function (JSONModel, Controller, fioriLibrary, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.Detail", {
        onInit: function () {
            var oOwnerComponent = this.getOwnerComponent();

            this.oRouter = oOwnerComponent.getRouter();
            this.oModel = oOwnerComponent.getModel();

            this.oRouter.getRoute("list").attachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
        },

        onSupplierPress: function (oEvent) {
            this.oRouter.navTo("detailDetail", { layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded, supplier: supplier, product: this._product });
        },

        _onProductMatched: function (oEvent) {
            this._product = oEvent.getParameter("arguments").product || this._product || "0";
            this.getView().bindElement({
                path: "/value/" + this._product,
                model: "products"
            });
            console.log(this.getView().bindElement({
                path: "/value/" + this._product,
                model: "products"
            }))
        },
        onAdd: function (oEvent) {
            var oProductsModel = new JSONModel();

            var oModel = this.getView().getModel("products");
            var data = oModel.oData.value[this._product];

            var requestData = {
                "ItemCode": data.ItemCode,
                "ItemName": data.ItemName,
                "BarCode": data.BarCode,
                "ForeignName": data.ForeignName,
                "Price": data.ItemPrices[0].Price
            }
            console.log(requestData)

            this.getView().setModel(requestData, "ItemDetails");

            this.oRouter.navTo("create");
        },
        onInitialFocusOnAction: function () {
            MessageBox.warning(
                "Initial button focus is set by attribute \n initialFocus: sap.m.MessageBox.Action.CANCEL",
                {
                    icon: MessageBox.Icon.WARNING,
                    title: "Focus on a Button",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    initialFocus: MessageBox.Action.CANCEL,
                    styleClass: sResponsivePaddingClasses
                }
            );
        },
        onDelete: function (oEvent) {
            var oModel = this.getView().getModel("products");
            var id = oModel.oData.value[this._product].ItemCode;

            if (id) {
                var apiUrl = `http://44.193.177.66:50001/b1s/v1/Items('${id}')`;
                var username = `{"UserName": "manager", "CompanyDB": "AC_Demo"}`;
                var password = "Nixon@123";

                var credentials = btoa(username + ":" + password);

                fetch(apiUrl, {
                    method: "DELETE", // Use DELETE method for a DELETE request
                    headers: {
                        "Authorization": "Basic " + credentials
                    }
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json(); // If you expect a response, otherwise, you can remove this line
                    })
                    .then(function (data) {
                        // Handle the response data or success here
                        console.log(data); // Log the response data if needed
                        MessageToast.show("Item Deleted");
                    })
                    .catch(function (error) {
                        console.error("Error:", error);
                        MessageToast.show("Failed to delete item");
                    });
            }

        },
        onEditToggleButtonPress: function () {
            var oObjectPage = this.getView().byId("ObjectPageLayout"),
                bCurrentShowFooterState = oObjectPage.getShowFooter();

            oObjectPage.setShowFooter(!bCurrentShowFooterState);
        },

        onExit: function () {
            this.oRouter.getRoute("list").detachPatternMatched(this._onProductMatched, this);
            this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
        }
    });
});