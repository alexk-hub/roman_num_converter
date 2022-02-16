document.addEventListener("DOMContentLoaded", function() {

    var input = document.querySelector("#input");
    var calc = document.querySelector("#calc");
    var clear = document.querySelector("#clear");
    var answer = document.querySelector(".answer");
    var numbers = { _M: 1000000, _C_M: 900000, _D: 500000, _C_D: 400000, _C: 100000, _X_C: 90000, _L: 50000, _X_L: 40000, _X: 10000, _I_X: 9000, _V: 5000, _I_V: 4000, M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };

    class RomanView {
        render(result) {
            answer.innerHTML = result;
        }
    }

    class ArabicView {
        render(symbols, result) {
            answer.innerHTML = symbols + " = " + result;
        }
    }

    class RomanModel {
        constructor(romanView) {
            this.romanView = romanView;
        }

        convertToRoman(num) {
            let overlinedNum = '';
            let normalNum = '';

            while (num >= 1) {
                if (num > 3999) {
                    for (let i in numbers) {
                        while (num > 3999 && num >= numbers[i]) {
                            overlinedNum += i.replace(/_/g, '');;
                            num -= numbers[i];
                        }
                    }
                } else {
                    for (let i in numbers) {
                        while (num >= numbers[i]) {
                            normalNum += i;
                            num -= numbers[i];
                        }
                    }
                }
            }
            var resultRoman = ((overlinedNum != '') ? "<span>" + overlinedNum + "</span>" : '') + normalNum;

            return resultRoman;
        }

        initRender(resultRoman) {
            this.romanView.render(resultRoman);
            answer.style.color = "black";
        }
    }

    class ArabicModel {
        constructor(arabicView) {
            this.arabicView = arabicView;
        }

        convertToArabic(num, found) {
            for (let i = 0; i < found.length; i++) {
                for (let j in numbers) {
                    if (found[i] == j.toLowerCase()) {
                        found[i] = numbers[j];
                    }
                }
            }

            var sum = 0;
            found.forEach(function(n) {
                sum += n;
            });

            return sum
        }
        initRender(symbols, result) {
            this.arabicView.render(symbols, result);
            answer.style.color = "black";
        }
    }

    class MainController {
        constructor(romanModel, arabicModel) {
            this.romanModel = romanModel;
            this.arabicModel = arabicModel;
            this.converter = this.converter.bind(this);
        }
        converter() {
            const regex = /(m|_m)|(cm|_c_m)|(d|_d)|(cd|_c_d)|(c|_c)|(xc|_x_c)|(l|_l)|(xl|_x_l)|(x|_x)|(ix|_i_x)|(v|_v)|(iv|_i_v)|(m)|(cm)|(d)|(cd)|(c)|(xc)|(l)|(xl)|(x)|(ix)|(v)|(iv)|(i)/gi;

            const errReg = /^((_M){0,3})((_C_M|_C_D|_D)?(_C){0,3})((_X_C|_X_L|_L)?(_X){0,3})((_I_X|_I_V|_V)?)(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/gi;

            const test = errReg.test(input.value);

            var found = input.value.toLowerCase().match(regex);

            if (input.value != "") {
                if (input.value == +input.value && input.value >= 1 && input.value <= 3999999) {
                    this.romanModel.initRender(this.romanModel.convertToRoman(input.value));
                } else if (test == true) {
                    this.arabicModel.initRender(this.romanModel.convertToRoman(this.arabicModel.convertToArabic(input.value, found)), this.arabicModel.convertToArabic(input.value, found));
                } else {
                    answer.innerHTML = "Enter a valid Roman numeral or number from 1 to 3,999,999.";
                    answer.style.color = "red";
                }
            } else {
                answer.innerHTML = "Please fill out the input field.";
                answer.style.color = "red";
            }
        }
        clearAll = () => {
            input.value = "";
            answer.innerHTML = "";
            answer.style.color = "black";
        }

        handle() {
            calc.addEventListener("click", this.converter);
            clear.addEventListener("click", this.clearAll);
        }
    }

    (function init() {
        const romanView = new RomanView();
        const arabicView = new ArabicView();
        const romanModel = new RomanModel(romanView);
        const arabicModel = new ArabicModel(arabicView);

        const mainController = new MainController(romanModel, arabicModel);
        mainController.handle();
    })();
});