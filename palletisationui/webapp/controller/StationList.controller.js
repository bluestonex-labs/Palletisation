sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.StationList", {

        onInit() {

            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("StationList").attachPatternMatched(this._onRouteMatched, this);
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            // this.selectedRecordLoad();
        },



        _onRouteMatched: function () {

            var that = this;
            
            this.plantServiceData();
            this.selectedRecordLoad();
            

        },

        selectedRecordLoad: function () {
            var oVBox = this.byId("stationListButtonsBox");
            oVBox.removeAllItems();
            this.getView().byId("hbStationList").setVisible(true);
            var that = this;
            var aSelectedRecord = that.getOwnerComponent().getModel("selectedRecord").getData();
            if (aSelectedRecord.Status_ID === "CLOSE") {
                this.getView().byId("btnClose").setEnabled(false);
                this.getView().byId("btnOpen").setEnabled(true);
            }
            else {
                this.getView().byId("btnClose").setEnabled(true);
                this.getView().byId("btnOpen").setEnabled(false);
            }

            var aRecords = Array.isArray(aSelectedRecord) ? aSelectedRecord : [aSelectedRecord];
            // var aBatch = this._aAllStations.slice(start, end);

            aRecords.forEach(function (station) {

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
                    press: that.onStationListPress.bind(that)
                }).addStyleClass("blackButton largeWidth roundCorner");

                oVBox.addItem(oButton);

            })
        },


        plantServiceData: function () {
            var sDest = "/palletiseservices";
            var that = this;
            var sUrl = this.appModulePath + sDest + "/CloudWM/getPlantListForUser()";
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
                    console.log(data);
                    var res = data.value.filter((val) => {
                        return val.DefaultPlant === true;
                    });
                    that.plant = res[0].Plant;
                },
                error: function (textStatus, errorThrown) {
                    console.log("Error:", textStatus, errorThrown);
                }
            });
        },
        sendOpenCloseData: function (oEvent) {
            var aSelectedRecord = this.getOwnerComponent().getModel("selectedRecord").getData();
            var btnStatusId = oEvent.getParameters().id.split("--")[oEvent.getParameters().id.split("--").length - 1];
            var StatusIdBtn = (btnStatusId === "btnClose") ? "CLOSE" : "OPEN";
            var that = this;
            var sDest = "/palletiseservices";
            var sUrl = this.appModulePath + sDest + "/Pick/openORClosePalletStation";
            var oLocale = sap.ui.getCore().getConfiguration().getLocale();
            var lang = oLocale.language;

            var oPayload = {
                "binIDs": [aSelectedRecord.ID],
                "statusID": StatusIdBtn,   // use "OPEN" to open
                "plant": this.plant
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
                    sap.m.MessageBox.success(that.oBundle.getText("stn_cng"));
                    that.getOwnerComponent().getModel("selectedRecord").getData().Status_ID = StatusIdBtn
                    if (StatusIdBtn === "CLOSE") {
                        that.getView().byId("btnClose").setEnabled(false);
                        that.getView().byId("btnOpen").setEnabled(true);
                    }
                    else {
                        that.getView().byId("btnClose").setEnabled(true);
                        that.getView().byId("btnOpen").setEnabled(false);
                    }


                },
                error: function (textStatus, errorThrown) {
                    console.log("Error:", textStatus, errorThrown);
                }
            });

        },

        onStationListPress: function () {
            var that = this;
            if (this.getView().byId("btnClose").mProperties.enabled == false) {
                sap.m.MessageBox.error(that.oBundle.getText("opn_stn"));
                return;
            }
            this.getOwnerComponent().getRouter().navTo("RouteInfo");
        },
        gotoRequestScreen: function () {
            this.getView().byId("hbStationList").setVisible(false);
            //this.getView().byId("hbReqJob").setVisible(true);
        },

        onRequestJob: function () {

        },

        onOpenPress: function (oEvent) {
            this.sendOpenCloseData(oEvent);

        },
        onNavBack: function () {

        }

    });
});