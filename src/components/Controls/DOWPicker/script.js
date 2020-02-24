const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default {
    name: 'dow-picker',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        options() {
            let out = [];
            for (let i = 0;i < labels.length;i++) {
                out.push({ label: labels[i], value: i });
            }
            return out;
        },
        checks() {
            let split = this.value.split('');
            let out = [];
            for (let i = 0;i < 7;i++) {
                out.push(split.indexOf('' + i) != -1);
            }
            return out;
        }
    },
    methods: {
        updateValue() {
            let out = "";
            for (let i = 0;i < this.checks.length;i++) {
                if (this.checks[i]) out += i;
            }
            this.$emit('input', out);
        }
    }
}