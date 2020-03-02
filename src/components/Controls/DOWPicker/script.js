const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const ALL_FALSE = [false, false, false, false, false, false, false];

export default {
    name: 'dow-picker',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checks: ALL_FALSE
        }
    },
    computed: {
        options() {
            let out = [];
            for (let i = 0;i < labels.length;i++) {
                out.push({ label: labels[i], value: i });
            }
            return out;
        }
    },
    watch: {
        value() {
            if (!this.value || this.value.trim.length === 0) this.checks = ALL_FALSE;

            let split = this.value.split('');
            let out = [];
            for (let i = 0;i < 7;i++) {
                out.push(split.indexOf('' + i) != -1);
            }
            this.checks = out;
        }
    },
    methods: {
        updateValue() {
            let out = "";
            for (let i = 0;i < this.checks.length;i++) {
                if (this.checks[i]) out += i;
            }

            this.$emit('input', out.length > 0 ? out : undefined);
        }
    }
}