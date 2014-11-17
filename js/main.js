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
    var options = {
        animationPeriod: 1000,
        animationStyle: 'easeOutQuint',
        complete: noop
    };
    var paneManager = new PaneManager(panes, options);

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
});
