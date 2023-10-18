sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/model/Sorter',
    'sap/m/MessageBox',
    'sap/f/library'
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
    "use strict";

    return Controller.extend("project1.controller.List", {
        onInit: function () {
            this.oView = this.getView();
            this._bDescendingSort = false;
            this.oProductsTable = this.oView.byId("productsTable");

            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onSearch: function (oEvent) {
            var oTableSearchState = [],
                sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
                oTableSearchState = [new Filter("ItemName", FilterOperator.Contains, sQuery)];
            }

            this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
        },

        onAdd: function (oEvent) {
            this.oRouter.navTo("page2", { layout: fioriLibrary.LayoutType.EndColumnFullScreen });
        },

        onSort: function () {
            this._bDescendingSort = !this._bDescendingSort;
            var oBinding = this.oProductsTable.getBinding("items"),
                oSorter = new Sorter("ItemName", this._bDescendingSort);
            oBinding.sort(oSorter);
        },
        onListItemPress: function (oEvent) {
            var productPath = oEvent.getSource().getBindingContext("products").getPath(),
                product = productPath.split("/").slice(-1).pop();

            this.oRouter.navTo("detail", { layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product });
        }
    });
});