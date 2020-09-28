// Richie Guo 2020-09-16

import KGRouter from "./router"

const KGPage = function(JSON) {
    const _onLoad = JSON.onLoad;
    JSON.onLoad = function(options) {
        if (!options[KGRouter.optionsKey] || options[KGRouter.optionsKey] === KGRouter.optionsNull) {
            this[KGRouter.optionsKey] = KGRouter.getUniqueCode();
        } else {
            this[KGRouter.optionsKey] = options[KGRouter.optionsKey];
            delete options[KGRouter.optionsKey];
            if (options[KGRouter.optionsTypeKey]) {
                this[KGRouter.optionsTypeKey] = options[KGRouter.optionsTypeKey] || '';
                delete options[KGRouter.optionsTypeKey];
            }
        }
        if (this.onKGData) {
            const _kg_data = KGRouter.getDataFromPool(this[KGRouter.optionsKey]);
            if (_kg_data) {
                this.onKGData(_kg_data, _kg_data[KGRouter.dataTag] || this[KGRouter.optionsTypeKey]);
            }
            if (this[KGRouter.optionsTypeKey]) {
                delete this[KGRouter.optionsTypeKey];
            }
        }
        _onLoad && _onLoad.call(this, options);
    }
    return JSON;
}
export default KGPage;
