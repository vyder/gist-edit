$(document).ready(function() {
    // Panes representation
    var panes = {
        left: {
            selector: 'table.code-blocks td.left',
            icon_template: _.template('<%= icon %> Gist'),
            control: $('#left-pane-control')
        },
        right: {
            selector: 'table.code-blocks td.right',
            icon_template: _.template('<%= icon %> Stylesheet'),
            control: $('#right-pane-control')
        },
    };

    // Setup a PaneManager
    var noop = function() {};
    var animationOptions = {
        animationPeriod: 1000,
        animationStyle: 'easeOutQuint',
        complete: noop
    };
    var paneManager = new PaneManager(panes, animationOptions);

    // Export paneManager to global scope
    window.paneManager = paneManager;

    // Hook up toolbox controls
    $(panes.left.control).click(function() {
        paneManager.trigger('left', function() {
            editor.resize();
        });
    });
    $(panes.right.control).click(function() {
        paneManager.trigger('right', function() {
            editor.resize();
        });
    });

    // Setup the onboarding process
    var onboardingManager = new OnboardingManager();
    onboardingManager.setup({
        setup: function() {
            $('.component').css('opacity', '0.4');
            $('h1.component').css('opacity', '0.1');
        },
        start: function(completeProcess, abandonProcess) {
            $('body').click(function() {
                abandonProcess();
            });
            setTimeout(function() {
                completeProcess();
            }, 3000);
        },
        cleanup: function() {
            $('.component').animate({
                opacity: 1
            }, animationOptions);
        }
    });
    // Kick off the onboarding process
    onboardingManager.start();

    // Hook up help mouseover
    $('#help').hover(function() {
        $('.help-text').fadeIn(300);
    }, function() {
        $('.help-text').fadeOut(300);
    });
});
