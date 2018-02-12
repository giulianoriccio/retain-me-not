var storable_ids         = [],
    salvageable_ids      = [],
    seasonal_ids         = [],
    stackable_items      = {},
    exclude_custom_equip = false;

chrome.storage.local.get({"storable_ids": [], "salvageable_ids": {}, "seasonal_ids": [], "stackable_items": {}, "exclude_custom_equip": false}, data => {
    storable_ids         = data.storable_ids;
    salvageable_ids      = data.salvageable_ids;
    seasonal_ids         = data.seasonal_ids;
    stackable_items      = data.stackable_items;
    exclude_custom_equip = data.exclude_custom_equip;

    var items = {};

    $.get("https://api.xivdb.com/item?columns=id,lodestone_id,stack_size", data => {
        data.forEach(item => {
            if (!item.lodestone_id) {
                return;
            }

            items[item.id] = item.lodestone_id;

            if (item.stack_size > 1 && item.stack_size < 1000) {
                stackable_items[item.lodestone_id] = item.stack_size;
            }
        });

        chrome.storage.local.set({"stackable_items": stackable_items});

        $.get("https://api.xivdb.com/data/armoire", data => {
            Object.keys(data).forEach(index => {
                if (!(data[index].item in items)) {
                    return;
                }

                storable_ids.push(items[data[index].item]);
            });

            chrome.storage.local.set({"storable_ids": storable_ids});
        }).always(() => { items = undefined; });
    });

    $.get("https://eu.finalfantasyxiv.com/lodestone/playguide/db/shop/9d03aec955c/", response => {
        (new DOMParser()).parseFromString(response, "text/html").querySelectorAll("#sys_shop_type_gil a.db_popup").forEach(item => {
            salvageable_ids.push(item.href.match(/db\/item\/([a-z0-9]+)\//)[1]);
        });

        chrome.storage.local.set({"salvageable_ids": salvageable_ids});
    });

    $.get("https://eu.finalfantasyxiv.com/lodestone/playguide/db/shop/0ba5004ab8e/", response => {
        (new DOMParser()).parseFromString(response, "text/html").querySelectorAll("#sys_shop_type_gil a.db_popup").forEach(item => {
            seasonal_ids.push(item.href.match(/db\/item\/([a-z0-9]+)\//)[1]);
        });

        chrome.storage.local.set({"seasonal_ids": seasonal_ids});
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.call) {
            case "get_data":
                if (storable_ids.length && salvageable_ids.length && Object.keys(stackable_items).length) {
                    sendResponse({
                        "storable_ids"        : storable_ids,
                        "salvageable_ids"     : salvageable_ids,
                        "seasonal_ids"        : seasonal_ids,
                        "stackable_items"     : stackable_items,
                        "exclude_custom_equip": exclude_custom_equip
                    });
                }

                break;
            case "refresh_options":
                chrome.storage.local.get({"exclude_custom_equip": false}, data => {
                    exclude_custom_equip = data.exclude_custom_equip;
                });

                break;
        }
    });
});