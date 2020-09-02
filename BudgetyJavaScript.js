var budgetController = (function () {

    var Expense = function (ID, Description, Value) {
        this.ID = ID,
            this.Description = Description,
            this.Value = Value
    };

    var Income = function (ID, Description, Value) {
        this.ID = ID,
            this.Description = Description,
            this.Value = Value
    };





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
        percentage : -1
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
                Data.total['inc'] += val;


            }
            else {

                if (type === 'inc') {
                    newItems = new Income(ID, des, val);
                    Data.total['exp'] += val;   

                }

            }



            Data.budget = Data.total['inc'] + Data.total['exp']; 

            //Data.percentage = 

            Data.allItem[type].push(newItems);

            return newItems;

        },

        getBudget: function()
        {
            return{
                budget: Data.budget,
                income: Data.total.inc,
                expenses: Data.total.exp,
                percentage: Data.percentage
            }
            
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



    return {


        getInput: function () {
            return {
                type: document.querySelector(DOMString.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMString.inputDescription).value,
                value: parseFloat(document.querySelector(DOMString.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            if (type === 'exp')
            {
                element = DOMString.expensesContainer;

                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
            else {
                if (type === 'inc') {

                    element = DOMString.incomeContainer;
                
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
                }
            }

            console.log(obj);

            newHtml = html.replace('%id%', obj.ID);
            newHtml = newHtml.replace('%description%', obj.Description);
            newHtml = newHtml.replace('%value%', obj.Value);


            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // push empty for input tag in description and value 

            

        },

        clearFields: function()
        {
            document.querySelector(DOMString.inputDescription).value = "";
            document.querySelector(DOMString.inputValue).value = "";
            document.querySelector(DOMString.inputDescription).focus;

        } ,

        displayBudget: function(obj)
        {

            console.log(obj.budget);

            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            //document.querySelector(DOMString.incomeLabel).textContent =   //formatNumber(obj.totalInc, 'inc');
            //document.querySelector(DOMString.expensesLabel).textContent = //formatNumber(obj.totalExp, 'exp');
        }

    }




})();


var controller = (function (budgetCtrl, UICtrl) {

    var Item, domString;

    

    var add = function () {

        document.addEventListener('keypress', function (event) {

            var input = UIController.getInput();
            var getBug;

            if(input.description !== "" &&  !isNaN(input.value) && input.value > 0)
            {
                if (event.keyCode === 13 || event.which === 13) {

                    console.log(input);
                    
                    Item = budgetController.addItems(input.type, input.description, input.value);
                    UIController.addListItem(Item ,input.type);                   
                    UIController.clearFields();

                    getBug = budgetController.getBudget();

                    UIController.displayBudget(getBug);
                }

            }

           
            //console.log(event);
        });
    }



    return {
        init: function () {
            add();

        }


    }
})(budgetController, UIController);

controller.init();