// placeholder - change when changing resolution
window.onload = changePlaceholder;
window.onresize = changePlaceholder;

function changePlaceholder() {
    // js
    if (document.documentElement.clientWidth < 758) {
        document.getElementById('newsletter').setAttribute("placeholder", "Subscribe to newsletter");
    } else {
        document.getElementById('newsletter').setAttribute("placeholder", "Enter your email address");
    }
}
