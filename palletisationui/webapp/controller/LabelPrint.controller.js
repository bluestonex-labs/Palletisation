sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.LabelPrint", {

        onInit() {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var oRouter = this.getOwnerComponent().getRouter();
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            oRouter.getRoute("LabelPrint").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._pageSize = 5;
            this._currentPage = 0;
            this._currentIndex = 0;
            this.getView().byId("LabelRoute1").setText(this.getOwnerComponent().getModel("CurrentRouteData").getData().key);
            var aSelectedRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            this.getView().byId("titleRoute1").setText(aSelectedRecord.Description);
            this._createDynamicTable1();
        },

        _createDynamicTable1: function () {
            // Suppose you already have your data model set
            var oModel = this.getOwnerComponent().getModel("cageDetails");
            //var oData = oModel.getData().value;
            var value = {
                "items": {
                    "2345": [
                        {
                            "CageID": "2345",
                            "DeliveryDate": "2025-02-18",
                            "ID": "PICK_52930",
                            "IsShort": false,
                            "MHEType_ID": null,
                            "MediaPlacement": 1,
                            "MediaType_ID": "2",
                            "Media_ID": "CA",
                            "NoOfPackingBoxRequired": 0,
                            "NominalWeight": "195.880",
                            "PalletID": null,
                            "PickJob": null,
                            "PickType_ID": "MT",
                            "PickerUserID": null,
                            "Plant_Plant": "BR10",
                            "Route": "T43203",
                            "Sequence": 113,
                            "Status_ID": "COMPLETED",
                            "Temperature_ID": "Frozen",
                            "TotalCube": "488.509",
                            "PickType": {
                                "Description": "Multi Pick",
                                "ID": "MT"
                            },
                            "MediaType": {
                                "ID": "2",
                                "MaximumWeightMulti": "600.000",
                                "MultiCubeMax": "1183.200",
                                "NoOfPosition": 9
                            },
                            "Media": {
                                "Description": "Cage",
                                "ID": "CA"
                            },
                            "Plant": {
                                "Description": null,
                                "Plant": "BR10"
                            },
                            "Status": {
                                "Description": "Complete Full",
                                "ID": "COMPLETED"
                            },
                            "Temperature": {
                                "Description": "Frozen",
                                "ID": "Frozen"
                            },
                            "To_PickTaskItems": [
                                {
                                    "ActualWeight": null,
                                    "Cube": "96.000",
                                    "Drop": 120,
                                    "ItemID": "bd762575-9e86-4acb-bce0-79a8a625ac83",
                                    "Material_Material": "000000000000071897",
                                    "NominalWeight": "24.000",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 1,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "5.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000071897",
                                        "MaterialDescription": "PANE COLIN ALSK CAC MSC QSA 120G SYE4.8K"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "19.200",
                                    "Drop": 120,
                                    "ItemID": "d78c7659-1c64-4089-a005-149c0972dd17",
                                    "Material_Material": "000000000000071897",
                                    "NominalWeight": "4.800",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000071897",
                                        "MaterialDescription": "PANE COLIN ALSK CAC MSC QSA 120G SYE4.8K"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "13.640",
                                    "Drop": 120,
                                    "ItemID": "fc12edc5-31b1-4ce1-ade0-eec1b0e10d25",
                                    "Material_Material": "000000000000074325",
                                    "NominalWeight": "6.000",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000074325",
                                        "MaterialDescription": "ST HACH.BOEUF CAC 15% VBF 100G X60"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "45.048",
                                    "Drop": 120,
                                    "ItemID": "a8cdf9ef-346b-4257-8553-42e1e30ca913",
                                    "Material_Material": "000000000000060181",
                                    "NominalWeight": "14.400",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "2.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000060181",
                                        "MaterialDescription": "TARTE POMME PRED. PASQ. 720G X 10"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },

                                {
                                    "ActualWeight": null,
                                    "Cube": "6.281",
                                    "Drop": 60,
                                    "ItemID": "7a523c15-6abf-48df-b656-cf72a6fe841b",
                                    "Material_Material": "000000000000039383",
                                    "NominalWeight": "2.500",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 3,
                                    "ShipTo": "0000756908",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "ST",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000039383",
                                        "MaterialDescription": "BATON.CAROTTE EXP.DAUCY CE2 ST2.5KG X4"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },

                            ],
                            "To_Marshalling": {
                                "LastDrop": 120
                            }
                        }
                    ],
                    "2346": [
                        {
                            "CageID": "2346",
                            "DeliveryDate": "2025-02-18",
                            "ID": "PICK_52930",
                            "IsShort": false,
                            "MHEType_ID": null,
                            "MediaPlacement": 1,
                            "MediaType_ID": "2",
                            "Media_ID": "CA",
                            "NoOfPackingBoxRequired": 0,
                            "NominalWeight": "195.880",
                            "PalletID": null,
                            "PickJob": null,
                            "PickType_ID": "MT",
                            "PickerUserID": null,
                            "Plant_Plant": "BR10",
                            "Route": "T43203",
                            "Sequence": 113,
                            "Status_ID": "COMPLETED",
                            "Temperature_ID": "Frozen",
                            "TotalCube": "488.509",
                            "PickType": {
                                "Description": "Multi Pick",
                                "ID": "MT"
                            },
                            "MediaType": {
                                "ID": "2",
                                "MaximumWeightMulti": "600.000",
                                "MultiCubeMax": "1183.200",
                                "NoOfPosition": 9
                            },
                            "Media": {
                                "Description": "Cage",
                                "ID": "CA"
                            },
                            "Plant": {
                                "Description": null,
                                "Plant": "BR10"
                            },
                            "Status": {
                                "Description": "Complete Full",
                                "ID": "COMPLETED"
                            },
                            "Temperature": {
                                "Description": "Frozen",
                                "ID": "Frozen"
                            },
                            "To_PickTaskItems": [
                                {
                                    "ActualWeight": null,
                                    "Cube": "96.000",
                                    "Drop": 120,
                                    "ItemID": "bd762575-9e86-4acb-bce0-79a8a625ac83",
                                    "Material_Material": "000000000000071897",
                                    "NominalWeight": "24.000",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 1,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "5.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000071897",
                                        "MaterialDescription": "PANE COLIN ALSK CAC MSC QSA 120G SYE4.8K"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "19.200",
                                    "Drop": 120,
                                    "ItemID": "d78c7659-1c64-4089-a005-149c0972dd17",
                                    "Material_Material": "000000000000071897",
                                    "NominalWeight": "4.800",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000071897",
                                        "MaterialDescription": "PANE COLIN ALSK CAC MSC QSA 120G SYE4.8K"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "13.640",
                                    "Drop": 120,
                                    "ItemID": "fc12edc5-31b1-4ce1-ade0-eec1b0e10d25",
                                    "Material_Material": "000000000000074325",
                                    "NominalWeight": "6.000",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000074325",
                                        "MaterialDescription": "ST HACH.BOEUF CAC 15% VBF 100G X60"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },
                                {
                                    "ActualWeight": null,
                                    "Cube": "45.048",
                                    "Drop": 120,
                                    "ItemID": "a8cdf9ef-346b-4257-8553-42e1e30ca913",
                                    "Material_Material": "000000000000060181",
                                    "NominalWeight": "14.400",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 2,
                                    "ShipTo": "0000038689",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "2.000",
                                    "Uom_UnitCode": "CT",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000060181",
                                        "MaterialDescription": "TARTE POMME PRED. PASQ. 720G X 10"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },

                                {
                                    "ActualWeight": null,
                                    "Cube": "6.281",
                                    "Drop": 60,
                                    "ItemID": "7a523c15-6abf-48df-b656-cf72a6fe841b",
                                    "Material_Material": "000000000000039383",
                                    "NominalWeight": "2.500",
                                    "OpenQuantity": "0.000",
                                    "PositionInCage": 3,
                                    "ShipTo": "0000756908",
                                    "Status_ID": "COMPLETED",
                                    "TotalQuantity": "1.000",
                                    "Uom_UnitCode": "ST",
                                    "Warehouse_WarehouseNumber": "BR1",
                                    "Material": {
                                        "Material": "000000000000039383",
                                        "MaterialDescription": "BATON.CAROTTE EXP.DAUCY CE2 ST2.5KG X4"
                                    },
                                    "Status": {
                                        "Description": "Complete Full",
                                        "ID": "COMPLETED"
                                    },
                                    "Warehouse": {
                                        "WarehouseNumber": "BR1",
                                        "WhseNoDescr": "Chilled Opp. Warehouse"
                                    },
                                    "IsPalletable": true
                                },

                            ],
                            "To_Marshalling": {
                                "LastDrop": 120
                            }
                        }
                    ]
                },
                "totalCube": 488.509,
                "totalWeight": 195.88,
                "MediaType_ID": {
                    "ID": "2",
                    "MaximumWeightMulti": "600.000",
                    "MultiCubeMax": "1183.200",
                    "NoOfPosition": 9
                }
            };

            // var oData = value;
            var oData = oModel.getData().value;
            var aFlattenedData = [];
            var createPalletData = [];

            for (let cageId in oData.items) {
                let aCages = oData.items[cageId];
                aCages.forEach(cage => {
                    let cageID = cage.CageID;
                    let ID = cage.ID;
                    let aItems = cage.To_PickTaskItems || [];

                    aItems.forEach(item => {
                        aFlattenedData.push({
                            CageID: cageID,
                            Material: item.Material_Material.slice(-6),
                            TotalQuantity: parseInt(item.TotalQuantity),
                            Uom_UnitCode: item.Uom_UnitCode,
                            PositionInCage: item.PositionInCage,
                            Status: "Success"
                        });
                    });

                    aItems.forEach(item => {
                        createPalletData.push({
                            PickTaskID: ID,
                            ItemID: item.ItemID,

                        });
                    });
                });
            }

            // Create a new model for the flattened data
            var oFlatModel = new sap.ui.model.json.JSONModel({ results: aFlattenedData });
            this.getView().setModel(oFlatModel, "flattened");
            this._allData = aFlattenedData;
            this._updatePagedData();

            // create a new model for create pallet data service call.
            this.createPalletData = createPalletData;
            var ocreatePalletData = new sap.ui.model.json.JSONModel({ createPalletData });
            this.getView().setModel(ocreatePalletData, "createPalletData");
        },

        _updatePagedData: function () {
            var start = this._currentPage * this._pageSize;
            var end = start + this._pageSize;
            var visibleData = this._allData.slice(start, end);

            var oFlatModel = new sap.ui.model.json.JSONModel({ visibleResults: visibleData });
            this.getView().setModel(oFlatModel, "flattened");

            // Manage button visibility
            this.getView().byId("btnUp1").setVisible(this._currentPage > 0);
            this.getView().byId("btnDown1").setVisible(end < this._allData.length);
        },

        onShowMore: function () {
            var totalPages = Math.ceil(this._allData.length / this._pageSize);
            if (this._currentPage < totalPages - 1) {
                this._currentPage++;
                this._updatePagedData();
            }
        },

        onShowLess: function () {
            if (this._currentPage > 0) {
                this._currentPage--;
                this._updatePagedData();
            }
        },

        onPrint: async function () {
            var resultA = await this._callCreatePalletService();
            var resultB = await this._callPrintLabel(resultA);
            var oModel = new sap.ui.model.json.JSONModel({ results: resultA });
            var oModel1 = new sap.ui.model.json.JSONModel({ results: resultB });
            this.getOwnerComponent().setModel(oModel, "printLabelDetails");
            this.getOwnerComponent().setModel(oModel1, "printLabelDetails1");
            this.getOwnerComponent().getRouter().navTo("WrapPallet");
        },

        _callCreatePalletService: function () {
            return new Promise((resolve, reject) => {
                var that = this;
                var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                var lang = oLocale.language;
                var sDest1 = "/palletiseservices";
                var sUrl = this.appModulePath + sDest1 + "/Palletise/createPallet";
                var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                var lang = oLocale.language;
                var oPayload = {
                    "Tasks": this.createPalletData
                }
                $.ajax({
                    url: sUrl,
                    beforeSend: function (xhr) { xhr.setRequestHeader('Accept-Language', lang); },
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(oPayload),  // send JSON as string
                    headers: {
                        "Accept": "application/json"
                    },
                    success: function (data) {
                        resolve(data.value.pickTaskID);
                        console.log("Create pallet call result:" + data.value.pickTaskID);
                    },
                    error: function (error) {
                        reject(error);
                        console.log(error);
                    }

                });
            });
        },

        _callPrintLabel: function (resultA) {
            return new Promise((resolve, reject) => {
                var sDest1 = "/palletiseservices";
                var taskId = resultA;
                var sUrl = this.appModulePath + sDest1 + "/Pick/printLabel(" + "pickTaskID='" + taskId + "')";
                  var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                var lang = oLocale.language;
                $.ajax({
                    url: sUrl,
                    beforeSend: function (xhr) { xhr.setRequestHeader('Accept-Language', lang); },
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    success: function (data) {
                        resolve(data);
                        console.log("Print service success result:" + data);
                    },
                    error: function (error) {
                        reject(error);
                        console.log(error);
                    }
                });
            });
        },

        nextPallet: function () {
            this.getOwnerComponent().getRouter().navTo("RouteInfo");
        }
    });
});