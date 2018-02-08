chrome.storage.local.get(["storable_ids", "stackable_items"], data => {
    var storable_ids    = ("storable_ids"    in data) ? data.storable_ids   : [],
        salvageable_ids = ("salvageable_ids" in data) ? data.salvageable_ids: [],
        stackable_items = ("stackable_items" in data) ? data.stackable_items: {},
        items           = {};

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

    $.get("https://api.xivdb.com/npc/1006004", data => {
        data.shops.forEach(shop => {
            shop.items.forEach(item => {
                if (!item.lodestone_id || item.stack_size > 1) {
                    return;
                }

                salvageable_ids.push(item.lodestone_id);
            });
        });

        chrome.storage.local.set({"salvageable_ids": salvageable_ids});
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (storable_ids.length && salvageable_ids.length && Object.keys(stackable_items).length) {
            sendResponse({
                "storable_ids"   : storable_ids,
                "salvageable_ids": salvageable_ids,
                "stackable_items": stackable_items
            });
        }
    });
})