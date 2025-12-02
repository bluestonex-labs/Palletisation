sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/sysco/wm/palletisationui/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.sysco.wm.palletisationui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(new sap.ui.model.json.JSONModel({}), "selectedRecord");
            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});