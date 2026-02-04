sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator'
], (Controller, MessageToast, MessageBox, JSONModel, BusyIndicator) => {
    "use strict";

    return Controller.extend("com.sysco.wm.palletisationui.controller.WrapPallet", {

        onInit() {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            this.appModulePath = jQuery.sap.getModulePath(appPath);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("WrapPallet").attachPatternMatched(this._onRouteMatched, this);
            this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _onRouteMatched: function () {
            var taksId = this.getOwnerComponent().getModel("printLabelDetails").getData().results;
            var taksId1 = this.getOwnerComponent().getModel("printLabelDetails1").getData().results;
            this.getView().byId("palletId").setText(taksId1.PalletID);
            this.checkPrinterConnection();
            this.fetchLabelFieldsAndPrint(taksId);
        },

        checkPrinterConnection: function () {
            var that = this;

            //check if cordova device plugin is available
            if (top.device) {
                var deviceId = top.device.uuid;
                this.deviceId = deviceId;
                var sUrl = this.appModulePath + "/bsxprinterservices" + "/SyscoFrancePrinters/Printers";
                var oLocale = sap.ui.getCore().getConfiguration().getLocale();
                var lang = oLocale.language;

                $.ajax({
                    url: sUrl,
                    beforeSend: function (xhr) { xhr.setRequestHeader('Accept-Language', lang); },
                    type: "GET",
                    data: {
                        $format: 'json'
                    },
                    success: function (oData, response) {
                        var devices = oData.value;
                        var exists = that.onCheckEntries(oData.value, deviceId);
                        that.exists = exists;
                        if (exists !== true) {
                            that.connectedPrinter = "";
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        BusyIndicator.hide();
                    }
                }, this);
            } else {

                //var oBundle = that.getView().getModel("i18n").getResourceBundle();
                //var sText = oBundle.getText("msgBox_Err");
                //not on a handheld device
                //MessageBox.error(sText);
                console.log("Device does not have bluetooth enabled");
                that.connectedPrinter = "";
            }
        },

        onCheckEntries: function (data, device) {
            var that = this;

            var i = data.findIndex(e => e.DeviceID === device);
            if (i > -1) {
                that.connectedPrinter = data[i].PrinterID;
                return true;
            }

            else {
                return false;
            }
        },

        fetchLabelFieldsAndPrint: function (sTaskId) {
            var that = this;
            this.sPalletBarcode = "";
            this.sRoute = "";
            this.sDeliveryDate = "";
            this.sPickingSite = "";
            this.sTemp = "";
            this.sPalletId = "";
            this.sMinDrop = "";
            this.sMaxDrop = "";
            this.sMediaPlacement = "";
            this.sMinShipTo = "";
            this.sMaxShipTo = "";
            this.sConsolidatedRoute = "";

            if (sTaskId !== "") {
                BusyIndicator.show(500);
                $.ajax({
                    url: this.appModulePath + "/palletiseservices/Pick/printLabel(pickTaskID='" + sTaskId + "')",
                    type: "GET",
                    contentType: "application/json",
                    dataType: "json",
                    async: true,
                    success: function (oData, response) {
                        that.sRoute = oData.Route;
                        that.sDeliveryDate = oData.DeliveryDate;
                        that.sPickingSite = oData.PickingSite;
                        that.sTemp = oData.Temperature;
                        that.sPalletId = oData.PalletID;
                        that.sPalletBarcode = that.sPalletId;
                        that.sMinDrop = oData.minDrop;
                        that.sMaxDrop = oData.maxDrop;
                        that.sMinShipTo = oData.minShipTo;
                        that.sMaxShipTo = oData.maxShipTo;
                        that.sMediaPlacement = oData.MediaPlacement;
                        that.sConsolidatedRoute = oData.ConsolidatedRoute;
                        that.triggerPalletLabelPrint(oData);
                        BusyIndicator.hide();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        BusyIndicator.hide();
                        MessageToast.show(jqXHR.responseText); //, "ERROR", "Service call error");
                    }
                });
            } else {
                MessageToast.show("Invalid Task ID");
            }
        },

        triggerPalletLabelPrint: function (oData) {
            var macAddress = "";
            var sMonoPalletabel = "";
            var sMultiPalletabel = "";
            var that = this;
            var sMediaPlacement = "";
            if (this.sMediaPlacement === 1) {
                sMediaPlacement = "A";
            } else if (this.sMediaPlacement === 2) {
                sMediaPlacement = "B";
            }
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sTo = oBundle.getText("to");

            var sRouteOrSite;
            var sPickingSite = this.sPickingSite;
            if (this.sConsolidatedRoute == this.sRoute) {
                sRouteOrSite = sPickingSite.slice(0, 2);
            } else {
                sRouteOrSite = this.sConsolidatedRoute;
            }

            var sLabel3 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO200,5^GFA,27608,27608,34,,,,,,,,,,,,,,,,,,,,J05B5,I036DAC,I0AB6D4,00175ABA,002AEB54,003B5AEC,0055A014,00B68004,005B,00ED,00B5,00D600168I02A80B5J0AD40015A002,00BBI02AI02D06DBE00376A00AEB800A,00D5I015I056956D500DAB40175AE04,005B8I0AC005A9BIA016B5D06D6D5808,00AD6I092006D2D6DD035AEA0B5B6D4,0075BA005500B655A2405AD2A0DA956C,002D55002A80AA6E80206D40016D01B6,0016EED02A40DA35J0B7I035400AB,001B55A815016C5BJ0D48002D8006D,I056D680AC1B06DI016EI056800368,I01B6B60922DA56C00154I05BI02B4,J05BAA0A82A85B6801B4I06DI0358,K0ADD0543682DB6015AI055I01A8,K036B02A5B02AAB81ACI06EI02EC,L0B505455016DD6174I0B5I02B4,L0DB4106D0036B51AAI057I01A8,L05502AB6I0ADA96CI06AI02D8,L06E814AAI016E9B4I05D800368,L055010D8J0550DAI06A8005B4,L06D8096CJ036956I02E8002A8,L0B6811B4J05B0DAI035800B68,00D0035A002A8J05546D8001AC00DB,00552AEB012D80400B68B6A022D682AC,006DAD5C0036003A55A055B5D0BB5B6A,00B6D76A005B00576ED036DAA0D5ADB4,005B75A80055005AB5401B57602D76D,00D5AD6I06C006DD680056AA02BI5,002D568I0B6002ABAI02BBA805B68,I02A8J0DAI054K0AA4I0A9,O0154,O0168,O01B4,O02D,O02B,O035,O05A8,O06E,O02,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,30^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sRouteOrSite + "^FS^CI27\n" +
                "^FO350,30^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sMediaPlacement + "^FS^CI27\n" +
                "^FO10,70^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO10,110^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + "^FS^CI27\n" +
                "^FO100,110^A0N,34,34^FB429,10,15,L^FH\^LI28^FD" + this.sMinShipTo + "^FS^CI27\n" +
                "^FO430,10\n" +
                "^BQN,2,6\n" +
                "^FDLA," + this.sPalletBarcode + "^FS\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO280,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";
            sMonoPalletabel = sLabel3;

            var sMultiLabel3 =
                "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO200,5^GFA,27608,27608,34,,,,,,,,,,,,,,,,,,,,J05B5,I036DAC,I0AB6D4,00175ABA,002AEB54,003B5AEC,0055A014,00B68004,005B,00ED,00B5,00D600168I02A80B5J0AD40015A002,00BBI02AI02D06DBE00376A00AEB800A,00D5I015I056956D500DAB40175AE04,005B8I0AC005A9BIA016B5D06D6D5808,00AD6I092006D2D6DD035AEA0B5B6D4,0075BA005500B655A2405AD2A0DA956C,002D55002A80AA6E80206D40016D01B6,0016EED02A40DA35J0B7I035400AB,001B55A815016C5BJ0D48002D8006D,I056D680AC1B06DI016EI056800368,I01B6B60922DA56C00154I05BI02B4,J05BAA0A82A85B6801B4I06DI0358,K0ADD0543682DB6015AI055I01A8,K036B02A5B02AAB81ACI06EI02EC,L0B505455016DD6174I0B5I02B4,L0DB4106D0036B51AAI057I01A8,L05502AB6I0ADA96CI06AI02D8,L06E814AAI016E9B4I05D800368,L055010D8J0550DAI06A8005B4,L06D8096CJ036956I02E8002A8,L0B6811B4J05B0DAI035800B68,00D0035A002A8J05546D8001AC00DB,00552AEB012D80400B68B6A022D682AC,006DAD5C0036003A55A055B5D0BB5B6A,00B6D76A005B00576ED036DAA0D5ADB4,005B75A80055005AB5401B57602D76D,00D5AD6I06C006DD680056AA02BI5,002D568I0B6002ABAI02BBA805B68,I02A8J0DAI054K0AA4I0A9,O0154,O0168,O01B4,O02D,O02B,O035,O05A8,O06E,O02,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,30^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sRouteOrSite + "^FS^CI27\n" +
                "^FO350,30^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sMediaPlacement + "^FS^CI27\n" +
                "^FO10,80^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO20,130^A0N,20,20^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + " ( " + this.sMinShipTo + " ) " + sTo + " " + this.sMaxDrop + " ( " + this.sMaxShipTo + " ) " + "^FS^CI27\n" +
                "^FO430,10\n" +
                "^BQN,2,6\n" +
                "^FDLA," + this.sPalletBarcode + "^FS\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO280,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";

            sMultiPalletabel = sMultiLabel3;
            var printerModel = sap.ui.getCore().getModel('printerModel');
            var macAddress = "";
            if (printerModel !== undefined) {
                macAddress = printerModel.getProperty("/macAddress");
            } else {
                macAddress = this.connectedPrinter;
            }
            //MessageBox.show("Connected Device macAddress: " + macAddress);
            //if a macAddress exists in z table
            //var sBondState = "bonded";
            if (macAddress !== "") {

                if (top.ble) {
                    top.ble.readBondState(macAddress,
                        function (sBondState) {
                            if (oData.PickType_ID === "MO" || oData.PickType_ID === "FP") {
                                if (sBondState == "bonded") {
                                    that.fnPrintLabel(macAddress, sMonoPalletabel)
                                        .then((result) => {
                                            console.log("Print success:", result);
                                        })
                                        .catch((err) => {
                                            console.error("Print failed:", err);
                                        });
                                }
                                else {
                                    that.fnBondAndPrint(macAddress, sMonoPalletabel)
                                        .then((result) => {
                                            console.log("Print success:", result);
                                        })
                                        .catch((err) => {
                                            console.error("Print failed:", err);
                                        });
                                }

                            } else if (oData.PickType_ID === "MT") {
                                if (sBondState == "bonded") {
                                    that.fnPrintLabel(macAddress, sMultiPalletabel)
                                        .then((result) => {
                                            console.log("Print success:", result);
                                        })
                                        .catch((err) => {
                                            console.error("Print failed:", err);
                                        });
                                }
                                else {
                                    that.fnBondAndPrint(macAddress, sMultiPalletabel)
                                        .then((result) => {
                                            console.log("Print success:", result);
                                        })
                                        .catch((err) => {
                                            console.error("Print failed:", err);
                                        });
                                }
                            }
                        }),
                        function (oErrBondState) {
                            BusyIndicator.hide();
                            MessageBox.show("Error: " + oErrBondState);
                            var oBundle = that.getView().getModel("i18n").getResourceBundle();
                            var sReadBondStateFailed = oBundle.getText("printFailed");
                            console.log(sReadBondStateFailed);
                        }
                } else {
                    BusyIndicator.hide();
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var sText_PPlugin = oBundle.getText("mToast_Pplugin");
                    MessageToast.show(sText_PPlugin);
                }
            } else {
                BusyIndicator.hide();
                var oBundle = that.getView().getModel("i18n").getResourceBundle();
                var sText_NoPrinter = oBundle.getText("NoPrinter");
                MessageToast.show(sText_NoPrinter);
                //possibly need to add prompt to do it here? only possible if user error
            }
        },

        fnBondAndPrint: function (macAddress, labelTranslated) {
            var that = this;
            BusyIndicator.show(500);

            if (top.ble) {
                top.ble.readBondState(macAddress,
                    function (sBondState) {
                        if (sBondState == "none") {
                            top.ble.bond(macAddress,
                                function (message) {
                                    console.log("Pairing successful - " + message);
                                    //once paired, call auto connect because 1st connection is always temporary
                                    that.triggerPrint(macAddress, labelTranslated);
                                },
                                function (oErr) {
                                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                                    var sPairingInfo = oBundle.getText("pairingInfo");
                                    BusyIndicator.hide();
                                    console.log(sPairingInfo);

                                },
                                { usePairingDialog: true }
                            );
                        }
                    },
                    function (oErrorBonding) {
                        var oBundle = that.getView().getModel("i18n").getResourceBundle();
                        var sReadBondStateFailed = oBundle.getText("printFailed");
                        BusyIndicator.hide();
                        console.log(sReadBondStateFailed);
                    });
            }
        },

        fnPrintLabel: function (macAddress, labelTranslated) {
            var that = this;
            //if device listed in z table is currently connected then print with no issue
            top.cordova.plugins.zbtprinter.print(macAddress, labelTranslated,
                function (success) {
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var sText_success = oBundle.getText("msgToast_PrintSuccess");
                    console.log(sText_success + " " + success);
                    BusyIndicator.hide();
                }, function (fail) {
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var sText_fail = oBundle.getText("msgToast_PrintFail");

                    /*when the device looses pairing, try to re-pair it */
                    var failText = "Could not connect to device: read failed, socket might closed or timeout, read ret: -1";
                    if (fail == failText) {
                        setTimeout(that.triggerPrint(macAddress, labelTranslated), 5000);
                    } else {
                        console.log(sText_fail + " " + fail);
                        BusyIndicator.hide();
                    }
                });
        },

        triggerPrint: function (macAddress, labelTranslated) {
            var that = this;
            if (top.ble) {
                this.bDeviceConnected = false;
                if (macAddress !== "") {
                    /*printer connect */
                    top.cordova.plugins.zbtprinter.print(macAddress, labelTranslated,
                        function (printSuccess) {
                            BusyIndicator.hide();
                            var oBundle = that.getView().getModel("i18n").getResourceBundle();
                            var sText_success = oBundle.getText("msgToast_PrintSuccess");
                            console.log(sText_success + " " + success);
                        }, function (printFail) {
                            BusyIndicator.hide();
                            var oBundle = that.getView().getModel("i18n").getResourceBundle();
                            var sText_fail = oBundle.getText("msgToast_PrintFail");
                            console.log(sText_fail + " " + fail);

                        });
                } else {
                    BusyIndicator.hide();
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var oInvalidPrinerAddress = oBundle.getText("invalidPrinterAddress");
                    MessageToast.show(oInvalidPrinerAddress)
                }
            } else {
                BusyIndicator.hide();
                var oBundle = that.getView().getModel("i18n").getResourceBundle();
                var oCordovaUndefined = oBundle.getText("cordovaUndefined");
                MessageToast.show(oCordovaUndefined);
            }
        },

        PrintConfirmLabel: async function () {
            var res = await this._callNextMarshelling("print");
            var that = this;
            MessageBox.information(
                that.oBundle.getText("lbl"),
                {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {
                            that.getOwnerComponent().getRouter().navTo("Home");
                        }
                    }.bind(that)
                }
            );
        },

        _callNextMarshelling: function (check) {
            return new Promise((resolve, reject) => {
                var sDest1 = "/palletiseservices/Palletise";
                var printLabelDetails = this.getOwnerComponent().getModel("printLabelDetails").getData();
                if (check === "print") {
                    var sUrl = this.appModulePath + sDest1 + "/suggestMove(" + "pickTaskID='" + printLabelDetails.results + "',wantToWrap=false)"
                }
                else {
                    var sUrl = this.appModulePath + sDest1 + "/suggestMove(" + "pickTaskID='" + printLabelDetails.results + "',wantToWrap=true)"
                }
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
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },

        gotoRequestJob: async function () {
            var res = await this._callNextMarshelling();
            this.getOwnerComponent().getRouter().navTo("LabelPrint");
        }
    });
});