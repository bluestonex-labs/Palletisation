sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], (Controller, JSONModel, MessageBox, MessageToast, BusyIndicator) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.Home", {

        onInit() {

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var that = this;
            var sDest = "/palletiseservices";
            var oLocale = sap.ui.getCore().getConfiguration().getLocale();
            var lang = oLocale.language;
            var sUrl = this.appModulePath + sDest + "/Pick/MarshallingBins" +
                "?$select=Description,Temperature,Status_ID" +
                "&$filter=Area_ID eq '2' and Area_Group_ID eq '2' and IsBlocked eq false and CanOpenClose eq true" +
                "&$expand=Status";
            $.ajax({
                url: sUrl,
                beforeSend: function (xhr) { xhr.setRequestHeader('Accept-Language', lang); },
                method: "GET",
                headers: {
                    "Accept": "application/json"
                },
                success: function (data) {
                    that._aAllStations = data.value.sort((a, b) => {
						return parseInt(a.ID.slice(1), 10) - parseInt(b.ID.slice(1), 10);
					});
                    that._pageSize = 3;
                    that._currentIndex = 0; // start at page 0
                    that._loadStations();
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error:", textStatus, errorThrown);
                }
            });

        },

        onAfterRendering: function () {
            var printerModel = new sap.ui.model.json.JSONModel({
                macAddress: "",
                deviceId: ""
            });
            sap.ui.getCore().setModel(printerModel, 'printerModel');
            this.onCheckForPrinter();
            //sap.ui.getCore().getModel('printerModel').setProperty("/macAddress", "48:a4:93:aa:a0:fc");
        },

        onCheckForPrinter: function () {
            if (top.device) {
                var deviceId = top.device.uuid;
                this.deviceId = deviceId;

                //sap.ui.getCore().getModel('printerModel').setProperty("/deviceId", deviceId);

                var that = this;

                var sUrl = this.appModulePath + "/bsxprinterservices" + "/SyscoFrancePrinters/Printers";
                $.ajax({
                    url: sUrl,
                    type: "GET",
                    async: false,
                    //contentType: "application/json",
                    data: {
                        $format: 'json'
                    },
                    success: function (oData, response) {
                        var devices = oData.value;
                        var exists;
                        var i = devices.findIndex(e => e.DeviceID === deviceId);
                        if (i > -1) {
                            //that.connectedPrinter = devices[i].PrinterID;

                            sap.ui.getCore().getModel('printerModel').setProperty("/macAddress", devices[i].PrinterID);
                            //exists = true;
                        } else {
                            // Access i18n properties
                            var oBundle = that.getView().getModel("i18n").getResourceBundle();
                            var sText_PNotConn = oBundle.getText("msgBox_eonCheckPrinter");
                            MessageBox.error(sText_PNotConn);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        BusyIndicator.hide();

                    }
                }, this);
            }
        },

        _loadStations: function () {
            var oVBox = this.byId("stationButtonsBox");
            oVBox.removeAllItems();

            var start = this._currentIndex * this._pageSize;
            var end = start + this._pageSize;
            var aBatch = this._aAllStations.slice(start, end);

            aBatch.forEach(function (station) {

                var sIcon = (station.Temperature === "Frozen") ? "sap-icon://add" : "sap-icon://e-care";
                var oButton = new sap.m.Button({
                    text: station.Description,
                    icon: sIcon,
                    iconFirst: false,
                    customData: [
                        new sap.ui.core.CustomData({
                            key: "StationId",
                            value: station.ID
                        })
                    ],
                    press: this.onStationPress.bind(this)
                }).addStyleClass("blackButton largeWidth roundCorner");

                oVBox.addItem(oButton);
            }.bind(this));

            // Control navigation button visibility
            this.byId("prevBtn").setVisible(this._currentIndex > 0);
            this.byId("nextBtn").setVisible(end < this._aAllStations.length);
        },

        onNextPage: function () {
            this._currentIndex++;
            this._loadStations();
        },

        onPrevPage: function () {
            this._currentIndex--;
            this._loadStations();
        },



        onStationPress: function (oEvent) {
            var that = this;
            var oButton = oEvent.getSource();
            var sId = oButton.data("StationId");
            var sText = oButton.getText();

            var oRecord = that._aAllStations.find(function (item) {
                return item.ID === sId;
            });

            var recordModel = new JSONModel(oRecord);
            this.getOwnerComponent().setModel(recordModel, "selectedRecord");
            this.getOwnerComponent().getRouter().navTo("StationList");
            // sap.m.MessageToast.show("Pressed: " + sText + " (ID: " + sId + ")");
        },


        goToStationList: function (oEvent) {
            var selectedItemText = oEvent.getSource().getText();
            if (selectedItemText === "Station 1") {
                this.getOwnerComponent().getModel("dataModel").getData()[0].B1 = true;
            } else if (selectedItemText === "Station 2") {
                this.getOwnerComponent().getModel("dataModel").getData()[0].B2 = true;
            } else if (selectedItemText === "Station 3") {
                this.getOwnerComponent().getModel("dataModel").getData()[0].B3 = true;
            } else if (selectedItemText === "Station 4") {
                this.getOwnerComponent().getModel("dataModel").getData()[0].B4 = true;
            }

        }
    });
});