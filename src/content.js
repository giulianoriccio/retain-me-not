var ns = (typeof browser == "undefined") ? chrome : browser;

ns.runtime.sendMessage({"call": "get_data"}, response => {
    if (typeof response === "undefined") {
        return;
    }

    var s = document.createElement('script');
    s.src = "https://img.finalfantasyxiv.com/lds/pc/global/js/eorzeadb/loader.js?v2";
    document.head.appendChild(s);

    var storable_names       = response.storable_names,
        salvageable_names    = response.salvageable_names,
        seasonal_names       = response.seasonal_names,
        stackables_max_size  = response.stackables_max_size;
        exclude_custom_equip = response.exclude_custom_equip,
        lower_items_quality  = response.lower_items_quality,
        lodestone_ids        = {},
        retainers_items      = {},
        report               = {
            "storables"   : {},
            "salvageables": {},
            "seasonals"   : {},
            "duplicates"  : {},
            "stackables"  : {}
        },
        i18n = {
            "en-gb": {
                "Storables (items you can store in your Armoire)"                       : "Storables (items you can store in your Armoire)",
                "Salvageables (items you can repurchase from the Calamity Salvager)"    : "Salvageables (items you can repurchase from the Calamity Salvager)",
                "Seasonals (items you can repurchase from the Recompense Officer *)"    : "Seasonals (items you can repurchase from the Recompense Officer *)",
                "* seasonal quest achievement required"                                 : "* seasonal quest achievement required",
                "Stackables (items you can stack together to reduce the occupied slots)": "Stackables (items you can stack together to reduce the occupied slots)",
                "Duplicates"                                                            : "Duplicates",
                "Storable"                                                              : "Storable",
                "Salvageable"                                                           : "Salvageable",
                "Seasonal"                                                              : "Seasonal",
                "Stackable"                                                             : "Stackable",
                "Retainers"                                                             : "Retainers",
                "Items"                                                                 : "Items",
                "Stacks (before)"                                                       : "Stacks (before)",
                "Stacks (after)"                                                        : "Stacks (after)"
            },
            "en-us": {
                "Storables (items you can store in your Armoire)"                       : "Storables (items you can store in your Armoire)",
                "Salvageables (items you can repurchase from the Calamity Salvager)"    : "Salvageables (items you can repurchase from the Calamity Salvager)",
                "Seasonals (items you can repurchase from the Recompense Officer *)"    : "Seasonals (items you can repurchase from the Recompense Officer *)",
                "* seasonal quest achievement required"                                 : "* seasonal quest achievement required",
                "Stackables (items you can stack together to reduce the occupied slots)": "Stackables (items you can stack together to reduce the occupied slots)",
                "Duplicates"                                                            : "Duplicates",
                "Storable"                                                              : "Storable",
                "Salvageable"                                                           : "Salvageable",
                "Seasonal"                                                              : "Seasonal",
                "Stackable"                                                             : "Stackable",
                "Retainers"                                                             : "Retainers",
                "Items"                                                                 : "Items",
                "Stacks (before)"                                                       : "Stacks (before)",
                "Stacks (after)"                                                        : "Stacks (after)"
            },
            "de": {
                "Storables (items you can store in your Armoire)"                       : "Storables (items you can store in your Armoire)", // TO-DO: translate
                "Salvageables (items you can repurchase from the Calamity Salvager)"    : "Salvageables (items you can repurchase from the Calamity Salvager)", // TO-DO: translate
                "Seasonals (items you can repurchase from the Recompense Officer *)"    : "Seasonals (items you can repurchase from the Recompense Officer *)", // TO-DO: translate
                "* seasonal quest achievement required"                                 : "* seasonal quest achievement required", // TO-DO: translate
                "Stackables (items you can stack together to reduce the occupied slots)": "Stackables (items you can stack together to reduce the occupied slots)", // TO-DO: translate
                "Duplicates"                                                            : "Duplicates", // TO-DO: translate
                "Storable"                                                              : "Lagerfähigen",
                "Salvageable"                                                           : "Salvageable", // TO-DO: translate
                "Seasonal"                                                              : "Seasonal", // TO-DO: translate
                "Stackable"                                                             : "Stackable", // TO-DO: translate
                "Retainers"                                                             : "Gehilfen",
                "Items"                                                                 : "Gegenstände",
                "Stacks (before)"                                                       : "Stapelzahl (vorher)",
                "Stacks (after)"                                                        : "Stapelzahl (danach)"
            },
            "fr": {
                "Storables (items you can store in your Armoire)"                       : "Stockable (objets que vous pouvez ranger dans votre Bahut)",
                "Salvageables (items you can repurchase from the Calamity Salvager)"    : "Consignable (objets que vous pouvez racheter au Consigneur)",
                "Seasonals (items you can repurchase from the Recompense Officer *)"    : "Saisonnier (objets que vous pouvez racheter au Responsable Des Récompenses *)",
                "* seasonal quest achievement required"                                 : "* haut-fait de l'événement saisonnier requis",
                "Stackables (items you can stack together to reduce the occupied slots)": "Empilable (objets que vous pouvez empiler ensemble pour réduire leur place)",
                "Duplicates"                                                            : "Doublons",
                "Storable"                                                              : "Stockable",
                "Salvageable"                                                           : "Consignable",
                "Seasonal"                                                              : "Saisonnier",
                "Stackable"                                                             : "Empilable",
                "Retainers"                                                             : "Servants",
                "Items"                                                                 : "Objets",
                "Stacks (before)"                                                       : "Piles (avant)",
                "Stacks (after)"                                                        : "Piles (après)"
            },
            "ja": {
                "Storables (items you can store in your Armoire)"                       : "Storables (items you can store in your Armoire)", // TO-DO: translate
                "Salvageables (items you can repurchase from the Calamity Salvager)"    : "Salvageables (items you can repurchase from the Calamity Salvager)", // TO-DO: translate
                "Seasonals (items you can repurchase from the Recompense Officer *)"    : "Seasonals (items you can repurchase from the Recompense Officer *)", // TO-DO: translate
                "* seasonal quest achievement required"                                 : "* seasonal quest achievement required", // TO-DO: translate
                "Stackables (items you can stack together to reduce the occupied slots)": "Stackables (items you can stack together to reduce the occupied slots)", // TO-DO: translate
                "Duplicates"                                                            : "Duplicates", // TO-DO: translate
                "Storable"                                                              : "Storable", // TO-DO: translate
                "Salvageable"                                                           : "Salvageable", // TO-DO: translate
                "Seasonal"                                                              : "Seasonal", // TO-DO: translate
                "Stackable"                                                             : "Stackable", // TO-DO: translate
                "Retainers"                                                             : "リテイナー",
                "Items"                                                                 : "アイテム",
                "Stacks"                                                                : "スタック",
                "Stacks (before)"                                                       : "スタック (前)",
                "Stacks (after)"                                                        : "スタック (上)"
            },
        },
        _ = i18n[document.documentElement.lang || "en-us"];

    document.body.classList.add("rmn_loaded");

    var tab_menu = document.querySelector(".tab__menu-a");
    tab_menu.classList.remove("tab__menu-2");
    tab_menu.classList.add("tab__menu-3");
    tab_menu.insertAdjacentHTML("beforeend", "<li><a class=\"sys_tab-change-trigger__trigger\" href=\"javascript:void(0);\">Retain Me Not</a></li>");

    var tabs_content = document.querySelectorAll(".sys_retainer-content");
    tabs_content[tabs_content.length - 1].insertAdjacentHTML(
        "afterend",
        Sanitizer.escapeHTML`
            <div name="tab__rmn" class="retainer__content sys_retainer-content">
                <h3 class="heading--md">${_["Storables (items you can store in your Armoire)"]}</h3>
                <ul class="item-list__header">
                    <li class="item-list__header__cell item-list__header__rmn-storable--name">${_["Items"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-storable--retainers">${_["Retainers"]}</li>
                </ul>
                <ul class="item-list--storable">
                </ul>
                <h3 class="heading--md">${_["Salvageables (items you can repurchase from the Calamity Salvager)"]}</h3>
                <ul class="item-list__header">
                    <li class="item-list__header__cell item-list__header__rmn-salvageable--name">${_["Items"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-salvageable--retainers">${_["Retainers"]}</li>
                </ul>
                <ul class="item-list--salvageable">
                </ul>
                <h3 class="heading--md">${_["Seasonals (items you can repurchase from the Recompense Officer *)"]}<div class="heading--sm" style="padding: 0">${_["* seasonal quest achievement required"]}</div></h3>
                <ul class="item-list__header">
                    <li class="item-list__header__cell item-list__header__rmn-seasonal--name">${_["Items"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-seasonal--retainers">${_["Retainers"]}</li>
                </ul>
                <ul class="item-list--seasonal">
                </ul>
                <h3 class="heading--md">${_["Stackables (items you can stack together to reduce the occupied slots)"]}</h3>
                <ul class="item-list__header">
                    <li class="item-list__header__cell item-list__header__rmn-stackable--name">${_["Items"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-stackable--retainers">${_["Retainers"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-stackable--stacks-before">${_["Stacks (before)"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-stackable--stacks-after">${_["Stacks (after)"]}</li>
                </ul>
                <ul class="item-list--stackable">
                </ul>
                <h3 class="heading--md">${_["Duplicates"]}</h3>
                <ul class="item-list__header">
                    <li class="item-list__header__cell item-list__header__rmn-duplicate--name">${_["Items"]}</li>
                    <li class="item-list__header__cell__spacer"></li>
                    <li class="item-list__header__cell item-list__header__rmn-duplicate--retainers">${_["Retainers"]}</li>
                </ul>
                <ul class="item-list--duplicate">
                </ul>
            </div>`
    );

    var storables_list    = document.querySelector(".item-list--storable"),
        salvageables_list = document.querySelector(".item-list--salvageable"),
        seasonals_list    = document.querySelector(".item-list--seasonal"),
        stackables_list   = document.querySelector(".item-list--stackable"),
        duplicates_list   = document.querySelector(".item-list--duplicate");

    // lodestone copypasta script
    $(".sys_tab-change-trigger__trigger").click(function(){
        var num = $(".sys_tab-change-trigger a").index($(this));
        $(".sys_tab-change-trigger a,.sys_retainer-content").removeClass("active");
        $(this).addClass("active");
        $(".sys_retainer-content").eq(num).addClass("active");
    });

    document.querySelector(".item-list__header").insertAdjacentHTML(
        "beforeend",
        Sanitizer.escapeHTML`
            <li class="item-list__header__cell__spacer"></li><li class="item-list__header__cell item-list__header__retainer--storable">${_["Storable"]}</li>
            <li class="item-list__header__cell__spacer"></li><li class="item-list__header__cell item-list__header__retainer--salvageable">${_["Salvageable"]}</li>
            <li class="item-list__header__cell__spacer"></li><li class="item-list__header__cell item-list__header__retainer--seasonal">${_["Seasonal"]}</li>
        `
    );

    document.querySelectorAll(".item-list__list").forEach(item => {
        var lodestone_name = item.querySelector(".item-list__name--inline a").textContent,
            lodestone_id   = item.querySelector(".item-list__name--inline a").href.match(/db\/item\/([a-z0-9]+)\//)[1];
            hq             = item.querySelector(".ic_item_quality") !== null;

        lodestone_ids[lodestone_name] = lodestone_id;

        if (exclude_custom_equip
            && (
                item.querySelector(".staining") && item.querySelector(".staining").style.background != ""
                || item.querySelector(".mirage_staining")
            )
            && !(lodestone_name in stackables_max_size)
        ) {
            item.insertAdjacentHTML("beforeend", `
                <div class="item-list__storable">---</div>
                <div class="item-list__salvageable">---</div>
                <div class="item-list__seasonal">---</div>
            `);
        } else {
            if (storable_names.indexOf(lodestone_name) !== -1) {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__storable storable_sign--1"></div>`);
            } else {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__storable storable_sign--0"></div>`);
            }

            if (salvageable_names.indexOf(lodestone_name) !== -1) {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__salvageable salvageable_sign--1"></div>`);
            } else {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__salvageable salvageable_sign--0"></div>`);
            }

            if (seasonal_names.indexOf(lodestone_name) !== -1) {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__seasonal seasonal_sign--1"></div>`);
            } else {
                item.insertAdjacentHTML("beforeend", `<div class="item-list__seasonal seasonal_sign--0"></div>`);
            }
        }
    });

    var promises  = [],
        processed = 0;

    document.querySelectorAll(".parts__switch__link").forEach(retainer => {
        var url           = retainer.href != location ? retainer.href : "data:text/html;charset=UTF-8," + encodeURIComponent(document.querySelector(".sys_item_list").outerHTML),
            retainer_name = retainer.textContent.toString();

        retainers_items[retainer_name] = {};

        promises.push($.get(url, response => {
            (new DOMParser()).parseFromString(response, "text/html").querySelectorAll(".item-list__list").forEach(item => {
                var lodestone_name = item.querySelector(".item-list__name--inline a").textContent,
                    lodestone_id   = item.querySelector(".item-list__name--inline a").href.match(/db\/item\/([a-z0-9]+)\//)[1];
                    hq             = item.querySelector(".ic_item_quality") !== null,
                    quantity       = parseInt(item.querySelector(".item-list__number").textContent);

                lodestone_ids[lodestone_name] = lodestone_id;

                if (exclude_custom_equip
                    && (
                        item.querySelector(".staining") && item.querySelector(".staining").style.background != ""
                        || item.querySelector(".mirage_staining")
                    )
                    && !(lodestone_name in stackables_max_size)
                ) {
                    return;
                }

                if (storable_names.indexOf(lodestone_name) !== -1) {
                    if (!(lodestone_name in report.storables)) {
                        report.storables[lodestone_name] = {};
                    }

                    if (!(retainer_name in report.storables[lodestone_name])) {
                        report.storables[lodestone_name][retainer_name] = 0;
                    }

                    ++ report.storables[lodestone_name][retainer_name];
                }

                if (salvageable_names.indexOf(lodestone_name) !== -1) {
                    if (!(lodestone_name in report.salvageables)) {
                        report.salvageables[lodestone_name] = {};
                    }

                    if (!(retainer_name in report.salvageables[lodestone_name])) {
                        report.salvageables[lodestone_name][retainer_name] = 0;
                    }

                    ++ report.salvageables[lodestone_name][retainer_name];
                }

                if (seasonal_names.indexOf(lodestone_name) !== -1) {
                    if (!(lodestone_name in report.seasonals)) {
                        report.seasonals[lodestone_name] = {};
                    }

                    if (!(retainer_name in report.seasonals[lodestone_name])) {
                        report.seasonals[lodestone_name][retainer_name] = 0;
                    }

                    ++ report.seasonals[lodestone_name][retainer_name];
                }

                if (!(lodestone_name in retainers_items[retainer_name])) {
                    retainers_items[retainer_name][lodestone_name] = {
                        "nq": [],
                        "hq": []
                    };
                }

                retainers_items[retainer_name][lodestone_name][hq ? "hq" : "nq"].push(quantity);
            });

            ++ processed;

            if (processed > 1) {
                document.querySelector(".rmn_processed").remove();
            }

            if (processed < promises.length) {
                document.querySelector(".sys_tab-change-trigger__trigger").insertAdjacentHTML("beforeend", Sanitizer.escapeHTML` <span class="rmn_processed">(${processed}/${promises.length})</span>`);
            }
        }));
    });

    $.when.apply($, promises).done(() => {
        Object.keys(retainers_items).forEach(retainer => {
            var items = retainers_items[retainer];

            Object.keys(items).forEach(lodestone_name => {
                var stacks = items[lodestone_name];

                Object.keys(retainers_items).forEach(other_retainer => {
                    var other_items = retainers_items[other_retainer];

                    if (!(lodestone_name in other_items)) {
                        return;
                    }

                    if (lodestone_name in stackables_max_size) {
                        if (!(lodestone_name in report.stackables)) {
                            report.stackables[lodestone_name] = {};
                        }

                        report.stackables[lodestone_name][retainer]       = stacks;
                        report.stackables[lodestone_name][other_retainer] = other_items[lodestone_name];
                    } else {
                        if (retainer == other_retainer) {
                            return;
                        }

                        if (!(lodestone_name in report.duplicates)) {
                            report.duplicates[lodestone_name] = {};
                        }

                        if (!(retainer in report.duplicates[lodestone_name])) {
                            report.duplicates[lodestone_name][retainer] = stacks.nq.reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0)
                                                                        + stacks.hq.reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0);
                        }

                        if (!(other_retainer in report.duplicates[lodestone_name])) {
                            report.duplicates[lodestone_name][other_retainer] = other_items[lodestone_name].nq.reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0)
                                                                              + other_items[lodestone_name].hq.reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0);
                        }
                    }
                });
            });
        });

        Object.keys(report.storables).forEach(lodestone_name => {
            storables_list.insertAdjacentHTML(
                "beforeend",
                Sanitizer.escapeHTML`
                    <li class="item-list__list">
                        <div class="item-list__name">
                            <h4 class="item-list__name--inline item-list__relative">
                                <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name}</a>
                            </h4>
                        </div>
                        <ul class="item-list__name item-list__rmn-storable-retainers">` +
                            Object.keys(report.storables[lodestone_name]).map(retainer => `<li>${retainer} (${report.storables[lodestone_name][retainer]})</li>`).join("") + Sanitizer.escapeHTML`
                        </ul>
                    </li>
                `
            );
        });

        Object.keys(report.salvageables).forEach(lodestone_name => {
            salvageables_list.insertAdjacentHTML(
                "beforeend",
                Sanitizer.escapeHTML`
                    <li class="item-list__list">
                        <div class="item-list__name">
                            <h4 class="item-list__name--inline item-list__relative">
                                <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name}</a>
                            </h4>
                        </div>
                        <ul class="item-list__name item-list__rmn-salvageable-retainers">` +
                            Object.keys(report.salvageables[lodestone_name]).map(retainer => `<li>${retainer} (${report.salvageables[lodestone_name][retainer]})</li>`).join("") + Sanitizer.escapeHTML`
                        </ul>
                    </li>
                `
            );
        });

        Object.keys(report.seasonals).forEach(lodestone_name => {
            seasonals_list.insertAdjacentHTML(
                "beforeend",
                Sanitizer.escapeHTML`
                    <li class="item-list__list">
                        <div class="item-list__name">
                            <h4 class="item-list__name--inline item-list__relative">
                                <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name}</a>
                            </h4>
                        </div>
                        <ul class="item-list__name item-list__rmn-seasonal-retainers">` +
                            Object.keys(report.seasonals[lodestone_name]).map(retainer => `<li>${retainer} (${report.seasonals[lodestone_name][retainer]})</li>`).join("") + Sanitizer.escapeHTML`
                        </ul>
                    </li>
                `
            );
        });

        Object.keys(report.stackables).forEach(lodestone_name => {
            var retainers        = report.stackables[lodestone_name],
                stackables_stats = {
                    "nq": {
                        "quantity"    : 0,
                        "total_stacks": 0,
                        "min_stacks"  : 0
                    },
                    "hq": {
                        "quantity"    : 0,
                        "total_stacks": 0,
                        "min_stacks"  : 0
                    },
                    "fnq": {
                        "quantity"    : 0,
                        "total_stacks": 0,
                        "min_stacks"  : 0
                    }
                };

            ["nq", "hq"].forEach(quality => {
                Object.keys(retainers).forEach(retainer => {
                    var stacks = retainers[retainer];

                    stackables_stats[quality].total_stacks += stacks[quality].length;
                    stackables_stats["fnq"].total_stacks   += stacks[quality].length;
                    stackables_stats[quality].quantity     += stacks[quality].reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0);
                    stackables_stats["fnq"].quantity       += stacks[quality].reduce((total_quantity, current_quantity) => total_quantity + current_quantity, 0);
                });

                stackables_stats[quality].min_stacks = Math.ceil(stackables_stats[quality].quantity / stackables_max_size[lodestone_name]);
                stackables_stats["fnq"].min_stacks   = Math.ceil(stackables_stats["fnq"].quantity / stackables_max_size[lodestone_name]);

                var retainers_list = Object.keys(retainers).map(retainer => retainers[retainer][quality].map(stack_quantity => {
                    if (stack_quantity == stackables_max_size[lodestone_name]) {
                        -- stackables_stats[quality].total_stacks;
                        -- stackables_stats["fnq"].total_stacks;
                        -- stackables_stats[quality].min_stacks;
                        -- stackables_stats["fnq"].min_stacks;

                        return "";
                    }

                    return Sanitizer.escapeHTML`<li>${retainer} (${stack_quantity})</li>`;
                }).join("")).join("");

                if (stackables_stats[quality].min_stacks < stackables_stats[quality].total_stacks) {
                    stackables_list.insertAdjacentHTML(
                        "beforeend",
                        Sanitizer.escapeHTML`
                            <li class="item-list__list">
                                <div class="item-list__name">
                                    <h4 class="item-list__name--inline item-list__relative">
                                        <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name}${quality == "hq" ? " (HQ)" : ""}</a>
                                    </h4>
                                </div>
                                <ul class="item-list__name item-list__rmn-stackable-retainers">` +
                                    retainers_list + Sanitizer.escapeHTML`
                                </ul>
                                <p class="item-list__number item-list__rmn-stackable-total-stacks">${stackables_stats[quality].total_stacks}</p>
                                <p class="item-list__number item-list__rmn-stackable-min-stacks">${stackables_stats[quality].min_stacks}</p>
                            </li>
                        `
                    );
                }
            });

            if (lower_items_quality && stackables_stats.nq.min_stacks + stackables_stats.hq.min_stacks > stackables_stats.fnq.min_stacks) {
                var retainers_list = Object.keys(retainers).map(retainer => {
                    return ["nq", "hq"].map(quality => {
                        return retainers[retainer][quality].map(stack_quantity => {
                            if (stack_quantity == stackables_max_size[lodestone_name]) {
                                return "";
                            }

                            return Sanitizer.escapeHTML`<li>${retainer} (${stack_quantity}${quality == "hq" ? " HQ" : ""})</li>`;
                        }).join("")
                    }).join("");
                }).join("");

                stackables_list.insertAdjacentHTML(
                    "beforeend",
                    Sanitizer.escapeHTML`
                        <li class="item-list__list">
                            <div class="item-list__name">
                                <h4 class="item-list__name--inline item-list__relative">
                                    <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name} (HQ⇒NQ)</a>
                                </h4>
                            </div>
                            <ul class="item-list__name item-list__rmn-stackable-retainers">` +
                                retainers_list + Sanitizer.escapeHTML`
                            </ul>
                            <p class="item-list__number item-list__rmn-stackable-total-stacks">${stackables_stats["fnq"].total_stacks}</p>
                            <p class="item-list__number item-list__rmn-stackable-min-stacks">${stackables_stats["fnq"].min_stacks}</p>
                        </li>
                    `
                );
            }
        });

        Object.keys(report.duplicates).forEach(lodestone_name => {
            duplicates_list.insertAdjacentHTML(
                "beforeend",
                Sanitizer.escapeHTML`
                    <li class="item-list__list">
                        <div class="item-list__name">
                            <h4 class="item-list__name--inline item-list__relative">
                                <a class="eorzeadb_link" href="${document.location.origin}/lodestone/playguide/db/item/${lodestone_ids[lodestone_name]}/">${lodestone_name}</a>
                            </h4>
                        </div>
                        <ul class="item-list__name item-list__rmn-duplicate-retainers">` +
                            Object.keys(report.duplicates[lodestone_name]).map(retainer => `<li>${retainer} (${report.duplicates[lodestone_name][retainer]})</li>`).join("") + Sanitizer.escapeHTML`
                        </ul>
                    </li>
                `
            );
        });

        [storables_list, salvageables_list, seasonals_list, stackables_list, duplicates_list].forEach(list => {
            if (!list.querySelector(".item-list__list")) {
                list.insertAdjacentHTML(
                    "beforeend",
                    `<li class="item-list__list">
                        <div class="item-list__name">
                            <h4 class="item-list__name--inline item-list__relative">---</h4>
                        </div>
                    </li>`
                );
            }
        });
    });
});
