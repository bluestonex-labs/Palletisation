sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ndc/BarcodeScanner",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageBox, BarcodeScanner, MessageToast) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.RouteInfo", {

        onInit() {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteInfo").attachPatternMatched(this._onRouteMatched, this);
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.count = 0;
            this.checkKeys = [];
        },

        _onRouteMatched: function () {
            this.getView().byId("btnSkip").setVisible(true);
            var aSelectedRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            this.getView().byId("titleRoute").setText(aSelectedRecord.Description);
            this.getTaskId();
            this.getView().byId("inCageID").setValueState("None");
        },

        getTaskId: function () {
            var that = this;
            var sDest = "/palletiseservices";
            var oRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            var sUrl = this.appModulePath + sDest + "/Palletise/requestJob(" +
                "ID='" + oRecord.ID + "'," +
                "Area_ID='" + oRecord.Area_ID + "'," +
                "Area_Group_ID='" + oRecord.Area_Group_ID + "')";
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
                    // data.value = {
                    //     "T43203": [
                    //         {
                    //             "TASKID": "PICK_52930",
                    //             "CAGEID": "1234",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         },
                    //         {
                    //             "TASKID": "PICK_52931",
                    //             "CAGEID": "1235",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         }, {
                    //             "TASKID": "PICK_52930",
                    //             "CAGEID": "1236",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         },
                    //         {
                    //             "TASKID": "PICK_52931",
                    //             "CAGEID": "1237",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         }, {
                    //             "TASKID": "PICK_52930",
                    //             "CAGEID": "1238",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         },
                    //         {
                    //             "TASKID": "PICK_52931",
                    //             "CAGEID": "1239",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43203"
                    //         }
                    //     ],
                    //     "T43204": [
                    //         {
                    //             "TASKID": "PICK_52930",
                    //             "CAGEID": "3205",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43204"
                    //         },
                    //         {
                    //             "TASKID": "PICK_52931",
                    //             "CAGEID": "3206",
                    //             "TEMPERATURE_ID": "Frozen",
                    //             "TDESCRIPTION": "Frozen",
                    //             "ROUTE": "T43204"
                    //         }
                    //     ]
                    // }
                    that.loadRouteAndCage(data);
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error:", textStatus, errorThrown);
                }
            });
        },

        loadRouteAndCage: function (data) {

            this._allRoutes = Object.keys(data.value);
            this._routeData = data.value;
            this._currentRouteIndex = 0;

            this.loadRouteByIndex(this._currentRouteIndex);
            this.count = 0;
        },

        loadRouteByIndex: function (iIndex) {
            var that = this;
            var sKey = this._allRoutes[iIndex];
            var aData = this._routeData && this._routeData[sKey] ? this._routeData[sKey] : [];
            var currentRouteCages = new JSONModel(aData);
            this.getOwnerComponent().setModel(currentRouteCages, "currentRouteCages");
            this.getView().byId("inCageID").setValue("");
            this.getView().byId("palletizeBtn").setEnabled(false);

            var oData = {
                key: sKey,
                items: aData.map(function (item) {
                    item.STATUS = item.STATUS || "None";
                    return item;
                })
            };
            if (this.getOwnerComponent().getModel("CurrentRouteData")) {
                this.checkKeys.map(function (item) {
                    if (sKey == item) {
                        oData = {
                            key: sKey,
                            items: aData.map(function (item) {
                                item.STATUS = 'Success';
                                return item;
                            })
                        };
                        that.getView().byId("palletizeBtn").setEnabled(true);
                    }
                })
            }

            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel, "routeData");

            // Reset your view-specific values

            that._aAllStations = oData.items;
            that._pageSize = 2;
            that._currentIndex = 0; // start at page 0      
            var start = this._currentIndex * this._pageSize;
            that.end = start + this._pageSize;
            this.updatePagedData();
            // Control navigation button visibility
            this.onBtnHandle();
        },

        onSkipPress: function () {
            var that = this;

            if (this._currentRouteIndex < this._allRoutes.length - 1) {
                this._currentRouteIndex++;
                this.loadRouteByIndex(this._currentRouteIndex);
                this.getView().byId("inCageID").setValueState("None");
                that.count = 0;
            } else {
                MessageBox.show(that.oBundle.getText("no_routes"));
            }
        },

        palletiseEvt: function (payload) {
            var that = this;
            var oLocale = sap.ui.getCore().getConfiguration().getLocale();
            var lang = oLocale.language;
            var url = this.appModulePath + "/palletiseservices/CloudWM/PalletisingEvents";
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

        onCageIDInput1: function (oEvent) {
            var that = this;
            var cageID = oEvent.getSource().getValue();

            that._aAllStations.forEach(function (item) {
                if (item.CAGEID == cageID && item.STATUS == "None") {
                    item.STATUS = "Success";
                    that.count++;
                }
            })

            var val = that._aAllStations.filter(function (item) {
                if (item.CAGEID == cageID) {
                    return item;
                }
            });
            this.getView().byId("inCageID").setValueState("None");

            if (val.length != 0) {
                var payload = {
                    "Event_Timestamp": null,
                    "Event_Type": "CAGEID_ENTERED",
                    "ID": "",
                    "Item_ID": "",
                    "Level": "H",
                    "PickTask_ID": val[0].TASKID,
                    "Quantity": "0",
                    "User_ID": null
                }
                this.palletiseEvt(payload);
            }
            if (val.length == 0 && cageID != "") {
                MessageBox.error(that.oBundle.getText("enter_correct_cage"));
                this.getView().byId("inCageID").setValueState("Error");
                return;
            } else {
                this.getView().byId("inCageID").setValue();
            }

            if (that._aAllStations.length == that.count) {
                this.getView().byId("palletizeBtn").setEnabled(true);
            }

            that.updatePagedData();

        },

        onCageIDInput: function (oEvent) {
            var that = this;
            var cageID = oEvent.getSource().getValue().trim();

            if (!cageID) {
                return;
            }

            var val = that._aAllStations.filter(function (item) {
                return item.CAGEID == cageID;
            });

            this.getView().byId("inCageID").setValueState("None");

            // Cage not found
            if (val.length === 0) {
                MessageBox.error(that.oBundle.getText("enter_correct_cage"));
                this.getView().byId("inCageID").setValueState("Error");
                return;
            }

            var oCage = val[0];

            // Cage exists but NOT ready
            if (oCage.ISREADY !== "TRUE") {
                MessageBox.error("This cage is not ready for palletization.");
                this.getView().byId("inCageID").setValueState("Error");
                // this.getView().byId("inCageID").setValue("");
                return;
            }

            // Cage is READY → mark as scanned
            if (oCage.STATUS === "None") {
                oCage.STATUS = "Success";
                that.count++;
            }

            // Send event
            var payload = {
                "Event_Timestamp": null,
                "Event_Type": "CAGEID_ENTERED",
                "ID": "",
                "Item_ID": "",
                "Level": "H",
                "PickTask_ID": oCage.TASKID,
                "Quantity": "0",
                "User_ID": null
            };

            this.palletiseEvt(payload);

            this.getView().byId("inCageID").setValue("");

            // Enable palletize if at least one cage is Success and TRUE
            //var bEnable = that._aAllStations.some(function (item) {
            //    return item.STATUS === "Success" && item.ISREADY === "TRUE";
            //});

            if (that._aAllStations.length == that.count) {
                this.getView().byId("palletizeBtn").setEnabled(true);
            }

            //this.getView().byId("palletizeBtn").setEnabled(bEnable);

            that.updatePagedData();
        },

        updatePagedData: function () {
            var start = this._currentIndex * this._pageSize;
            var end = start + this._pageSize;
            var pagedItems = this._aAllStations.slice(start, end);

            var oPagedModel = new sap.ui.model.json.JSONModel({
                key: this.getView().getModel("routeData").getData().key,
                items: pagedItems
            });
            this.getView().setModel(oPagedModel, "routeData");

            this.onBtnHandle();
        },
        onBtnHandle: function () {
            var totalPages = Math.ceil(this._aAllStations.length / this._pageSize);
            this.byId("prevBtn1").setVisible(this._currentIndex > 0);
            this.byId("nextBtn1").setVisible(this._currentIndex < totalPages - 1);
        },

        onNextPage: function () {
            var totalPages = Math.ceil(this._aAllStations.length / this._pageSize);
            if (this._currentIndex < totalPages - 1) {
                this._currentIndex++;
                this.updatePagedData();
            }
        },

        onPrevPage: function () {
            if (this._currentIndex > 0) {
                this._currentIndex--;
                this.updatePagedData();
            }
        },

        onPalletise: async function () {
            // var res = await this.getCageDetails();
            // var oModel = new sap.ui.model.json.JSONModel(res);
            // this.getOwnerComponent().setModel(oModel, "cageDetails");
            // this.checkKeys.push(this.getView().getModel("routeData").getData().key);
            // var CurrentRouteData = new sap.ui.model.json.JSONModel(this.getView().getModel("routeData").getData());
            // this.getOwnerComponent().setModel(CurrentRouteData, "CurrentRouteData");
            // this.getOwnerComponent().getRouter().navTo("CageDetails");

            var res = await this.getCageDetails();
            var routeData = this.getView().getModel("routeData").getData();

            // Safety checks
            const allStations = this._aAllStations || [];
            const responseItems = res?.value?.items || {};

            // Create a Set of valid cage IDs (fast lookup)
            const validCageIDs = new Set(
                allStations
                    .filter(item => item.ISREADY === "TRUE" && item.STATUS === "Success")
                    .map(item => item.CAGEID)
            );

            // Filter res.value.items based on valid cage IDs
            const filteredItems = Object.fromEntries(
                Object.entries(responseItems)
                    .filter(([cageID]) => validCageIDs.has(cageID))
            );

            // Proceed only if we have valid cages
            if (Object.keys(filteredItems).length > 0) {

                const filteredResponse = {
                    ...res.value,
                    items: filteredItems
                };

                this.getOwnerComponent().setModel(
                    new sap.ui.model.json.JSONModel(filteredResponse),
                    "cageDetails"
                );

                // Set CurrentRouteData
                this.getOwnerComponent().setModel(
                    new sap.ui.model.json.JSONModel(routeData),
                    "CurrentRouteData"
                );

                this.getOwnerComponent().getRouter().navTo("CageDetails");

            } else {
                sap.m.MessageBox.error("No ready and successful cages found.");
            }
        },

        getCageDetails: async function () {
            return new Promise((resolve, reject) => {
                var that = this;
                var sDest = "/palletiseservices";
                var sUrl = this.appModulePath + sDest + "/Palletise/getCagesDetailToPalletise";
                var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                var lang = oLocale.language;
                var taskIDs = [];
                for (var i = 0; i < this.getOwnerComponent().getModel("currentRouteCages").getData().length; i++) {
                    taskIDs.push(this.getOwnerComponent().getModel("currentRouteCages").getData()[i].TASKID)
                }
                var oPayload = {
                    "TaskIDs": taskIDs
                };

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
                        resolve(data);
                        //palletisation start
                        var taskIds = [];
                        var sCagesData = that.getOwnerComponent().getModel("currentRouteCages").getData();
                        sCagesData.forEach(function (item) {
                            var payload = {
                                "Event_Timestamp": null,
                                "Event_Type": "PALLETISATION_START",
                                "ID": "",
                                "Item_ID": "",
                                "Level": "H",
                                "PickTask_ID": item.TASKID,
                                "Quantity": "0",
                                "User_ID": null
                            }
                            that.palletiseEvt(payload);
                        });
                    },
                    error: function (error) {
                        reject(error);

                    }
                });
            });
        },


        //Barcode Scanner Code 

        onScanPressed: function () {
            // For manual trigger (optional)
            BarcodeScanner.scan(
                function (mResult) {  // success callback
                    this.byId("inBarcode").setValue(mResult.text);
                    MessageBox.show("Scanned: " + mResult.text);
                }.bind(this),
                function (Error) {    // error callback
                    MessageBox.show("Scan failed: " + Error);
                },
                function (mParams) {  // live update (optional)
                    console.log("Live update:", mParams);
                }
            );
        },

        onScanSuccess: function (oEvent) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sText = oBundle.getText("scanCancelled");

            if (oEvent.getParameter("cancelled")) {
                MessageToast.show(sText, { duration: 1000 });
            } else {
                if (oEvent.getParameter("text")) {
                    var oInpCageFld = this.getView().byId("inCageID");
                    oInpCageFld.setValue(oEvent.getParameter("text"));
                    oInpCageFld.fireSubmit();
                }
            }
        },

        onScanFail: function (oEvent) {
            MessageBox.show("Scan failed: " + oEvent.getParameter("message"));
        },

        onScanLiveUpdate: function (oEvent) {
            console.log("Live scan update:", oEvent.getParameter("newValue"));
        }


    });
});