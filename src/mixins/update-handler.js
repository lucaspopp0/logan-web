import { UpdateTimer } from '@/utils/timers';

export default {

    created () {
        this._changesPresent = false;
    },

    methods: {

        setupHandlers(prop, options) {
            this._prop = prop;
            this._updateFn = options.update || (() => {});
            this._deleteFn = options.delete || (() => {});

            this._timer = new UpdateTimer(options.timeout || 2000, this._performUpdate);
        },

        handlePropChange(oldValue) {
            if (this._changesPresent) {
                this._updateFn(oldValue);
            }

            this._timer.cancel();
            this._changesPresent = false;
        },

        _performUpdate() {
            this._timer.cancel();
            
            if (this._changesPresent) {
                this._updateFn(this[this._prop]);
            }

            this._changesPresent = false;
        },

        registerChange() {
            this._changesPresent = true;

            if (this._timer.isOn) this._timer.reset();
            else this._timer.begin();

            this.$emit('change', this[this._prop])
        },

        performDelete() {
            this._timer.cancel();
            this.$emit('delete', this[this._prop]);
            this._deleteFn(this[this._prop]);
        },

        isPreventingFetch() {
            return this._changesPresent;
        }

    },

}