export class CanvasConfig {
    static width = 1050;
    static height = 600;
    static baseColor = [255, 255, 255];
    static disableClear = false;
    static params = {};

    static getQueryString() {
        const queryStringArray = window.location.search.substr(1).split('&');
        let params = {};
        for (let i = 0; i < queryStringArray.length; ++i) {
            const keyValue = queryStringArray[i].split('=', 2);
            if (keyValue.length > 1) {
                params[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
            } else if (keyValue.length === 1 && keyValue[0].length > 0) {
                params[keyValue[0]] = "";
            }
        }
        this.params = params;
        console.log('Configuration:', this);
    }
}
