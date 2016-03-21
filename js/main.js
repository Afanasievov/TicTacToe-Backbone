(function() {

    window.App = {
        Models: {},
        Views: {}
    };

    //MODELS
    App.Models.GameOptions = Backbone.Model.extend ({
        defaults : {
            playFieldWidth: null,
            playFieldHeight: null,
            symbol: null,
            lineWin: null
        },

        validate: function (attrs) {

            if (attrs.lineWin > validateLineWin(attrs.playFieldHeight, attrs.playFieldWidth)) {
                this.clear();
                return 'LineWin must be smaller than the FieldSize!'
            }
        }
    });

    App.Models.PlayField = Backbone.Model.extend ({
        defaults: {},

        counter: 0,

        initialize: function () {
            gameOptionsModel.on('change', this.createArrGame, this);

        },

        createArrGame: function () {
            this.clear();
            this.counter = 0;
            for (var i = 0; i < gameOptionsModel.get('playFieldWidth')*gameOptionsModel.get('playFieldHeight'); i++) {
                this.set(i, '');
            }
        }
    });

    //VIEWS
    App.Views.GameOptions = Backbone.View.extend ({
        el: '#optionsForm',

        events: {
            'submit' : 'submit'
        },

        initialize: function () {
                 this.model.on('invalid', this.render, this);
        },

        submit: function(e){
            e.preventDefault();

            var playFieldModel = new App.Models.PlayField(),
                playFieldView = new App.Views.PlayField({model: playFieldModel}),
                infoFieldView = new App.Views.InfoField({model: playFieldModel});

            this.$el.find('#error').html = '';
            this.model.clear();
            this.model.set({playFieldWidth : +$(e.currentTarget).find('#fieldWidth').val()});
            this.model.set({playFieldHeight : +$(e.currentTarget).find('#fieldHeight').val()});
            this.model.set({symbol : $(e.currentTarget).find('input[name=symbol]:checked').val()});
            this.model.set({lineWin : +$(e.currentTarget).find('#lineWin').val()}, {validate:true});

        },

        render: function () {
            this.$el.find('#error').html(this.model.validationError);
            return this;
        }
    });


    App.Views.PlayField = Backbone.View.extend ({
        el: '.play-field',

        initialize: function() {
            this.model.on('change', this.render, this);
        },

        events: {
            'click' : 'cellClick'
        },

        cellClick: function(event) {
            if (this.model.get(event.target.className) == "") {
                this.model.counter++;
                if (event.target.className) {
                    this.model.set(event.target.className, this.getSymbol());
                    var obj = this.model.toJSON(),
                        lineWin = gameOptionsModel.get('lineWin'),
                        index = +event.target.className,
                        width = gameOptionsModel.get('playFieldWidth'),
                        height = gameOptionsModel.get('playFieldHeight'),
                        symbol = this.getSymbol();
                    if (isTicWin1DObj(obj, lineWin, index, width, height, symbol)) {
                        this.undelegateEvents();
                        this.renderWin(this);
                    }
                    if (this.model.counter == width*height) {
                        this.renderDraw(this);
                    }
                }
            }
        },

        getSymbol: function() {
            if (gameOptionsModel.get('symbol') == 'XO') {
                return  (this.model.counter % 2 == 0) ? 'O': 'X';
            }
            else return gameOptionsModel.get('symbol');
        },

        template: function () {
            return createHtmlTable(this.model.toJSON(), gameOptionsModel.get('playFieldWidth'));
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        renderWin: function() {
            var plNum = (this.model.counter % 2 == 0 ) ? 2 : 1;
            this.$el.append('<div>GAME OVER!!!<p>Player '+plNum+' wins!</div>');
            return this;
        },
        renderDraw: function() {
            this.$el.append('<div>Draw!!!</div>');
            return this;
        }
    });


    App.Views.InfoField = Backbone.View.extend( {
        el: '.info-field',

        template: function (){
            var Xs = 0,Os =0, plNum = 0;
                for (var key in this.model.toJSON()) {
                    if (this.model.get([key]) == 'X') Xs++;
                    if (this.model.get([key]) == "O") Os++;

                }
            plNum = (this.model.counter % 2 == 0) ? 1 : 2;
            return ('<p>Number of <strong> X</strong>: ' + Xs +
            '<p>Number of <strong> O</strong>: ' + Os +
            '<p>Player ' + plNum + ' turn!');
        },

        initialize: function() {
            this.model.on('change', this.render, this);
        },

        render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
        }
    });

    var gameOptionsModel = new App.Models.GameOptions();
    var gameOptionsForm = new App.Views.GameOptions({model: gameOptionsModel});
}());