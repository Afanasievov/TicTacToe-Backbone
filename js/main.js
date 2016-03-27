(function () {

    window.App = {
        Models: {},
        Views: {},
        instances: {}
    };

    //MODELS
    App.Models.GameOptions = Backbone.Model.extend({
        defaults: {
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

    App.Models.PlayField = Backbone.Model.extend({
        defaults: {},

        counter: 0,

        initialize: function () {
            App.instances.vent.on('optionsReady', this.createArrGame, this);
        },

        createArrGame: function () {
            var width = App.instances.gameOptionsModel.get('playFieldWidth');
            var height = App.instances.gameOptionsModel.get('playFieldHeight');
            var objForTemplate = {};

            this.clear();
            this.counter = 0;

            for (var i = 0; i < width * height; i++) {
                objForTemplate[i] = '';
            }
            this.set(objForTemplate);
        }
    });

    //VIEWS
    App.Views.GameOptions = Backbone.View.extend({
        el: '#optionsForm',

        events: {
            'submit': 'submit'
        },

        initialize: function () {
            this.model.on('invalid', this.showError, this);
        },

        submit: function (e) {
            e.preventDefault();

            this.$el.find('#error').html('');
            this.model.clear();
            this.model.set({playFieldWidth: +$(e.currentTarget).find('#fieldWidth').val()});
            this.model.set({playFieldHeight: +$(e.currentTarget).find('#fieldHeight').val()});
            this.model.set({symbol: $(e.currentTarget).find('input[name=symbol]:checked').val()});
            this.model.set({lineWin: +$(e.currentTarget).find('#lineWin').val()}, {validate: true});
            App.instances.vent.trigger('optionsReady');
        },

        showError: function () {
            this.$el.find('#error').html(this.model.validationError);
            return this;
        }
    });


    App.Views.PlayField = Backbone.View.extend({
        el: '.play-field',

        events: {
            'click': 'cellClick'
        },

        initialize: function () {
            this.model.on('change', this.render, this);
            App.instances.vent.on('optionsReady', this.activateEl, this);
        },

        activateEl: function () {
            $(this.el).removeClass('disabled');
        },

        cellClick: function (event) {
            if (this.model.get(event.target.className) == '') {
                this.model.counter++;
                this.model.set(event.target.className, this.getSymbol());
                var obj = this.model.toJSON();
                var lineWin = App.instances.gameOptionsModel.get('lineWin');
                var index = +event.target.className;
                var width = App.instances.gameOptionsModel.get('playFieldWidth');
                var height = App.instances.gameOptionsModel.get('playFieldHeight');
                var symbol = this.getSymbol();
                var minWinLen = (App.instances.gameOptionsModel.get('symbol') == 'XO') ? 2 * lineWin - 1 : lineWin;

                if (this.model.counter >= minWinLen) {
                    if (isTicWin(obj, lineWin, index, width, height, symbol)) {
                        $(this.el).addClass('disabled');
                        this.renderWin(this);
                    }
                    if (this.model.counter == width * height) {
                        this.renderDraw(this);
                    }
                }
            }
        },

        getSymbol: function () {
            if (App.instances.gameOptionsModel.get('symbol') == 'XO') {
                return (this.model.counter % 2 == 0) ? '&#9898;' : '&#9899;';
            }
            else return App.instances.gameOptionsModel.get('symbol');
        },

        template: function () {
            return createHtmlTable(this.model.toJSON(), App.instances.gameOptionsModel.get('playFieldWidth'));
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        renderWin: function () {
            var plNum = (this.model.counter % 2 == 0 ) ? 2 : 1;
            this.$el.append('<div class="end-game">GAME OVER!!!<p>Player ' + plNum + ' wins!</div>');
            return this;
        },
        renderDraw: function () {
            this.$el.append('<div class="end-game">Draw!!!</div>');
            return this;
        }
    });


    App.Views.InfoField = Backbone.View.extend({
        el: '.info-field',

        template: function () {
            var Xs = 0;
            var Os = 0;
            var plNum = 0;

            for (var key in this.model.toJSON()) {
                if (this.model.get([key]) == 'X') Xs++;
                if (this.model.get([key]) == "O") Os++;
            }

            plNum = (this.model.counter % 2 == 0) ? 1 : 2;

            return ('<p>Number of &#9899;: ' + Xs +
            '<p>Number of &#9898;: ' + Os +
            '<p>Player ' + plNum + ' turn!');
        },

        initialize: function () {
            this.model.on('change', this.render, this);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    App.instances.vent = _.extend({}, Backbone.Events);
    App.instances.gameOptionsModel = new App.Models.GameOptions();
    App.instances.gameOptionsForm = new App.Views.GameOptions({model: App.instances.gameOptionsModel});
    App.instances.playFieldModel = new App.Models.PlayField();
    App.instances.playFieldView = new App.Views.PlayField({model: App.instances.playFieldModel});
    App.instances.infoFieldView = new App.Views.InfoField({model: App.instances.playFieldModel});

}());