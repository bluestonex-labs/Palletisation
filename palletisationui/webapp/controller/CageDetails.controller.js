sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
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

            /*var data = {
                "@odata.context": "$metadata#Edm.String",
                "value": {
                    "items": {
                        "027": [
                            {
                                "CageID": "027",
                                "DeliveryDate": "2025-11-27",
                                "ID": "PICK_730",
                                "IsShort": false,
                                "MHEType_ID": null,
                                "MediaPlacement": 1,
                                "MediaType_ID": "2",
                                "Media_ID": "CA",
                                "NoOfPackingBoxRequired": 2,
                                "NominalWeight": "180.198",
                                "PalletID": null,
                                "PickJob": "E2E943009545D4AA1900297AB0C7639F",
                                "PickType_ID": "MT",
                                "PickerUserID": "FRSERPETAS",
                                "Plant_Plant": "BR10",
                                "Route": "T44127",
                                "Sequence": 3,
                                "Status_ID": "INPROGRESS",
                                "Temperature_ID": "Frozen",
                                "TotalCube": "492.369",
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
                                    "Description": "BRUGUIERES",
                                    "Plant": "BR10"
                                },
                                "Status": {
                                    "Description": "In Progress",
                                    "ID": "INPROGRESS"
                                },
                                "Temperature": {
                                    "Description": "Frozen",
                                    "ID": "Frozen"
                                },
                                "To_PickTaskItems": [
                                    {
                                        "ActualWeight": null,
                                        "Cube": "26.007",
                                        "Drop": 120,
                                        "ItemID": "6f57f0ae-a921-49b6-a272-6f8a434970f7",
                                        "Material_Material": "000000000000035558",
                                        "NominalWeight": "9.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 1,
                                        "ShipTo": "0000788657",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "3.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000035558",
                                            "MaterialDescription": "FLT ROUGET BARB.QSA 20/40G CT3KG"
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
                                        "Cube": "45.264",
                                        "Drop": 120,
                                        "ItemID": "20d88511-092b-494c-a4bb-3be856ebbe50",
                                        "Material_Material": "000000000000073200",
                                        "NominalWeight": "20.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 2,
                                        "ShipTo": "0000788657",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "4.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000073200",
                                            "MaterialDescription": "AIGUIL.PLT PANEE CORN-FL.HALAL ST1KG X5"
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
                                        "Cube": "14.756",
                                        "Drop": 120,
                                        "ItemID": "2b363893-1d0c-4e78-af8d-10524ea5f8e2",
                                        "Material_Material": "000000000000076756",
                                        "NominalWeight": "5.118",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 2,
                                        "ShipTo": "0000788657",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "2.000",
                                        "Uom_UnitCode": "BC",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000076756",
                                            "MaterialDescription": "C/G CHOCOLAT NESTLE BC2.56KG-5L"
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
                                        "Cube": "10.097",
                                        "Drop": 90,
                                        "ItemID": "d94edb1a-0f0c-4bf3-8edd-79f04dcea182",
                                        "Material_Material": "000000000000077471",
                                        "NominalWeight": "4.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 2,
                                        "ShipTo": "0000760740",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "1.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000077471",
                                            "MaterialDescription": "GRATINE SAVOYARDE 130G ENV.SYC CT4KG"
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
                                        "Cube": "18.050",
                                        "Drop": 90,
                                        "ItemID": "8265b4b6-44bc-4c6f-a4af-a8c5cc196d3d",
                                        "Material_Material": "000000000000076109",
                                        "NominalWeight": "10.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 2,
                                        "ShipTo": "0000760740",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "1.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000076109",
                                            "MaterialDescription": "CAROTTE PARISIENNE SYC ST2.5KG X4"
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
                                        "Cube": "11.520",
                                        "Drop": 60,
                                        "ItemID": "2416a97c-48a5-4fc4-b3ed-30972030c2f5",
                                        "Material_Material": "000000000000074916",
                                        "NominalWeight": "6.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 3,
                                        "ShipTo": "0000419871",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "6.000",
                                        "Uom_UnitCode": "ST",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000074916",
                                            "MaterialDescription": "PUREE AVOCAT IQF ST1KG X10"
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
                                        "Cube": "33.572",
                                        "Drop": 60,
                                        "ItemID": "74dc2f76-6e7c-4d71-80c5-823fbcde7165",
                                        "Material_Material": "000000000000071593",
                                        "NominalWeight": "10.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 3,
                                        "ShipTo": "0000419871",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "2.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000071593",
                                            "MaterialDescription": "HAR.V XFIN BKE CE2 ST2.5KG X2"
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
                                        "Cube": "33.572",
                                        "Drop": 60,
                                        "ItemID": "37ee7484-0f7f-4952-9c9c-19bdd054b483",
                                        "Material_Material": "000000000000071593",
                                        "NominalWeight": "10.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 4,
                                        "ShipTo": "0000419871",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "2.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000071593",
                                            "MaterialDescription": "HAR.V XFIN BKE CE2 ST2.5KG X2"
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
                                        "Cube": "4.256",
                                        "Drop": 60,
                                        "ItemID": "a9363c45-380c-4335-a7a8-9f329568a89e",
                                        "Material_Material": "000000000000035302",
                                        "NominalWeight": "2.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 3,
                                        "ShipTo": "0000419871",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "1.000",
                                        "Uom_UnitCode": "BT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000035302",
                                            "MaterialDescription": "CREVETTE SAUV ENT.CRUE C/T 10-20 BT2KGX6"
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
                                        "Cube": "25.536",
                                        "Drop": 60,
                                        "ItemID": "dfb0c291-0168-4976-8c83-b6a000bcaace",
                                        "Material_Material": "000000000000035302",
                                        "NominalWeight": "12.000",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 4,
                                        "ShipTo": "0000419871",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "6.000",
                                        "Uom_UnitCode": "BT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000035302",
                                            "MaterialDescription": "CREVETTE SAUV ENT.CRUE C/T 10-20 BT2KGX6"
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
                                        "Cube": "33.208",
                                        "Drop": 30,
                                        "ItemID": "77f78419-d686-4c9c-8836-0b7511194392",
                                        "Material_Material": "000000000000075157",
                                        "NominalWeight": "5.040",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 5,
                                        "ShipTo": "0005165567",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "7.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000075157",
                                            "MaterialDescription": "MINI BABA RHUM 15G ENV.BKE X48"
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
                                        "Cube": "65.080",
                                        "Drop": 30,
                                        "ItemID": "0342009b-33b2-4c5b-8a89-585156c629bf",
                                        "Material_Material": "000000000000077791",
                                        "NominalWeight": "14.400",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 5,
                                        "ShipTo": "0005165567",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "8.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000077791",
                                            "MaterialDescription": "FONDANT CHOC. SYC 90GX20 stockage -18°C"
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
                                        "Cube": "9.662",
                                        "Drop": 30,
                                        "ItemID": "920d44ff-166d-40d1-8c56-147296434497",
                                        "Material_Material": "000000000000076568",
                                        "NominalWeight": "1.320",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 5,
                                        "ShipTo": "0005165567",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "2.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000076568",
                                            "MaterialDescription": "CITRON GIVRE 110G-165ML NESTLE CT6PC"
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
                                        "Cube": "9.662",
                                        "Drop": 30,
                                        "ItemID": "937fd23d-7cba-4ed5-92ba-6c42fed1f73c",
                                        "Material_Material": "000000000000076568",
                                        "NominalWeight": "1.320",
                                        "OpenQuantity": "0.000",
                                        "PositionInCage": 6,
                                        "ShipTo": "0005165567",
                                        "Status_ID": "COMPLETED",
                                        "TotalQuantity": "2.000",
                                        "Uom_UnitCode": "CT",
                                        "Warehouse_WarehouseNumber": "BR1",
                                        "Material": {
                                            "Material": "000000000000076568",
                                            "MaterialDescription": "CITRON GIVRE 110G-165ML NESTLE CT6PC"
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
                                    }
                                ],
                                "To_Marshalling": {
                                    "LastDrop": 120
                                }
                            }
                        ]
                    },
                    "totalCube": 340.24199999999996,
                    "totalWeight": 110.198,
                    "MediaType_ID": {
                        "ID": "2",
                        "MaximumWeightMulti": "600.000",
                        "MultiCubeMax": "1183.200",
                        "NoOfPosition": 9
                    }
                }
            };*/

            //this.getOwnerComponent().getModel("cageDetails").setData(data);
            var oModel = this.getOwnerComponent().getModel("cageDetails");

            var oData = //oModel.getData();
                oModel.getData().value;
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
                            Drop: item.Drop,
                            IsPalletable: item.IsPalletable
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

        highlightSamePosition: function () {
            this._aPositionTexts.forEach((oText, index) => {
                const groupedByDrop = Map.groupBy(this._allData, cage => cage.PositionInCage);
                const selectedGroupedMap = new Map();
                for (const [PositionInCage, items] of groupedByDrop.entries()) {
                    selectedGroupedMap.set(PositionInCage, items.map(item => item.Drop));
                }

                let uniqueValues = new Set();
                for (let [key, value] of selectedGroupedMap.entries()) {
                    // console.log(`Key: ${key}, Value: ${value}`);
                    uniqueValues.add(value);
                }

                var positionCountByDrops = Array.from(new Map(
                    Array.from(uniqueValues.entries(), ([key, valueArray]) => {
                        return [key, new Set(valueArray).size];
                    })
                ).entries());

                var newSet = {};
                var newArray = [];

                positionCountByDrops.forEach((item, index) => {
                    newSet = {
                        "Index": index,
                        "Count": item[1]
                    };
                    newArray.push(newSet);
                });

                if (newArray[parseInt(index)] !== undefined) {
                    if (index === newArray[parseInt(index)].Index && newArray[parseInt(index)].Count > 1) {
                        oText.addStyleClass("duplicatePosition");
                    }
                }
                
            });

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
                oTable.addColumn(new sap.m.Column({ hAlign: sap.ui.core.TextAlign.Center }));
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
                    var oHBox = new sap.m.HBox();
                    var oText = new sap.m.Text({ text: sText });
                    oHBox.addItem(oText);
                    this._aPositionTexts.push(oHBox);
                    oRow.addCell(oHBox);
                }
                oTable.addItem(oRow);
            }
            this._highlightCurrent();
            this.highlightSamePosition();
        },

        _highlightCurrent: function () {
            // Remove all highlights
            this._aPositionTexts.forEach(oText => {
                oText.getItems()[0].removeStyleClass("greenCells");
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
                oTargetText.getItems()[0].addStyleClass("greenCells");
            }
            this._updatePagedData();
        },

        onConfirm: function () {
            // Move to next record
            var that = this;
            if (this._currentIndex < this._allData.length - 1) {
                this._allData[this._currentIndex].Status = 'Success';
                this._currentIndex++;
                if ((this._currentIndex % 5) === 0) {
                    this.onShowMore();
                }
                this._highlightCurrent();
            } else {
                MessageBox.information(
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

        checkSamePosition: function (sValue) {
            var aItems = this._allData;
            var count = 0;
            aItems.forEach(function (item) {
                if (parseInt(item.PositionInCage) === parseInt(sValue)) {
                    count++;
                }
            });
            return count;
        },

        checkSamePositionWithDifferentDrop: function (sValue) {
            var aItems = this._allData;
            var count = 0;
            aItems.forEach(function (item) {
                if (parseInt(item.Drop) !== parseInt(sValue)) {
                    count++;
                }
            });
            return count;
        }
    });
});