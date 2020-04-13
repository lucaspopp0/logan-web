import TableData from "@/utils/table-data";
import DataManager from "@/data-manager";

const TableController = {

    data() {
        return {
            data: new TableData(),
            currentSelection: undefined
        }
    },

    mounted() {
        if (!this._fetchFn)
            console.warn('Please use setupController to define a fetch function in the beforeMount hook');
    },

    methods: {

        setupController(options) {
            this._fetchFn = options.fetch || this._fetchFn;
        },

        select(item) {
            this.currentSelection = item;
        },

        isCurrentSelection(item) {
            return item === this.currentSelection;
        },

        updateData() {
            this._sort(this._fetchFn());
        },

        _sort(data) {
            const tempData = new TableData();
            let tempFlat = [...(data || this.data.flat())];
            this.groupData(tempData, tempFlat);
            this.data = tempData;
        },

        sortData(data) {
            this._sort(data);
        },

        groupData(tableData, rawData) {
            console.warn('Not implemented');
        }

    }

}

const DMTableController = {

    created() {},

    data() {
        return {
            data: new TableData(),
            currentSelection: undefined
        }
    },

    mounted() {
        if (!this._fetchFn) 
            console.warn('Please use setupController to define a fetch function in the beforeMount hook');

        DataManager.addListener(this);
        if (!DataManager.needsFetch()) {
            this.updateData();
        }
    },

    beforeDestroy() {
        DataManager.removeListener(this);
    },

    methods: {

        dmEvent(event, data) {
            if (event === DataManager.EventType.FETCH_COMPLETE) {
                this.updateData();
            }
        },

        setupController(options) {
            this._fetchFn = options.fetch;
        },

        select(item) {
            this.currentSelection = item;
        },

        isCurrentSelection(item) {
            return item === this.currentSelection;
        },

        updateData() {
            this._sort(this._fetchFn());
        },

        _sort(data) {
            const tempData = new TableData();
            let tempFlat = [...(data || this.data.flat())];
            this.groupData(tempData, tempFlat);
            this.data = tempData;
        },

        sortData(data) {
            this._sort(data);
        },

        groupData(tableData, rawData) {
            console.warn('Not implemented');
        }

    }

}

export {
    TableController,
    DMTableController
}