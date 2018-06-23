export function EnableBodyScroll() {
    var bodyStyle = document.getElementsByTagName('body')[0].style;
    bodyStyle.setProperty('overflow', 'scroll');
    bodyStyle.setProperty('padding-right', '0px'); // Account for the Scroll bar width.
}

export function DisableBodyScroll() {
    var bodyStyle = document.getElementsByTagName('body')[0].style;
    bodyStyle.setProperty('overflow', 'hidden');
    bodyStyle.setProperty('padding-right', '5px'); // Account for the Scroll bar width.
}