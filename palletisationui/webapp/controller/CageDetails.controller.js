sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/GroupHeaderListItem"
], (Controller, MessageBox, GroupHeaderListItem) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.CageDetails", {
        onInit() {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("CageDetails").attachPatternMatched(this._onRouteMatched, this);
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onRouteMatched: function () {
            //this.getView().byId("table0").getItems()[0].getCells()[0].addStyleClass("greenCells");
            this._pageSize = 5;
            this._currentPage = 0;
            this._currentIndex = 0;
            this._currentPosition = 0;
            var aSelectedRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            this.getView().byId("cageTitle").setText(aSelectedRecord.Description);
            this.getView().byId("LabelRoute").setText(this.getOwnerComponent().getModel("CurrentRouteData").getData().key);
            this._createDynamicTable1();
            this._createDynamicTable2();
        },

        _createDynamicTable1: function () {

            var oModel = this.getOwnerComponent().getModel("cageDetails");
            var oData = oModel.getData();

            var fData = [];

            // Step 1: Flatten oData.value.items
            for (let cageId in oData.items) {
                let aCages = oData.items[cageId];
                let cageID = aCages.CageID;
                let aItems = aCages.To_PickTaskItems || [];

                aItems.forEach(item => {
                    if (item.IsPalletable) {
                        fData.push({
                            CageID: cageID,
                            TotalQuantity: parseInt(item.TotalQuantity),
                            OpenQuantity: parseInt(item.OpenQuantity),
                            Uom_UnitCode: item.Uom_UnitCode,
                            PositionInCage: item.PositionInCage,
                            Status: "None",
                            Drop: item.Drop,
                            IsPalletable: item.IsPalletable,
                            IsCase: item.IsCase,
                            ItemID: item.ItemID,
                            DenominatorForCase: item.DenominatorForCase,
                            NumeratorForCase: item.NumeratorForCase,
                            TotalCase: "",
                            TotalUnits: "",
                            TotalPackBoxReq: 0,
                            PackingBoxRequired: item.PackingBoxRequired,
                            Cube: parseFloat(item.Cube),
                            PackBoxType_PackBoxType: item.PackBoxType_PackBoxType,
                            PackBoxVolume: item.PackBoxVolume ? parseFloat(item.PackBoxVolume) : null
                        });
                    }
                });
            }

            this._allFlatData = fData;
            const getUniquePositions = (items) => {
                const grouped = items.reduce((acc, item) => {
                    const key = `${item.CageID}-${item.Drop}`;
                    if (!acc[key]) {
                        acc[key] = new Set();
                    }
                    acc[key].add(item.PositionInCage);
                    return acc;
                }, {});

                return Object.keys(grouped).map(key => ({
                    key,
                    uniquePositions: Array.from(grouped[key])
                }));
            }
            var uniqueDrops = getUniquePositions(this._allFlatData);

            for (var i = 0; i < this._allFlatData.length; i++) {
                var currentNewInv = this._allFlatData[i];
                for (var j = 0; j < uniqueDrops.length; j++) {
                    var currentDrop = uniqueDrops[j];
                    if ((currentNewInv.CageID + "-" + currentNewInv.Drop) === currentDrop.key) {
                        currentNewInv.concatPositionInCage = currentDrop.uniquePositions.join(", ");
                    }
                }
            }

            // Step 2: Calculate totalCasenUnits
            for (var i = 0; i < this._allFlatData.length; i++) {
                var cases = 0;
                var units = 0;
                var total = 0;

                if (this._allFlatData[i].IsCase) {
                    cases = ((this._allFlatData[i].TotalQuantity - this._allFlatData[i].OpenQuantity) * parseInt(this._allFlatData[i].DenominatorForCase)) % parseInt(this._allFlatData[i].NumeratorForCase);
                    units = Math.trunc(((this._allFlatData[i].TotalQuantity - this._allFlatData[i].OpenQuantity) * parseInt(this._allFlatData[i].DenominatorForCase)) / parseInt(this._allFlatData[i].NumeratorForCase));
                    total = cases + units;
                } else {
                    total = this._allFlatData[i].TotalQuantity - this._allFlatData[i].OpenQuantity;
                }

                this._allFlatData[i].totalCasenUnits = total;
            }

            // Step 3: Calculate TotalPackBoxReq
            for (var i = 0; i < this._allFlatData.length; i++) {
                if (this._allFlatData[i].PackBoxVolume && this._allFlatData[i].PackBoxVolume > 0) {
                    this._allFlatData[i].TotalPackBoxReq = Math.ceil(this._allFlatData[i].Cube / this._allFlatData[i].PackBoxVolume);
                } else {
                    this._allFlatData[i].TotalPackBoxReq = 0;
                }
            }

            var aFlattenedData = this._allFlatData;
            //SOM 620 - sort by drop desc
            aFlattenedData.sort((a, b) => b.Drop - a.Drop);

            var groupedData = {};

            this._allFlatData.forEach(item => {
                let key = `${item.CageID}_${item.Drop}`;
                if (!groupedData[key]) {
                    groupedData[key] = {
                        CageID: item.CageID,
                        Drop: item.Drop,
                        totalCasenUnits: 0,
                        items: []
                    };
                }
                groupedData[key].items.push(item);
                groupedData[key].totalCasenUnits += item.totalCasenUnits;
            });

            // Convert groupedData to array
            var groupedResult = Object.values(groupedData);

            const groupedMap = new Map();

            // Step 1: Group by CageID
            groupedResult.forEach(entry => {
                const cageId = entry.CageID;

                if (!groupedMap.has(cageId)) {
                    groupedMap.set(cageId, []);
                }

                groupedMap.get(cageId).push(entry);
            });

            // Step 2: Sort each Cage group by Drop (descending)
            const result = [];

            groupedMap.forEach((entries, cageId) => {
                const sortedEntries = entries.sort((a, b) => b.Drop - a.Drop);

                // Step 3: Push back into final array (same structure)
                sortedEntries.forEach(entry => {
                    result.push({
                        CageID: entry.CageID,
                        Drop: entry.Drop,
                        totalCasenUnits: entry.totalCasenUnits,
                        items: entry.items.map(item => ({
                            ...item // preserve ALL item properties
                        }))
                    });
                });
            });

            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var currentDropItems = result[i];
                for (var j = 0; j < currentDropItems.items.length; j++) {

                    if (j === 0) {
                        currentDropItems.items[0].concatPositionInCage = currentDropItems.items[0].PositionInCage;
                        currentDropItems.items[0].sumTotalPackBoxReq = currentDropItems.items[0].TotalPackBoxReq;
                    }

                    if (currentDropItems.Drop === currentDropItems.items[j].Drop && j > 0) {
                        if (!(currentDropItems.items[0].concatPositionInCage).toString().includes(currentDropItems.items[j].PositionInCage.toString())) {
                            currentDropItems.items[0].concatPositionInCage = currentDropItems.items[0].concatPositionInCage + ", " + currentDropItems.items[j].PositionInCage;
                        }
                        currentDropItems.items[0].sumTotalPackBoxReq = currentDropItems.items[0].sumTotalPackBoxReq + currentDropItems.items[j].TotalPackBoxReq;
                    }

                }
            }

            var filteredItems = [];
            for (var i = 0; i < result.length; i++) {
                result[i].items[0].FinalTotal = result[i].totalCasenUnits;
                filteredItems.push(result[i].items.slice(0, 1)[0]);
            }

            var aFlattenedData = filteredItems;
            //SOM 620 - sort by drop desc
            aFlattenedData.sort((a, b) => b.Drop - a.Drop);

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

        highlightSamePosition: function (cageID) {
            this._aPositionTexts.forEach(oText => {
                oText.removeStyleClass("duplicatePosition");
            });

            const data = this._allFlatData;
            var currentCageID = cageID;
            var filteredData = data.filter(item => item.CageID === currentCageID);

            const groupedByCage = filteredData.reduce((acc, item) => {
                const cageId = item.CageID;
                if (!acc[cageId]) acc[cageId] = [];
                acc[cageId].push(item);
                return acc;
            }, {});

            const sortedByCage = Object.fromEntries(
                Object.entries(groupedByCage).map(([cageId, items]) => [
                    cageId,
                    items.sort((a, b) => b.PositionInCage - a.PositionInCage)
                ])
            );

            const groupedByCageAndPosition = Object.fromEntries(
                Object.entries(sortedByCage).map(([cageId, items]) => {
                    const groupedByPosition = items.reduce((acc, item) => {
                        const pos = item.PositionInCage;

                        if (!acc[pos]) {
                            acc[pos] = {
                                items: [],
                                DropValue: [],
                                count: 0
                            };
                        }

                        acc[pos].items.push(item);

                        // track unique drops
                        if (!acc[pos].DropValue.includes(item.Drop)) {
                            acc[pos].DropValue.push(item.Drop);
                        }

                        acc[pos].count = acc[pos].DropValue.length;

                        return acc;
                    }, {});

                    return [cageId, groupedByPosition];
                })
            );

            const flatArray = Object.values(groupedByCageAndPosition).flatMap(cage =>
                Object.values(cage).flatMap(group =>
                    group.items.map(item => ({
                        ...item,
                        DropValue: group.DropValue,
                        count: group.count
                    }))
                )
            );

            this._aPositionTexts.forEach((oText, index) => {
                flatArray.forEach(item => {
                    if (((item.PositionInCage - 1) === index) && item.count > 1) {
                        oText.addStyleClass("duplicatePosition");
                    }
                });
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
            var cageDetailsData = this.getOwnerComponent().getModel("cageDetails").getData();
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
            //this.highlightSamePosition();
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
            var position = [];
            //currentRecord.PositionInCage;
            if (currentRecord.concatPositionInCage.toString().includes(",")) {
                position = currentRecord.concatPositionInCage.split(", ");
            } else {
                position = [currentRecord.concatPositionInCage.toString()];
            }

            for (var i = 0; i < position.toString().length; i++) {
                var oTargetText = this._aPositionTexts[parseInt(position[i]) - 1];
                if (oTargetText) {
                    oTargetText.getItems()[0].addStyleClass("greenCells");
                }
            }

            this._updatePagedData();
            this.highlightSamePosition(currentRecord.CageID);
        },

        palletiseEvt: function (payload) {
            var that = this;
            var oLocale = sap.ui.getCore().getConfiguration().getLocale();
            var lang = oLocale.language;
            var url = that.appModulePath + "/palletiseservices/CloudWM/PalletisingEvents";
            var oBundle = that.getView().getModel("i18n").getResourceBundle();
            var sText = "";
            var sErrorText = "";
            $.ajax({
                url: url,
                beforeSend: function (xhr) { xhr.setRequestHeader('Accept-Language', lang); },
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(payload),
                success: function (oData, response) {

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            }, this);

        },


        onConfirm: function () {

            //checking IsPalletable before palletising
            if (this._allData[this._currentIndex].IsPalletable) {
                //palletisation confirm
                var payload = {
                    "Event_Timestamp": null,
                    "Event_Type": "PALLETISATION_CONFIRMED",
                    "ID": "",
                    "Item_ID": "",
                    "Level": "H",
                    "PickTask_ID": this.getOwnerComponent().getModel("currentRouteCages").getData()[0].TASKID,
                    "Quantity": "" + this._allData[this._currentIndex].TotalQuantity + "",
                    "User_ID": null
                }
                this.palletiseEvt(payload);

                // Move to next record
                //var that = this;
                if (this._currentIndex < this._allData.length - 1) {
                    this._allData[this._currentIndex].Status = 'Success';
                    this._currentIndex++;
                    if ((this._currentIndex % 5) === 0) {
                        this.onShowMore();
                    }
                    this._highlightCurrent();
                } else {
                    MessageBox.information(
                        this.oBundle.getText("move_page"),
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
            } else {
                MessageBox.information(
                    this.oBundle.getText("move_page"),
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
        }
    });
});