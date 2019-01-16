var ns = (typeof browser == "undefined") ? chrome : browser;

document.addEventListener(
    "DOMContentLoaded",
    () => ns.storage.local.get(
        {
            "exclude_custom_equip": false,
            "lower_items_quality" : true
        },
        options => {
            document.getElementById("exclude_custom_equip").checked = options.exclude_custom_equip;
            document.getElementById("lower_items_quality").checked  = options.lower_items_quality;
        }
    )
);

document.getElementById("exclude_custom_equip").addEventListener(
    "change",
    () => ns.storage.local.set({"exclude_custom_equip": document.getElementById("exclude_custom_equip").checked}, () => ns.runtime.sendMessage({"call": "refresh_options"}))
);
document.getElementById("lower_items_quality").addEventListener(
    "change",
    () => ns.storage.local.set({"lower_items_quality": document.getElementById("lower_items_quality").checked}, () => ns.runtime.sendMessage({"call": "refresh_options"}))
);