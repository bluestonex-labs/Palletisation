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
            this.fetchLabelFieldsAndPrint(taksId);
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
                        that.sPalletBarcode = that.sRoute + "-" + that.sDeliveryDate + "-" + that.sPalletId;
                        that.sMinDrop = oData.minDrop;
                        that.sMaxDrop = oData.maxDrop;
                        that.sMediaPlacement = oData.MediaPlacement;
                        that.triggerPalletLabelPrint();
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

         triggerPalletLabelPrint: function () {
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

            var sLabel1 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,50^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO10,100^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + "^FS^CI27\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO180,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";

            var sLabel2 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FT170,390^A0N,30,30^FH\\^FD" + this.sPalletBarcode + "^FS\n" +
                "^BY1,3,110^FT130,170^BCN,,Y,Y\n" +
                "^FH\\^FD" + this.sPalletBarcode + "^FS\n" +
                "^XZ";

            var sLabel3 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO200,5^GFA,27608,27608,34,,,,,,,,,,,,,,,,,,,,J05B5,I036DAC,I0AB6D4,00175ABA,002AEB54,003B5AEC,0055A014,00B68004,005B,00ED,00B5,00D600168I02A80B5J0AD40015A002,00BBI02AI02D06DBE00376A00AEB800A,00D5I015I056956D500DAB40175AE04,005B8I0AC005A9BIA016B5D06D6D5808,00AD6I092006D2D6DD035AEA0B5B6D4,0075BA005500B655A2405AD2A0DA956C,002D55002A80AA6E80206D40016D01B6,0016EED02A40DA35J0B7I035400AB,001B55A815016C5BJ0D48002D8006D,I056D680AC1B06DI016EI056800368,I01B6B60922DA56C00154I05BI02B4,J05BAA0A82A85B6801B4I06DI0358,K0ADD0543682DB6015AI055I01A8,K036B02A5B02AAB81ACI06EI02EC,L0B505455016DD6174I0B5I02B4,L0DB4106D0036B51AAI057I01A8,L05502AB6I0ADA96CI06AI02D8,L06E814AAI016E9B4I05D800368,L055010D8J0550DAI06A8005B4,L06D8096CJ036956I02E8002A8,L0B6811B4J05B0DAI035800B68,00D0035A002A8J05546D8001AC00DB,00552AEB012D80400B68B6A022D682AC,006DAD5C0036003A55A055B5D0BB5B6A,00B6D76A005B00576ED036DAA0D5ADB4,005B75A80055005AB5401B57602D76D,00D5AD6I06C006DD680056AA02BI5,002D568I0B6002ABAI02BBA805B68,I02A8J0DAI054K0AA4I0A9,O0154,O0168,O01B4,O02D,O02B,O035,O05A8,O06E,O02,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,20^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sConsolidatedRoute + "^FS^CI27\n" +
                "^FO350,20^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sMediaPlacement + "^FS^CI27\n" +
                "^FO10,60^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO10,120^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + "^FS^CI27\n" +
                "^FO430,30\n" +
                "^BQN,2,5\n" +
                "^FD" + this.sPalletBarcode + "^FS\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO280,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";
            //sMonoPalletabel = sLabel1 + sLabel2;
            sMonoPalletabel = sLabel3;

            var sMultiLabel1 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,50^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO10,100^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + " " + sTo + " " + this.sMaxDrop + "^FS^CI27\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO180,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";

            var sMultiLabel2 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FT170,390^A0N,30,30^FH\\^FD" + this.sPalletBarcode + "^FS\n" +
                "^BY1,3,110^FT130,170^BCN,,Y,Y\n" +
                "^FH\\^FD" + this.sPalletBarcode + "^FS\n" +
                "^XZ";

            var sMultiLabel3 = "CT~~CD,~CC^~CT~\n" +
                "^XA\n" +
                "^POI\n" +
                "^FO200,5^GFA,27608,27608,34,,,,,,,,,,,,,,,,,,,,J05B5,I036DAC,I0AB6D4,00175ABA,002AEB54,003B5AEC,0055A014,00B68004,005B,00ED,00B5,00D600168I02A80B5J0AD40015A002,00BBI02AI02D06DBE00376A00AEB800A,00D5I015I056956D500DAB40175AE04,005B8I0AC005A9BIA016B5D06D6D5808,00AD6I092006D2D6DD035AEA0B5B6D4,0075BA005500B655A2405AD2A0DA956C,002D55002A80AA6E80206D40016D01B6,0016EED02A40DA35J0B7I035400AB,001B55A815016C5BJ0D48002D8006D,I056D680AC1B06DI016EI056800368,I01B6B60922DA56C00154I05BI02B4,J05BAA0A82A85B6801B4I06DI0358,K0ADD0543682DB6015AI055I01A8,K036B02A5B02AAB81ACI06EI02EC,L0B505455016DD6174I0B5I02B4,L0DB4106D0036B51AAI057I01A8,L05502AB6I0ADA96CI06AI02D8,L06E814AAI016E9B4I05D800368,L055010D8J0550DAI06A8005B4,L06D8096CJ036956I02E8002A8,L0B6811B4J05B0DAI035800B68,00D0035A002A8J05546D8001AC00DB,00552AEB012D80400B68B6A022D682AC,006DAD5C0036003A55A055B5D0BB5B6A,00B6D76A005B00576ED036DAA0D5ADB4,005B75A80055005AB5401B57602D76D,00D5AD6I06C006DD680056AA02BI5,002D568I0B6002ABAI02BBA805B68,I02A8J0DAI054K0AA4I0A9,O0154,O0168,O01B4,O02D,O02B,O035,O05A8,O06E,O02,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
                "^FO,10^GB570,185,2^FS\n" +
                "^FO10,20^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sConsolidatedRoute + "^FS^CI27\n" +
                "^FO350,20^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + sMediaPlacement + "^FS^CI27\n" +
                "^FO10,60^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sRoute + "^FS^CI27\n" +
                "^FO10,120^A0N,39,39^FB429,10,15,L^FH\^LI28^FD" + this.sMinDrop + " " + sTo + " " + this.sMaxDrop + "^FS^CI27\n" +
                "^FO430,30\n" +
                "^BQN,2,5\n" +
                "^FD" + this.sPalletBarcode + "^FS\n" +
                "^FO10,160^A0N,29,29^FB429,10,15,L^FH\^LI28^FD" + this.sDeliveryDate + "^FS^CI27\n" +
                "^FO280,160^A0N,29,29^FB629,10,15,L^FH\^LI28^FD" + this.sPickingSite + "^FS^CI27\n" +
                "^FO400,160^A0N,29,29^FB729,10,15,L^FH\^LI28^FD" + this.sTemp + "^FS^CI27\n" +
                "^XZ";
            //    sMultiPalletabel = sLabel1 + sLabel2;
            sMultiPalletabel = sMultiLabel3;
            var printerModel = sap.ui.getCore().getModel('printerModel');
            var macAddress = "";
            if (printerModel !== undefined) {
                macAddress = printerModel.getProperty("/macAddress");
            } else {
                macAddress = this.connectedPrinter;
            }
            //if a macAddress exists in z table
            if (macAddress !== "") {
                //var macAddress = printerModel.getProperty("/macAddress");
                if (top.ble) {
                    top.ble.readBondState(macAddress,
                        function (sBondState) {
                            if (that.currentItemPick[0].PickTypeID === "MO" || that.currentItemPick[0].PickTypeID === "FP") {
                                if (sBondState == "bonded") {
                                    that.fnPrintLabel(macAddress, sMonoPalletabel);
                                }
                                else {
                                    that.fnBondAndPrint(macAddress, sMonoPalletabel);
                                }

                            } else if (that.currentItemPick[0].PickTypeID === "MT") {
                                if (sBondState == "bonded") {
                                    that.fnPrintLabel(macAddress, sMultiPalletabel);
                                }
                                else {
                                    that.fnBondAndPrint(macAddress, sMultiPalletabel);
                                }
                            }
                        }),
                        function (oErrBondState) {
                            BusyIndicator.hide();
                            var oBundle = that.getView().getModel("i18n").getResourceBundle();
                            var sReadBondStateFailed = oBundle.getText("printFailed");
                            console.log(sReadBondStateFailed)
                        }
                }
                else {
                    BusyIndicator.hide();
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var sText_PPlugin = oBundle.getText("mToast_Pplugin");
                    MessageToast.show(sText_PPlugin);
                }
            }
            else {
                BusyIndicator.hide();
                var oBundle = that.getView().getModel("i18n").getResourceBundle();
                var sText_NoPrinter = oBundle.getText("NoPrinter");
                //MessageBox.error(sText_NoPrinter);
                MessageToast.show(sText_NoPrinter);
                //possibly need to add prompt to do it here? only possible if user error
            }
        },

        // triggerPickAndStickLabelPrint: function (oLabelData) {
        //     var macAddress = "";
        //     var sPicknStickCustName = "",
        //         sPicknStickCustno = "",
        //         sPicknStickOrdno = "",
        //         sPicknStickPallet = "",
        //         sPicknStickRouteNo = "",
        //         sPicknStickProdDesc = "",
        //         sPicknStickProdCode = "",
        //         sPicknStickPickSite = "",
        //         sPicknStickProdLoc = "",
        //         sPicknStickUnitQty = "",
        //         sPicknStickTotalQty = "",
        //         sPicknStickPickingUOM = "",
        //         sPicknStickCatchWeight = "",
        //         sPicknStickDelPlat = "",
        //         sPicknStickDropNo = "",
        //         sPicknStickPalletIndicator = "",
        //         sPicknStickSelectorID = "",
        //         sBarcode = "";

        //     var sPickTaskId = this.currentItemPick[0].Task_ID;
        //     var sPickTaskItemId = this.currentItemPick[0].ItemID;
        //     var sDeliveryDate = this.currentItemPick[0].DeliveryDate;

        //     var sPickNStickLabel = "", sPickNStickLabel_old = "", sPickNStickLabel_big = "";

        //     var sQtyinCases = this.getView().byId("inCases").getValue();
        //     var sQtyinUnits = this.getView().byId("inUnits").getValue();

        //     var sTotalLabels = 0;
        //     if (sQtyinCases !== "" && parseInt(sQtyinCases) > 0 && sQtyinUnits !== "" && parseInt(sQtyinUnits) > 0) {
        //         sTotalLabels = parseInt(sQtyinCases) + parseInt(sQtyinUnits);
        //     } else if (sQtyinCases !== "" && parseInt(sQtyinCases) > 0) {
        //         sTotalLabels = parseInt(sQtyinCases);
        //     } else if (sQtyinUnits !== "" && parseInt(sQtyinUnits) > 0) {
        //         sTotalLabels = parseInt(sQtyinUnits);
        //     }

        //     var i = 0;
        //     sPicknStickCustName = oLabelData.value.items[i].CustomerName;
        //     sPicknStickCustno = oLabelData.value.items[i].CustomerNumber;
        //     sPicknStickOrdno = oLabelData.value.items[i].OrderNo;
        //     sPicknStickPallet = oLabelData.value.items[i].Pallet;
        //     sPicknStickRouteNo = oLabelData.value.items[i].RouteNo;
        //     sPicknStickProdDesc = oLabelData.value.items[i].ProductDescription;
        //     sPicknStickProdCode = oLabelData.value.items[i].ProductCode;
        //     sPicknStickPickSite = oLabelData.value.items[i].PickingSite;
        //     sPicknStickProdLoc = oLabelData.value.items[i].ProductLocation;
        //     sPicknStickUnitQty = oLabelData.value.items[i].QTY;
        //     sPicknStickTotalQty = oLabelData.value.items[i].TOTALOPENQTY;
        //     sPicknStickPickingUOM = oLabelData.value.items[i].PickingUOM;
        //     if (oLabelData.value.items[i].CatchWeight == null) {
        //         sPicknStickCatchWeight = "N/A";
        //     } else {
        //         sPicknStickCatchWeight = oLabelData.value.items[i].CatchWeight;
        //     }
        //     sPicknStickDelPlat = oLabelData.value.items[i].DeliveryPlatform;
        //     sPicknStickDropNo = oLabelData.value.items[i].DropNo;
        //     sPicknStickPalletIndicator = oLabelData.value.items[i].PalletIndicator;
        //     sPicknStickSelectorID = oLabelData.value.items[i].SelectorID;
        //     sBarcode = sPickTaskId + "|" + sPickTaskItemId + "|" + sPicknStickUnitQty;
        //     //sBarcode = sPickTaskId;
        //     if (parseInt(sTotalLabels) > 0 && this.currentItemPick[0].PickTypeID !== "FP") {
        //         for (var j = 0; j < sTotalLabels; j++) {

        //             sPickNStickLabel_old += "CT~~CD,~CC^~CT~\n" +
        //                 "^XA\n" +
        //                 "^POB\n" +
        //                 "^PMN\n" +
        //                 "^CI27\n" +
        //                 "^XZ\n" +
        //                 "^XA\n" +
        //                 "^BY2,3,120^FT244,975^BCB,,Y,N\n" +
        //                 "^FH\\^FD" + sBarcode + "^FS\n" +
        //                 "^FO110,280,715^GFA,673,7704,16,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
        //                 "/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,M01,,M014,,M02,N080988,O01776,O06CA9,O0DBDF4,N03B532A,N056BEDC,N06965B38,N09FDB6E,N0F200958,M01AC003B4,\n" +
        //                 "/M0158I06A,M03AJ0D4,N07J03C,M03CJ062,M02BJ05C,M016J036,M03CJ058,M013J0A6,M02E8I07C,M019J0C8,N0EC001B4,M015B01F58,N0B6ED2E,N06996D58,N05F7D6A,\n" +
        //                 "/N032D3DE,O0DAD3,O065AE8,O01F78,Q08004,N04J04,M013J0BC,M02CJ052,M017J06C,M02CJ054,M01BJ03E,M036J05,M02AJ02E,M015J074,M03EJ0CE,M0118I038,\n" +
        //                 "/M02F2001E6,M01AC00158,M015524EB4,N0EFDB5E8,N09936B1,N076E9EF,N02D5F1A,N01BAAF4,O0655A8,O01FF4,,R01,Q0348,N0A004B2,M01480B6C,M01B00DDB,\n" +
        //                 "/M016013268,M03A01EFD,M0150354AC,M02A02BB78,M01E05E0A4,M03002905C,M02F076034,M01A0CC06A,M0358BA01C,N0F76402A,M014ADC074,M01BDA802A,\n" +
        //                 "/N06B7005C,N0D6C807,N02D3004C,N01BC00B8,M02C,M012,M02DC8,M01B2,M036EE,N0D59C,M033B73,N0E6AE6,N01DD5D8,O033AAB,P0E7766,P01CCDD4,Q03BAA84,\n" +
        //                 "/R06I78,P0921CCD6,O052903BAA,O095240676,N012ADA81CC,N02D52I03B,N05228J06,N04DC,N0B2,M014C,N09004,M0360016,N0803EC8,K020300D53A,K0DE200ABE4,\n" +
        //                 "/K0A8003755F,J0174204AEB4,K0A8003D96B8,J015800537DE8,K0E8006EC294,J019I0B50178,J0178014F01A4,K0CI0F8007C,J01B8015600CA,J016801AC0034,K0D4035800DA,\n" +
        //                 "/J01B802F40034,K0560548006A,K0ADDFB800DC,K0FB346I032,K026EBDI0EC,K05996AI054,K02F7D6001B8,K01AD38I064,L05ADI01D8,L02FAI0128\n" +
        //                 "^FO50,50^GB700,1050,3^FS\n" +
        //                 "^FO120,350^GB50,50,50,B^FS\n" +
        //                 "^FO120,280^GB50,50,0,B^FS\n" +
        //                 "^FT220,980^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" +
        //                 "^FT300,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sPicknStickCustName + sPicknStickCustno + "^FS^CI27\n" +
        //                 "^FT300,980^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sPicknStickOrdno + "^FS^CI27\n" +
        //                 "^FT200,680^A0B,59,59^FB1029,1,15,C^FH^CI28^FD" + sPicknStickPallet + "^FS^CI27\n" +
        //                 "^FT300,680^A0B,39,39^FB1029,1,15,C^FH^CI28^FD" + sPicknStickRouteNo + "^FS^CI27\n" +
        //                 "^FT350,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sPicknStickProdDesc + sPicknStickProdCode + "^FS^CI27\n" +
        //                 "^FT400,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sPicknStickPickSite + " - " + sPicknStickSelectorID + " " + sPicknStickProdLoc + "^FS^CI27\n" +
        //                 "^FT470,1380^A0B,39,39^FB1029,1,15,C^FH^CI28^FD" + sPicknStickUnitQty + " of " + sPicknStickTotalQty + " " + sPicknStickPickingUOM + "^FS^CI27\n" +
        //                 "^FT470,1280^A0B,19,19^FB1229,1,15,C^FH^CI28^FD" + "C/W - " + sPicknStickCatchWeight + "^FS^CI27\n" +
        //                 "^FT470,1080^A0B,29,29^FB1229,1,15,C^FH^CI28^FD" + sPicknStickDelPlat + "^FS^CI27\n" +
        //                 "^FT470,780^A0B,59,59^FB1229,1,15,C^FH^CI28^FD" + sPicknStickDropNo + "^FS^CI27\n" +
        //                 "^XZ";

        //             sPickNStickLabel_big += "CT~~CD,~CC^~CT~\n" +
        //                 "^XA\n" +
        //                 "^POR\n" +
        //                 "^PMN\n" +
        //                 "^CI27\n" +
        //                 "^XZ\n" +
        //                 "^XA\n" +
        //                 "^BY1,3,70^FT90,580^BCB,,N,N\n" +
        //                 "^FH\\^FD" + sBarcode + "^FS\n" +
        //                 "^F110,280,715^GFA,673,7704,16,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
        //                 "/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,M01,,M014,,M02,N080988,O01776,O06CA9,O0DBDF4,N03B532A,N056BEDC,N06965B38,N09FDB6E,N0F200958,M01AC003B4,\n" +
        //                 "/M0158I06A,M03AJ0D4,N07J03C,M03CJ062,M02BJ05C,M016J036,M03CJ058,M013J0A6,M02E8I07C,M019J0C8,N0EC001B4,M015B01F58,N0B6ED2E,N06996D58,N05F7D6A,\n" +
        //                 "/N032D3DE,O0DAD3,O065AE8,O01F78,Q08004,N04J04,M013J0BC,M02CJ052,M017J06C,M02CJ054,M01BJ03E,M036J05,M02AJ02E,M015J074,M03EJ0CE,M0118I038,\n" +
        //                 "/M02F2001E6,M01AC00158,M015524EB4,N0EFDB5E8,N09936B1,N076E9EF,N02D5F1A,N01BAAF4,O0655A8,O01FF4,,R01,Q0348,N0A004B2,M01480B6C,M01B00DDB,\n" +
        //                 "/M016013268,M03A01EFD,M0150354AC,M02A02BB78,M01E05E0A4,M03002905C,M02F076034,M01A0CC06A,M0358BA01C,N0F76402A,M014ADC074,M01BDA802A,\n" +
        //                 "/N06B7005C,N0D6C807,N02D3004C,N01BC00B8,M02C,M012,M02DC8,M01B2,M036EE,N0D59C,M033B73,N0E6AE6,N01DD5D8,O033AAB,P0E7766,P01CCDD4,Q03BAA84,\n" +
        //                 "/R06I78,P0921CCD6,O052903BAA,O095240676,N012ADA81CC,N02D52I03B,N05228J06,N04DC,N0B2,M014C,N09004,M0360016,N0803EC8,K020300D53A,K0DE200ABE4,\n" +
        //                 "/K0A8003755F,J0174204AEB4,K0A8003D96B8,J015800537DE8,K0E8006EC294,J019I0B50178,J0178014F01A4,K0CI0F8007C,J01B8015600CA,J016801AC0034,K0D4035800DA,\n" +
        //                 "/J01B802F40034,K0560548006A,K0ADDFB800DC,K0FB346I032,K026EBDI0EC,K05996AI054,K02F7D6001B8,K01AD38I064,L05ADI01D8,L02FAI0128\n" +
        //                 "^FO10,10^GB190,590,2^FS\n" +
        //                 "^FO20,180^GB25,25,25,B^FS\n" +
        //                 "^FO20,150^GB25,25,0,B^FS\n" +
        //                 "^FT75,700^A0B,15,15^FB1029,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" + "^FT110,950^A0B,14,14^FB1029,1,15,C^FH^CI28^FD" + sPicknStickCustName + sPicknStickCustno + "^FS^CI27\n" +
        //                 "^FT100,700^A0B,14,14^FB1029,1,15,C^FH^CI28^FD" + sPicknStickOrdno + "^FS^CI27\n" +
        //                 "^FT80,400^A0B,50,50^FB929,1,15,C^FH^CI28^FD" + sPicknStickPallet + "^FS^CI27\n" +
        //                 "^FT120,520^A0B,25,25^FB1029,1,15,C^FH^CI28^FD" + sPicknStickRouteNo + "^FS^CI27\n" +
        //                 "^FT130,950^A0B,14,14^FB1029,1,15,C^FH^CI28^FD" + sPicknStickProdDesc + sPicknStickProdCode + "^FS^CI27\n" +
        //                 "^FT150,845^A0B,14,14^FB1029,1,15,C^FH^CI28^FD" + sPicknStickPickSite + " - " + sPicknStickSelectorID + " " + sPicknStickProdLoc + "^FS^CI27\n" +
        //                 "^FT170,840^A0B,14,14^FB1029,1,15,C^FH^CI28^FD" + sPicknStickUnitQty + " of " + sPicknStickTotalQty + " " + sPicknStickPickingUOM + "^FS^CI27\n" +
        //                 "^FT170,780^A0B,15,15^FB1229,1,15,C^FH^CI28^FD" + sPicknStickCatchWeight + "^FS^CI27\n" +
        //                 "^FT170,1080^A0B,15,15^FB1229,1,15,C^FH^CI28^FD" + sPicknStickDelPlat + "^FS^CI27\n" +
        //                 "^FT170,580^A0B,20,20^FB1229,1,15,C^FH^CI28^FD" + sPicknStickDropNo + "^FS^CI27\n" +
        //                 "^XZ";

        //             sPicknStickProdCode = sPicknStickProdCode.replace(/^0+(?!$)/, '');
        //             // Barcode coding
        //             // sPickNStickLabel += "CT~~CD,~CC^~CT~\n" +
        //             //     "^XA\n" +
        //             //     "^POI\n" +
        //             //     "^FO0,20^BY1,2,60^BCN,40,N,N,N,A^FD" + sBarcode + "^FS\n" +
        //             //     "^FO,10^GB570,185,2^FS\n" +
        //             //     "^FO380,20^GB25,25,25,B^FS\n" +
        //             //     "^FO410,20^GB25,25,0,B^FS\n" +
        //             //     "^FO215,80^A0N,16,16^FB209,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" +
        //             //     "^FO10,80^A0N,16,16^FB229,1,15,L^FH^CI28^FD" + sPicknStickCustName + "-" + sPicknStickCustno + "^FS^CI27\n" +
        //             //     "^FO20,125^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + sPicknStickOrdno + "^FS^CI27\n" +
        //             //     "^FO60,40^A0N,26,26^FB929,1,15,C^FH^CI28^FD" + sPicknStickPallet + "^FS^CI27\n" +
        //             //     "^FO50,100^A0N,30,30^FB929,1,15,C^FH^CI28^FD" + sPicknStickRouteNo + "^FS^CI27\n" +
        //             //     "^FO10,110^A0N,16,16^FB600,1,15,L^FH^CI28^FD" + sPicknStickProdDesc + " - " + sPicknStickProdCode + "^FS^CI27\n" +
        //             //     "^FO10,135^A0N,16,16^FB500,1,15,L^FH^CI28^FD" + sPicknStickPickSite + " - " + sPicknStickSelectorID + " " + sPicknStickProdLoc + "^FS^CI27\n" +
        //             //     "^FO10,165^A0N,24,24^FB229,1,15,L^FH^CI28^FD" + sPicknStickUnitQty + " of " + sPicknStickTotalQty + " " + sPicknStickPickingUOM + "^FS^CI27\n" +
        //             //     "^FO20,155^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + "C/W-" + sPicknStickCatchWeight + "^FS^CI27\n" +
        //             //     "^FO20,175^A0N,20,20^FB629,1,15,C^FH^CI28^FD" + sPicknStickDelPlat + "^FS^CI27\n" +
        //             //     "^FO150,140^A0N,40,40^FB729,1,15,C^FH^CI28^FD" + sPicknStickDropNo + "^FS^CI27\n" +
        //             //     "^XZ";

        //             //2d barcode
        //             // sPickNStickLabel += "CT~~CD,~CC^~CT~\n" +
        //             //     "^XA\n" +
        //             //     "^POI\n" +
        //             //     "^FO0,20^BY1,2,60^BCN,40,N,N,N,A^FD" + sBarcode + "^FS\n" +
        //             //     "^FO,10^GB570,185,2^FS\n" +
        //             //     "^FO380,20^GB25,25,25,B^FS\n" +
        //             //     "^FO410,20^GB25,25,0,B^FS\n" +
        //             //     "^FO215,80^A0N,16,16^FB209,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" +
        //             //     "^FO10,80^A0N,16,16^FB229,1,15,L^FH^CI28^FD" + sPicknStickCustName + "-" + sPicknStickCustno + "^FS^CI27\n" +
        //             //     "^FO20,130^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + sPicknStickOrdno + "^FS^CI27\n" +
        //             //     "^FO60,40^A0N,26,26^FB929,1,15,C^FH^CI28^FD" + sPicknStickPallet + "^FS^CI27\n" +
        //             //     "^FO50,100^A0N,30,30^FB929,1,15,C^FH^CI28^FD" + sPicknStickRouteNo + "^FS^CI27\n" +
        //             //     "^FO10,110^A0N,16,16^FB600,1,15,L^FH^CI28^FD" + sPicknStickProdDesc + " - " + sPicknStickProdCode + "^FS^CI27\n" +
        //             //     "^FO10,135^A0N,16,16^FB500,1,15,L^FH^CI28^FD" + sPicknStickPickSite + " - " + sPicknStickSelectorID + " " + sPicknStickProdLoc + "^FS^CI27\n" +
        //             //     "^FO10,165^A0N,24,24^FB229,1,15,L^FH^CI28^FD" + sPicknStickUnitQty + " of " + sPicknStickTotalQty + " " + sPicknStickPickingUOM + "^FS^CI27\n" +
        //             //     "^FO20,155^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + "C/W-" + sPicknStickCatchWeight + "^FS^CI27\n" +
        //             //     "^FO20,175^A0N,20,20^FB629,1,15,C^FH^CI28^FD" + sPicknStickDelPlat + "^FS^CI27\n" +
        //             //     "^FO490,120\n" +
        //             //     "^BXN,4,200\n" +
        //             //     "^FD" + sBarcode + "^FS\n" +
        //             //     "^XZ";

        //             // QR code
        //             sPickNStickLabel += "CT~~CD,~CC^~CT~\n" +
        //                 "^XA\n" +
        //                 "^POI\n" +
        //                 "^FO,10^GB570,185,2^FS\n" +
        //                 "^FO10,20^A0N,24,24^FB729,1,15,L^FH^CI28^FD" + sPicknStickRouteNo + "^FS^CI27\n" +
        //                 "^FO160,20^A0N,24,24^FB929,1,15,L^FH^CI28^FD" + sPicknStickDropNo + "^FS^CI27\n" +
        //                 "^FO380,20^GB25,25,25,B^FS\n" +
        //                 "^FO410,20^GB25,25,0,B^FS\n" +
        //                 "^FO215,80^A0N,16,16^FB209,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" +
        //                 "^FO10,80^A0N,16,16^FB229,1,15,L^FH^CI28^FD" + sPicknStickCustName + "-" + sPicknStickCustno + "^FS^CI27\n" +
        //                 "^FO20,125^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + sPicknStickOrdno + "^FS^CI27\n" +
        //                 "^FO60,30^A0N,26,26^FB929,1,15,C^FH^CI28^FD" + sPicknStickPallet + "^FS^CI27\n" +
        //                 "^FO10,110^A0N,16,16^FB600,1,15,L^FH^CI28^FD" + sPicknStickProdDesc + " - " + sPicknStickProdCode + "^FS^CI27\n" +
        //                 "^FO10,135^A0N,16,16^FB500,1,15,L^FH^CI28^FD" + sPicknStickPickSite + " - " + sPicknStickSelectorID + " " + sPicknStickProdLoc + "^FS^CI27\n" +
        //                 "^FO10,165^A0N,24,24^FB229,1,15,L^FH^CI28^FD" + sPicknStickUnitQty + " of " + sPicknStickTotalQty + " " + sPicknStickPickingUOM + "^FS^CI27\n" +
        //                 "^FO20,155^A0N,16,16^FB629,1,15,C^FH^CI28^FD" + "C/W-" + sPicknStickCatchWeight + "^FS^CI27\n" +
        //                 "^FO20,175^A0N,20,20^FB629,1,15,C^FH^CI28^FD" + sPicknStickDelPlat + "^FS^CI27\n" +
        //                 "^FO430,0\n" +
        //                 "^BQN,2,4\n" +
        //                 "^FD" + sBarcode + "^FS\n" +
        //                 "^XZ";
        //         }
        //     };

        //     // var sLabelTranslated =
        //     //     "CT~~CD,~CC^~CT~\n" +
        //     //     "^XA\n" +
        //     //     "^PMN\n" +
        //     //     "^CI27\n" +
        //     //     "^XZ\n" +
        //     //     "^XA\n" +
        //     //     "^BY2,3,120^FT244,975^BCB,,Y,N\n" +
        //     //     "^FH\\^FD" + sBarcode + "^FS\n" +
        //     //     "^FO110,280,715^GFA,673,7704,16,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n" +
        //     //     "/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,M01,,M014,,M02,N080988,O01776,O06CA9,O0DBDF4,N03B532A,N056BEDC,N06965B38,N09FDB6E,N0F200958,M01AC003B4,\n" +
        //     //     "/M0158I06A,M03AJ0D4,N07J03C,M03CJ062,M02BJ05C,M016J036,M03CJ058,M013J0A6,M02E8I07C,M019J0C8,N0EC001B4,M015B01F58,N0B6ED2E,N06996D58,N05F7D6A,\n" +
        //     //     "/N032D3DE,O0DAD3,O065AE8,O01F78,Q08004,N04J04,M013J0BC,M02CJ052,M017J06C,M02CJ054,M01BJ03E,M036J05,M02AJ02E,M015J074,M03EJ0CE,M0118I038,\n" +
        //     //     "/M02F2001E6,M01AC00158,M015524EB4,N0EFDB5E8,N09936B1,N076E9EF,N02D5F1A,N01BAAF4,O0655A8,O01FF4,,R01,Q0348,N0A004B2,M01480B6C,M01B00DDB,\n" +
        //     //     "/M016013268,M03A01EFD,M0150354AC,M02A02BB78,M01E05E0A4,M03002905C,M02F076034,M01A0CC06A,M0358BA01C,N0F76402A,M014ADC074,M01BDA802A,\n" +
        //     //     "/N06B7005C,N0D6C807,N02D3004C,N01BC00B8,M02C,M012,M02DC8,M01B2,M036EE,N0D59C,M033B73,N0E6AE6,N01DD5D8,O033AAB,P0E7766,P01CCDD4,Q03BAA84,\n" +
        //     //     "/R06I78,P0921CCD6,O052903BAA,O095240676,N012ADA81CC,N02D52I03B,N05228J06,N04DC,N0B2,M014C,N09004,M0360016,N0803EC8,K020300D53A,K0DE200ABE4,\n" +
        //     //     "/K0A8003755F,J0174204AEB4,K0A8003D96B8,J015800537DE8,K0E8006EC294,J019I0B50178,J0178014F01A4,K0CI0F8007C,J01B8015600CA,J016801AC0034,K0D4035800DA,\n" +
        //     //     "/J01B802F40034,K0560548006A,K0ADDFB800DC,K0FB346I032,K026EBDI0EC,K05996AI054,K02F7D6001B8,K01AD38I064,L05ADI01D8,L02FAI0128\n" +
        //     //     "^FO50,50^GB700,1050,3^FS\n" +
        //     //     "^FO120,350^GB50,50,50,B^FS\n" +
        //     //     "^FO120,280^GB50,50,0,B^FS\n" +
        //     //     "^FT220,980^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sDeliveryDate + "^FS^CI27\n" +
        //     //     "^FT300,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sCustomername + sCustomerno + "^FS^CI27\n" +
        //     //     "^FT300,980^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sOrderno + "^FS^CI27\n" +
        //     //     "^FT200,680^A0B,59,59^FB1029,1,15,C^FH^CI28^FD" + sPallet + "^FS^CI27\n" +
        //     //     "^FT300,680^A0B,39,39^FB1029,1,15,C^FH^CI28^FD" + sRouteno + "^FS^CI27\n" +
        //     //     "^FT350,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sProddesc + sProdcode + "^FS^CI27\n" +
        //     //     "^FT400,1380^A0B,29,29^FB1029,1,15,C^FH^CI28^FD" + sPickSite + sProdLoc + "^FS^CI27\n" +
        //     //     "^FT470,1380^A0B,39,39^FB1029,1,15,C^FH^CI28^FD" + sUnitQty + " of " + sTotalQty + sExpUom + "^FS^CI27\n" +
        //     //     "^FT470,1280^A0B,19,19^FB1229,1,15,C^FH^CI28^FD" + sCatchWeight + "^FS^CI27\n" +
        //     //     "^FT470,1080^A0B,29,29^FB1229,1,15,C^FH^CI28^FD" + sDelPlatform + "^FS^CI27\n" +
        //     //     "^FT470,780^A0B,59,59^FB1229,1,15,C^FH^CI28^FD" + sDropno + "^FS^CI27\n" +
        //     //     "^XZ";

        //     var that = this;

        //     var printerModel = sap.ui.getCore().getModel('printerModel');
        //     var macAddress = "";
        //     if (printerModel !== undefined) {
        //         macAddress = printerModel.getProperty("/macAddress");
        //     } else {
        //         macAddress = this.connectedPrinter;
        //     }
        //     //if a macAddress exists in z table
        //     if (macAddress !== "") {
        //         //var macAddress = printerModel.getProperty("/macAddress");
        //         if (top.ble) {
        //             top.ble.readBondState(macAddress,
        //                 function (sBondState) {
        //                     if (sBondState == "bonded") {
        //                         that.fnPrintLabel(macAddress, sPickNStickLabel);
        //                     }
        //                     else {
        //                         that.fnBondAndPrint(macAddress, sPickNStickLabel);
        //                     }
        //                 },
        //                 function (oErrBondState) {
        //                     BusyIndicator.hide();
        //                     var oBundle = that.getView().getModel("i18n").getResourceBundle();
        //                     var sReadBondStateFailed = oBundle.getText("printFailed");
        //                     console.log(sReadBondStateFailed)
        //                 });
        //         }
        //         else {
        //             BusyIndicator.hide();
        //             var oBundle = that.getView().getModel("i18n").getResourceBundle();
        //             var sText_PPlugin = oBundle.getText("mToast_Pplugin");
        //             MessageToast.show(sText_PPlugin);
        //         }

        //     }
        //     else {
        //         BusyIndicator.hide();
        //         var oBundle = that.getView().getModel("i18n").getResourceBundle();
        //         var sText_NoPrinter = oBundle.getText("NoPrinter");
        //         //MessageBox.error(sText_NoPrinter);
        //         MessageToast.show(sText_NoPrinter);
        //         //possibly need to add prompt to do it here? only possible if user error
        //     }
        // },

        fnBondAndPrint: function (macAddress, labelTranslated) {
            var that = this;
            var oPoItem = that.getView().getModel("poLineItemModel").getData()[0];
            BusyIndicator.show(500);
            //var printerModel = sap.ui.getCore().getModel('printerModel');
            //var macAddress = printerModel.getProperty("/macAddress");

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
                    //MessageToast.show(sText_success + " " + success);
                    console.log(sText_success + " " + success);
                    //MessageBox.success(sText_success);
                    BusyIndicator.hide();
                }, function (fail) {
                    var oBundle = that.getView().getModel("i18n").getResourceBundle();
                    var sText_fail = oBundle.getText("msgToast_PrintFail");

                    /*when the device looses pairing, try to re-pair it */
                    var failText = "Could not connect to device: read failed, socket might closed or timeout, read ret: -1";
                    if (fail == failText) {
                        //that.fnBondAndReconnectPrinter();
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
                //var macAddress = sap.ui.getCore().getModel("printerModel").getProperty("/macAddress");
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
            sap.m.MessageBox.information(
                that.oBundle.getText("lbl"),
                {
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {
                            that.getOwnerComponent().getRouter().navTo("RouteInfo");
                        }
                    }.bind(that)
                }
            );
        },

        _callNextMarshelling: function (check) {
            return new Promise((resolve, reject) => {
                var sDest1 = "/palletiseservices/Palletise";
                var printLabelDetails = this.getOwnerComponent().getModel("printLabelDetails").getData();
                if (check == "print") {
                    var sUrl = this.appModulePath + sDest1 + "/suggestMove(" + "pickTaskID='" + printLabelDetails.results + "',wantToWrap=true)"
                }
                else {
                    var sUrl = this.appModulePath + sDest1 + "/suggestMove(" + "pickTaskID='" + printLabelDetails.results + "',wantToWrap=false)"
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