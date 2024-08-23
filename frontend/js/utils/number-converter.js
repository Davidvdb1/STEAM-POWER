function formatNumberBelgianStyle(number) {
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (parts[1]) {
        parts[1] = parts[1].replace(/\./g, ","); // Just in case the decimal part contains periods (not common in JS)
    }
    return parts.join(",");
}

export default formatNumberBelgianStyle;