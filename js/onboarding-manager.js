var OnboardingManager = (function($, _) {

    var OnboardingManager = function() {
        this.initialize.apply(this, arguments);
    };

    var STATES = {
        SETUP: 'SETUP',
        READY: 'READY',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETE: 'COMPLETE',
        ABANDONED: 'ABANDONED'
    };

    _.extend(OnboardingManager.prototype, {
        initialize: function() {
            this.state = STATES.SETUP;
        },

        setup: function(delegates) {
            this._validateStateOrError([ STATES.SETUP ]);
            this.delegates = delegates;

            // Exec some setup
            this.delegates.setup();

            // Ready to start onboarding now
            this.state = STATES.READY;
        },

        start: function() {
            this._validateStateOrError([ STATES.READY ]);
            this.state = STATES.IN_PROGRESS;

            // do something, abort if necessary
            this.delegates.start(_.bind(this.complete, this), _.bind(this.abandon, this));
        },

        complete: function() {
            if( !this._isInValidState([ STATES.IN_PROGRESS ]) ) {
                return;
            }
            this.delegates.cleanup();
            this.state = STATES.COMPLETE;
            console.log("Onboarding complete.");
        },

        abandon: function() {
            if( !this._isInValidState([ STATES.IN_PROGRESS ]) ) {
                return;
            }
            this.delegates.cleanup();
            this.state = STATES.ABANDONED;
            console.log("Onboarding abandoned.");
        },

        _validateStateOrError: function(states) {
            if( !this._isInValidState(states) ) {
                throw new Error( "OnboardingManager is in an invalid state: " + this.state + ". Expected: " + states.join(","));
            }
        },

        _isInValidState: function(states) {
            return _.contains(states, this.state);
        }
    });

    return OnboardingManager;
})($, _);
