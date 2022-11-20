const base = require("./base");
const { Text } = require("./element");

class Textbox extends base.TextboxBase {

    static write(window,bbox,self_config,text_line_config_list) {
        let textbox = new this(window,bbox,self_config);
        text_line_config_list.forEach((config) => { Text.write_line(textbox,config); });
        return textbox;
    }
}

module.exports = exports = {
    Textbox : Textbox
};
