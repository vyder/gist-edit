var PaneManager = (function($, _) {

    var PaneManager = function() {
        this.initialize.apply(this, arguments);
    };

    var _noop = function() {};
    var ICONS = {
        CONTRACT: 'contract',
        EXPAND: 'expand'
    }
    var STATES = {
        EQUAL: 0,
        OPEN: 1
    };
    var CURRENT_STATE = STATES.EQUAL;

    _.extend(PaneManager.prototype, {
        // Example input for panes:
        // {
        //     left: {
        //         selector: 'table.code-blocks td.left',
        //         icon_template: _.template('<%= icon %> Gist'),
        //         control: $('#left-pane-control')
        //     },
        //     right: {
        //         selector: 'table.code-blocks td.right',
        //         icon_template: _.template('<%= icon %> Stylesheet'),
        //         control: $('#right-pane-control')
        //     },
        // }
        initialize: function(panes, options) {
            // TODO - Error checks or use Typescript
            this.panes = panes;

            options = options || {};
            _.defaults(options, {
                animationPeriod: 1000,
                animationStyle: 'easeOutBack'
            });
            this.opts = options;
        },

        trigger: function(side, cb) {
            this._validateSideOrError(side);

            var otherSide = _.first(_.without(_.keys(this.panes), side));
            if( CURRENT_STATE === STATES.EQUAL ) {
                this._maximizePane(side);
                this._minimizePane(otherSide, cb);
                CURRENT_STATE = STATES.OPEN;
            } else { // one side is fully open, so equalize them
                this._equalizePane(side);
                this._equalizePane(otherSide, cb);
                CURRENT_STATE = STATES.EQUAL;
            }
        },

        _maximizePane: function(side, cb) {
            this._animatePaneWidth(this.panes[side], '100%', ICONS.CONTRACT, cb);
        },

        _minimizePane: function(side, cb) {
            this._animatePaneWidth(this.panes[side], '0%', ICONS.EXPAND, cb);
        },

        _equalizePane: function(side, cb) {
            this._animatePaneWidth(this.panes[side], '50%', ICONS.EXPAND, cb);
        },

        _animatePaneWidth: function(pane, width, icon, cb) {
            cb = cb || _noop;
            this._animateElementWidth($(pane.selector), width, function() {
                $(pane.control).text(pane.icon_template({ icon: icon }));
                cb();
            });
        },

        _animateElementWidth: function(element, width, cb) {
            this._animateElementStyles(element, { width: width }, cb);
        },

        _animateElementStyles: function(element, styles, cb) {
            cb = cb || _noop;
            $(element).animate(styles, {
                duration: this.animationPeriod,
                easing: this.animationStyle,
                complete: cb
            });
        },

        _validateSideOrError: function(side) {
            if( !this.panes[side] ) {
                throw new Error("Side not recognized: " + side + ". Available sides are: " + _.keys(this.panes).join(","));
            }
        }
    });

    return PaneManager;
})($, _);
