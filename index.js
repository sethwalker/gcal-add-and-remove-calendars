var control = document.getElementById("searchAddCal"),
    suggested,
    name,
    target,
    trigger;

setTimeout(function() {
    updatePlaceholder();
    orderBySelected();
}, 500);

function updatePlaceholder() {
    control.placeholder = "Add or remove a coworker's calendar";
}

function orderBySelected() {
    var list = document.querySelector("#calendars_fav .calList"),
        selected = document.querySelectorAll("#calendars_fav [aria-selected=true]");

    for(var i = selected.length - 1; i >= 0; i--) { 
        if (selected[i] !== list.children[i]) {
            list.insertBefore(selected[i], list.firstChild);
        }
    }
}

function dispatch() {
    if (target.parentElement.attributes["aria-selected"].value === "true") {
        trigger = new MouseEvent("mousedown", {bubbles: true, cancelable: true});
        target.dispatchEvent(trigger);
        updatePlaceholder();
        orderBySelected();
    }
}

control.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        dispatch();
        return;
    }
    try {
        suggested = document.querySelector(".ac-active")
        if (!suggested) {
            return;
        }
        parsed = emailAddresses.parseOneAddress(suggested.textContent);
        if (parsed) {
            name = '"' + parsed.name + '"';
        } else {
            name = suggested.textContent.replace(/ \(room\)$/, "");
        }

        if (name === "Searching for matches from Contacts") {
            return;
        }

        target = document.querySelector('[title=' + name + ']');
    } catch (e) {
        console.debug(suggested, name, target);
        throw e;
    }
});

var autocompleteObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].className === "ac-renderer") {
                mutation.addedNodes[i].addEventListener("click", function(e) {
                    dispatch();
                });
            }
        }
    });
});
autocompleteObserver.observe(document.querySelector("body"), {childList: true});

var lazyOrderBySelected = _.debounce(orderBySelected, 300);
var lazyUpdatePlaceholder = _.debounce(updatePlaceholder, 300);
var listObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        lazyUpdatePlaceholder();
        lazyOrderBySelected();
    });
});
listObserver.observe(document.querySelector("#calendars_fav .calList"), {childList: true});
