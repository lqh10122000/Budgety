window.onload = function () {
    var budgetController = (function () {

        var Expense = function (ID, Description, Value) {
            this.ID = ID,
                this.Description = Description,
                this.Value = Value
            this.percentage = -1;
        };

        var Income = function (ID, Description, Value) {
            this.ID = ID,
                this.Description = Description,
                this.Value = Value

        };


        Expense.prototype.calcPercentage = function (totalIncome) {
            this.percentage = Math.round((this.Value / totalIncome) * 100);
        }


        Expense.prototype.getPercentage = function () {
            return this.percentage;
        }



        var Data = {
            allItem: {
                exp: [],
                inc: []
            },
            total: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1
        };

        return {

            addItems: function (type, des, val) {


                var ID, newItems;

                if (Data.allItem[type].length > 0) {
                    ID = Data.allItem[type][Data.allItem[type].length - 1].ID + 1;
                } else {
                    ID = 0;
                }


                if (type === 'exp') {

                    newItems = new Expense(ID, des, val);
                    Data.total['exp'] += val;

                }
                else {

                    if (type === 'inc') {
                        newItems = new Income(ID, des, val);
                        Data.total['inc'] += val;
                    }

                }

                Data.budget = Data.total['inc'] - Data.total['exp'];

                Data.percentage = Math.round((Data.total['exp'] / Data.total['inc']) * 100);
                //Data.percentage = 

                Data.allItem[type].push(newItems);

                return newItems;

            },


            getPercentage: function () {
                var allPerc = Data.allItem.exp.map(function (cur) {
                    return cur.getPercentage();
                });
                return allPerc;
            },



            updateBudget: function (type) {
                console.log('dang vao trong update');

                console.log(Data.allItem);


                var sum = 0;

                // Data.allItem['inc'].forEach(function(cur)
                // {
                //     sum += cur.Value;
                // });
                // Data.total['inc'] = sum;


                Data.allItem[type].forEach(function (cur) {
                    sum += cur.Value;
                });
                Data.total[type] = sum;


                console.log(Data.total.exp);



                console.log(Data.total.inc);

                Data.budget = Data.total['inc'] - Data.total['exp'];

                Data.percentage = (Data.total['exp'] / Data.total['inc']) * 100;
            },

            calculatePercentage: function () {
                var percentage = Data.allItem.exp.forEach(function (cur) {
                    return cur.calcPercentage(Data.total.inc);
                });
            },

            getBudget: function () {

                return {

                    budget: Data.budget,
                    income: Data.total.inc,
                    expenses: Data.total.exp,
                    percentage: Data.percentage,
                    item_percentage: Data.total['exp'] - Data.budget

                }

            },

            deleteItem: function (type, id) {
                Data.allItem[type].splice(id, 1);
            }
        }
    })();



    var UIController = (function () {

        var type, Description, value;

        var DOMString =
        {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
            expensesPercLabel: '.item__percentage',
            dateLabel: '.budget__title--month'
        };

        var formatNumber = function (num, type) {
            var numSplit, int, dec, type;
            /*
                + or - before number
                exactly 2 decimal points
                comma separating the thousands
                2310.4567 -> + 2,310.46
                2000 -> + 2,000.00
                */

            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.');

            int = numSplit[0];
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
            }

            dec = numSplit[1];

            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

        };

        var nodeListForEach = function (list, callback) {
            for (var i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        };


        return {


            getInput: function () {

                //console.log(DOMString.inputType);

                return {
                    type: document.querySelector(DOMString.inputType).value, // Will be either inc or exp
                    description: document.querySelector(DOMString.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMString.inputValue).value)

                };
            },

            addListItem: function (obj, type) {



                if (type === 'exp') {
                    element = DOMString.expensesContainer;


                    html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                }
                else {
                    if (type === 'inc') {

                        element = DOMString.incomeContainer;

                        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                    }
                }



                newHtml = html.replace('%id%', obj.ID);
                newHtml = newHtml.replace('%description%', obj.Description);
                newHtml = newHtml.replace('%value%', obj.Value);


                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
                // push empty for input tag in description and value 



            },

            clearFields: function () {
                document.querySelector(DOMString.inputDescription).value = "";
                document.querySelector(DOMString.inputValue).value = "";
                document.querySelector(DOMString.inputDescription).focus;

            },

            displayPercentage: function (percentages) {
                var fields = document.querySelectorAll(DOMString.expensesPercLabel);
                console.log(fields);
                nodeListForEach(fields, function (current, index) {

                    current.textContent = Math.round(percentages[index]) + '%';

                    // if (percentages[index] > 0) {
                    // } else {
                    //     current.textContent = '---';
                    // }
                });
            },

            displayBudget: function (obj) {

                console.log(obj.budget);

                document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMString.incomeLabel).textContent = '+' + obj.income;
                document.querySelector(DOMString.expensesLabel).textContent = '-' + obj.expenses;
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
                //document.querySelector(DOMString.expensesPercLabel).textContent = obj.item_percentage;     

                //document.querySelector(DOMString.expensesPercLabel).textContent = obj.percentage + '%';

                //document.querySelector(DOMString.incomeLabel).textContent =   //formatNumber(obj.totalInc, 'inc');
                //document.querySelector(DOMString.expensesLabel).textContent = //formatNumber(obj.totalExp, 'exp');
            },

            displayMonth: function()
            {
                var now, month, months,  year;

                months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                now = new Date();
                month = now.getMonth();
                year = now.getFullYear();

                document.querySelector(DOMString.dateLabel).textContent = months[month] + " " + year;
            },

            changedType: function()
            {
                var fields =  document.querySelectorAll(
                    DOMString.inputType + ',' +
                    DOMString.inputDescription + ',' +
                    DOMString.inputValue
                );

                fields.classList.toggle('red-focus');
            },



            getDOMStrings: function () {
                //console.log('Hello');
                return DOMString;
            },


            deleteListItem: function (item) {
                var deleteItem = document.getElementById(item);
                deleteItem.remove();
            },



        }




    })();









    var controller = (function (budgetCtrl, UICtrl) {

        var Item, domString;
        var getBud;




        var setupEventListeners = function () {

            var DOM = UICtrl.getDOMStrings();

            document.addEventListener('keypress', function (event) {

                if (event.keyCode === 13 || event.which === 13) {

                    //console.log('Hello');

                    ctrlAddItem()

                }





                //console.log(event);
            });

            document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem, false);


            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem, false);

        };



        updatePercentage = function () {

            budgetCtrl.calculatePercentage();

            var percentage = budgetCtrl.getPercentage();

            UICtrl.displayPercentage(percentage);
        }

        var ctrlAddItem = function () {

            var input = UICtrl.getInput();



            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

                console.log(input);

                Item = budgetController.addItems(input.type, input.description, input.value);
                UIController.addListItem(Item, input.type);
                UIController.clearFields();

                getBud = budgetController.getBudget();

                UIController.displayBudget(getBud);

                updatePercentage();

            }


        }

        var ctrlDeleteItem = function (event) {

            var itemId, type, id, splitId;
            itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
            console.log(itemId)


            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            console.log(id);

            // delete item in structure data


            budgetCtrl.deleteItem(type, id);




            // delete item on UI

            budgetCtrl.updateBudget(type);


            UICtrl.deleteListItem(itemId);


            //update budget
            getBud = budgetController.getBudget();
            UICtrl.displayBudget(getBud);

            updatePercentage();

        };



        return {
            init: function () {
                UICtrl.displayMonth();
                setupEventListeners();
                UICtrl.displayBudget({
                    budget: 0,
                    income: 0,
                    expenses: 0,
                    percentage: -1
                });
            }


        }
    })(budgetController, UIController);

    controller.init();
}