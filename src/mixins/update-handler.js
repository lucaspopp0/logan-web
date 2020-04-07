import { UpdateTimer } from '@/utils/timers';

export default {

    created () {
        this._changesPresent = false;
    },

    methods: {

        setupHandlers(options) {
            this._updateFn = options.update || (() => {});
            this._exitFn = options.exit || (() => {});
            this._changeFn = options.change || (() => {});
            this._deleteFn = options.delete || (() => {});

            this._timer = new UpdateTimer(options.timeout || 2000, this._performUpdate);
        },

        propertyChanged(oldValue) {
            if (this._changesPresent) {
                this._exitFn(oldValue);
            }

            this._timer.cancel();
            this._changesPresent = false;
        },

        _performUpdate() {
            this._timer.cancel();
            
            if (this._changesPresent) {
                this._updateFn();
            }

            this._changesPresent = false;
        },

        registerChange() {
            this._changesPresent = true;

            if (this._timer.isOn) this._timer.reset();
            else this._timer.begin();

            this._changeFn();
        },

        performDelete() {
            this._timer.cancel();
            this.$emit('delete');
            this._deleteFn();
        }

    },

}