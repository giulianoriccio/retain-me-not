var ns = typeof browser == "undefined" ? chrome : browser;var ns = (typeof browser == "undefined") ? chrome : browser;

var storable_names       = [],
    salvageable_names    = [],
    seasonal_names       = [],
    purchasable_names    = [],
    stackables_max_size  = {},
    exclude_custom_equip = false;
    lower_items_quality  = true;

// remove old data (<1.3.0)
ns.storage.local.remove(["storable_ids", "salvageable_ids", "seasonal_ids", "stackable_items"]);
ns.storage.local.get({"storable_names": [], "salvageable_names": [], "seasonal_names": [], "purchasable_names": [], "stackables_max_size": {}, "exclude_custom_equip": false, "lower_items_quality": true}, data => {
    storable_names       = data.storable_names;
    salvageable_names    = data.salvageable_names;
    seasonal_names       = data.seasonal_names;
    purchasable_names    = data.purchasable_names;
    stackables_max_size  = data.stackables_max_size;
    exclude_custom_equip = data.exclude_custom_equip;
    lower_items_quality  = data.lower_items_quality;

    $.get("https://retainmenot.ffxivaddons.com/data.json", data => {
        storable_names      = data.storable_names;
        salvageable_names   = data.salvageable_names;
        seasonal_names      = data.seasonal_names;
        purchasable_names   = data.purchasable_names;
        stackables_max_size = data.stackables_max_size;

        ns.storage.local.set({"storable_names"     : storable_names});
        ns.storage.local.set({"salvageable_names"  : salvageable_names});
        ns.storage.local.set({"seasonal_names"     : seasonal_names});
        ns.storage.local.set({"purchasable_names"  : purchasable_names});
        ns.storage.local.set({"stackables_max_size": stackables_max_size});
    });

    ns.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.call) {
            case "get_data":
                if (storable_names.length && salvageable_names.length && Object.keys(stackables_max_size).length) {
                    sendResponse({
                        "storable_names"      : storable_names,
                        "salvageable_names"   : salvageable_names,
                        "seasonal_names"      : seasonal_names,
                        "purchasable_names"   : purchasable_names,
                        "stackables_max_size" : stackables_max_size,
                        "exclude_custom_equip": exclude_custom_equip,
                        "lower_items_quality" : lower_items_quality
                    });
                }

                break;
            case "refresh_options":
                ns.storage.local.get(
                    {
                        "exclude_custom_equip": false,
                        "lower_items_quality" : true
                    },
                    data => {
                        exclude_custom_equip = data.exclude_custom_equip;
                        lower_items_quality  = data.lower_items_quality;
                    }
                );

                break;
        }
    });
});

ns.browserAction.onClicked.addListener(() => ns.runtime.openOptionsPage());