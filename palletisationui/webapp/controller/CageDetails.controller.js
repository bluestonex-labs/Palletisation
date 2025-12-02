sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.CageDetails", {
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("CageDetails").attachPatternMatched(this._onRouteMatched, this);
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onRouteMatched: function () {
            //this.getView().byId("table0").getItems()[0].getCells()[0].addStyleClass("greenCells");
            this._pageSize = 5;
            this._currentPage = 0;
            this._currentIndex = 0;
             var aSelectedRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            this.getView().byId("cageTitle").setText(aSelectedRecord.Description);
            this.getView().byId("LabelRoute").setText(this.getOwnerComponent().getModel("CurrentRouteData").getData().key);
            this._createDynamicTable1();
            this._createDynamicTable2();
        },

        _createDynamicTable1: function () {
            // Suppose you already have your data model set
            var oModel = this.getOwnerComponent().getModel("cageDetails");

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
                    let aItems = cage.To_PickTaskItems || [];

                    aItems.forEach(item => {
                        aFlattenedData.push({
                            CageID: cageID,
                            Material: item.Material_Material.slice(-6),
                            TotalQuantity: parseInt(item.TotalQuantity),
                            Uom_UnitCode: item.Uom_UnitCode,
                            PositionInCage: item.PositionInCage,
                            Status: "None",
                            Drop:item.Drop
                        });
                    });


                });
            }

            // Create a new model for the flattened data
            var oFlatModel = new sap.ui.model.json.JSONModel({ results: aFlattenedData });
            this.getView().setModel(oFlatModel, "flattened");
            this._allData = aFlattenedData;
            this._updatePagedData();


        },

        _updatePagedData: function () {
            var start = this._currentPage * this._pageSize;
            var end = start + this._pageSize;
            var visibleData = this._allData.slice(start, end);

            var oFlatModel = new sap.ui.model.json.JSONModel({ visibleResults: visibleData });
            this.getView().setModel(oFlatModel, "flattened");

            // Manage button visibility
            this.getView().byId("btnUp").setVisible(this._currentPage > 0);
            this.getView().byId("btnDown").setVisible(end < this._allData.length);
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

        _createDynamicTable2: function () {
            var oTable = this.byId("table0");

            //var cageDetailsData = value;
            var cageDetailsData = this.getOwnerComponent().getModel("cageDetails").getData().value;
            var noOfPositions = cageDetailsData.MediaType_ID.NoOfPosition; // e.g. 9
            //noOfPositions = 15; // e.g. 9
            // Clear any existing content
            oTable.removeAllColumns();
            oTable.removeAllItems();

            // Define how many columns per row you want
            if (noOfPositions <= 9) {
                var columnsPerRow = 3;
            }
            else {
                var columnsPerRow = 4;
            }

            var totalRows = Math.ceil(noOfPositions / columnsPerRow);

            // Create Columns
            for (var i = 0; i < columnsPerRow; i++) {
                oTable.addColumn(new sap.m.Column({}));
            }

            // Generate Data (e.g., [1,2,3,...,noOfPositions])
            var aPositions = Array.from({ length: noOfPositions }, (_, i) => i + 1);
            this._aPositionTexts = [];
            // Create Rows
            for (var r = 0; r < totalRows; r++) {
                var oRow = new sap.m.ColumnListItem({ vAlign: "Middle" });

                for (var c = 0; c < columnsPerRow; c++) {
                    var index = r * columnsPerRow + c;
                    var sText = aPositions[index] ? aPositions[index].toString() : "";
                    var oText = new sap.m.Text({ text: sText });
                    this._aPositionTexts.push(oText);
                    oRow.addCell(oText);
                }

                oTable.addItem(oRow);
            }
            this._highlightCurrent();
        },
        _highlightCurrent: function () {
            // Remove all highlights
            this._aPositionTexts.forEach(oText => {
                oText.removeStyleClass("greenCells");
            });

            // Get current record
            var currentRecord = this._allData[this._currentIndex];
            var sText = this.oBundle.getText("cageIdText", [currentRecord.CageID]);
            this.getView().byId("cageIdOnBox").setText(sText);
            this.getView().byId("dropValue").setText(this.oBundle.getText("dropIdText", [currentRecord.Drop]));

            //this.getView().byId("cageIdOnBox").setText(`Cage ID: ${currentRecord.CageID}`);
            if (!currentRecord) return;
            //currentRecord.Status = 'Success';
            var position = currentRecord.PositionInCage;
            var oTargetText = this._aPositionTexts[position - 1];
            if (oTargetText) {
                oTargetText.addStyleClass("greenCells");
            }
            this._updatePagedData();
        },

        onConfirm: function () {
            // Move to next record
            var that = this;
            if (this._currentIndex < this._allData.length - 1) {
                this._allData[this._currentIndex].Status = 'Success';
                this._currentIndex++;
                this._highlightCurrent();
            } else {
                sap.m.MessageBox.information(
                    that.oBundle.getText("move_page"),
                    {
                        actions: [sap.m.MessageBox.Action.OK],
                        onClose: function (sAction) {
                            if (sAction === sap.m.MessageBox.Action.OK) {
                                this.getOwnerComponent().getRouter().navTo("LabelPrint");
                            }
                        }.bind(this)
                    }
                );

            }
        },

        onAfterRendering: function () {
        },

        // onConfirm: function () {
        //     this.getOwnerComponent().getRouter().navTo("LabelPrint");
        // }
    });
});