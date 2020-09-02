function Translator(){
    var default_lang = "fr"
    var _this = this;
    this.fr = {
        "month0": "janvier",
        "month1": "février",
        "month2": "mars",
        "month3": "avril",
        "month4": "mai",
        "month5": "juin",
        "month6": "juillet",
        "month7": "août",
        "month8": "septembre",
        "month9": "octobre",
        "month10": "novembre",
        "month11": "décembre"
    };
    this.get = function(str, lang=default_lang){
        if(!_this[lang] || !_this[lang][str]){
            console.log(str + " not translated");
            return str;
        }
        return _this[lang][str];
    }
}