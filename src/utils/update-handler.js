import { UpdateTimer } from './timers';

export default {

    data() {
        return {
            _changesPresent: false,
            _timer: undefined,
            _updateHandler: () => {},
            _exitHandler: () => {},
            _changeHandler: () => {},
            _deleteHandler: () => {}
        }
    },

    methods: {

        setup(options) {
            this._updateHandler = options.updateHandler || (() => {});
            this._exitHandler = options.exitHandler || (() => {});
            this._changeHandler = options.changeHandler || (() => {});
            this._deleteHandler = options.deleteHandler || (() => {});

            this._timer = new UpdateTimer(options.timeout || 2000, this._performUpdate);
        },

        propertyChanged(oldValue) {
            if (this._changesPresent) {
                this._exitHandler(oldValue);
            }

            this._timer.cancel();
            this._changesPresent = false;
        },

        _performUpdate() {
            this._timer.cancel();
            
            if (this._changesPresent) {
                this._updateHandler();
            }

            this._changesPresent = false;
        },

        registerChange() {
            this._changesPresent = true;

            if (this._timer.isOn) this._timer.reset();
            else this._timer.begin();

            this._changeHandler();
        },

        performDelete() {
            this._timer.cancel();
            this.$emit('delete');
            this._deleteHandler();
        }

    },

}