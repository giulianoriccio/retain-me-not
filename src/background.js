var ns = typeof browser == "undefined" ? chrome : browser;var ns = (typeof browser == "undefined") ? chrome : browser;

var xivapi = {
        "key"         : '0e1339f00eb14023a206afef',
        "max_requests": 5,
        "delay"       : 500,
        "max_results" : 3000
    },
    salvageable_items_urls = [
        'https://de.finalfantasyxiv.com/lodestone/playguide/db/shop/9d03aec955c/',
        'https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/9d03aec955c/',
        'https://fr.finalfantasyxiv.com/lodestone/playguide/db/shop/9d03aec955c/',
        'https://jp.finalfantasyxiv.com/lodestone/playguide/db/shop/9d03aec955c/'
    ],
    seasonal_items_urls = [
        'https://de.finalfantasyxiv.com/lodestone/playguide/db/shop/0ba5004ab8e/',
        'https://na.finalfantasyxiv.com/lodestone/playguide/db/shop/0ba5004ab8e/',
        'https://fr.finalfantasyxiv.com/lodestone/playguide/db/shop/0ba5004ab8e/',
        'https://jp.finalfantasyxiv.com/lodestone/playguide/db/shop/0ba5004ab8e/'
    ],
    storable_names       = [],
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

    var stackablesPage   = 1,
        purchasablesPage = 1;

    var scanStackables = () => {
        $.get("https://xivapi.com/search?indexes=Item&columns=Name_*,StackSize&filters=StackSize%3E1,StackSize%3C1000&limit=" + xivapi.max_results + "&page=" + stackablesPage + "&key=" + xivapi.key , data => {
            stackablesPage = data.Pagination.PageNext;

            Object.keys(data.Results).forEach(index => {
                stackables_max_size[data.Results[index].Name_de] = data.Results[index].StackSize;
                stackables_max_size[data.Results[index].Name_en] = data.Results[index].StackSize;
                stackables_max_size[data.Results[index].Name_fr] = data.Results[index].StackSize;
                stackables_max_size[data.Results[index].Name_ja] = data.Results[index].StackSize;
            });
        }).done(() => {
            if (stackablesPage != null) {
                setTimeout(scanStackables, (stackablesPage - 1) % xivapi.max_requests == 0 ? xivapi.delay : 0);
            } else {
                ns.storage.local.set({"stackables_max_size": stackables_max_size});
                scanPurchasables();
            }
        })
    };

    var scanPurchasables = () => {
        $.get("https://xivapi.com/search?indexes=Item&columns=Name_*,GameContentLinks.GilShopItem.Item&filters=GameContentLinks.GilShopItem.Item%3E0&limit=" +  xivapi.max_results + "&page=" + purchasablesPage + "&key=" + xivapi.key , data => {
            purchasablesPage = data.Pagination.PageNext;

            Object.keys(data.Results).forEach(index => {
                purchasable_names.push(data.Results[index].Name_de);
                purchasable_names.push(data.Results[index].Name_en);
                purchasable_names.push(data.Results[index].Name_fr);
                purchasable_names.push(data.Results[index].Name_ja);
            });
        }).done(() => {
            if (purchasablesPage != null) {
                setTimeout(scanPurchasables, (purchasablesPage - 1) % xivapi.max_requests == 0 ? xivapi.delay : 0);
            } else {
                ns.storage.local.set({"purchasable_names": purchasable_names});console.log(purchasable_names);
            }
        });
    };

    scanStackables();

    $.get("https://xivapi.com/Cabinet?columns=Item.Name_*&limit=3000&key=" + xivapi.key , data => {
        Object.keys(data.Results).forEach(index => {
            storable_names.push(data.Results[index].Item.Name_de);
            storable_names.push(data.Results[index].Item.Name_en);
            storable_names.push(data.Results[index].Item.Name_fr);
            storable_names.push(data.Results[index].Item.Name_ja);
        });

        ns.storage.local.set({"storable_names": storable_names});
    });

    var salvageable_promises = [];

    salvageable_items_urls.forEach(url => {
        salvageable_promises.push($.get(url, response => {
            (new DOMParser()).parseFromString(response, "text/html").querySelectorAll("#sys_shop_type_gil a.db_popup").forEach(item => {
                salvageable_names.push(item.textContent);
            });
        }));
    });

    $.when.apply($, salvageable_promises).done(() => ns.storage.local.set({"salvageable_names": salvageable_names}));

    var seasonal_promises = [];

    seasonal_items_urls.forEach(url => {
        seasonal_promises.push($.get(url, response => {
            (new DOMParser()).parseFromString(response, "text/html").querySelectorAll("#sys_shop_type_gil a.db_popup").forEach(item => {
                seasonal_names.push(item.textContent);
            });
        }));
    });

    $.when.apply($, seasonal_promises).done(() => ns.storage.local.set({"seasonal_names": seasonal_names}));

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