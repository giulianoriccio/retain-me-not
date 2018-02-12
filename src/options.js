var ns = (typeof browser == "undefined") ? chrome : browser;

document.addEventListener(
    "DOMContentLoaded",
    () => ns.storage.local.get(
        {"exclude_custom_equip": false},
        options => document.getElementById("exclude_custom_equip").checked = options.exclude_custom_equip
    )
);
document.getElementById("exclude_custom_equip").addEventListener(
    "change",
    () => ns.storage.local.set({"exclude_custom_equip": document.getElementById("exclude_custom_equip").checked}, () => ns.runtime.sendMessage({"call": "refresh_options"}))
);