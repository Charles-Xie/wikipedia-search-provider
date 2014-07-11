const St = imports.gi.St;
const Lang = imports.lang;
const Signals = imports.signals;
const Main = imports.ui.main;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const PopupDialog = Me.imports.popup_dialog;

const WikipediaImageResultsView = new Lang.Class({
    Name: "WikipediaImageResultsView",
    Extends: PopupDialog.PopupDialog,

    _init: function(relative_actor) {
        this.parent({
            modal: true,
            style_class: 'wikipedia-image-results-view'
        });

        this._table = new St.Table({
            homogeneous: false
        });
        this.actor.add(this._table, {
            x_expand: true,
            y_expand: true,
            x_align: St.Align.START,
            y_align: St.Align.START
        });

        this._relative_actor = relative_actor;
    },

    _reposition: function() {
        let [x, y] = [null, null];

        if(this._relative_actor) {
            [x, y] = this._relative_actor.get_transformed_position();
        }

        this.parent(x, y);
    },

    set_images: function(wikipedia_image_views) {
        this.clear();

        let row = 0;
        let column = 0;
        let max_row_images = 5;
        let n_current_images = 0;

        let n_current_loaded = 0;
        let n_total_views = wikipedia_image_views.length;

        for (let i = 0; i < wikipedia_image_views.length; i++) {
            let image_view = wikipedia_image_views[i];
            image_view.connect('loaded',
                Lang.bind(this, function() {
                    n_current_loaded++;
                    if(n_current_loaded >= n_total_views) {
                        this.emit('loaded');
                        this._reposition();
                    }
                })
            );

            n_current_images++;

            if(n_current_images > max_row_images) {
                row++;
                column = 0;
                n_current_images = 1;
            }

            this._table.add(image_view.actor, {
                row: row,
                col: column,
                x_expand: false,
                y_expand: false,
                x_fill: false,
                y_fill: false,
                x_align: St.Align.MIDDLE,
                y_align: St.Align.MIDDLE
            });
            column++;
        }
    },

    clear: function() {
        this._table.destroy_all_children();
    }
});
Signals.addSignalMethods(WikipediaImageResultsView.prototype);
