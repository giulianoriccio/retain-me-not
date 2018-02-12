document.addEventListener(
    "DOMContentLoaded",
    () => chrome.storage.local.get(
        {"exclude_custom_equip": false},
        options => document.getElementById("exclude_custom_equip").checked = options.exclude_custom_equip
    )
);
document.getElementById("exclude_custom_equip").addEventListener(
    "change",
    () => chrome.storage.local.set({"exclude_custom_equip": document.getElementById("exclude_custom_equip").checked}, () => chrome.runtime.sendMessage({"call": "refresh_options"}))
);