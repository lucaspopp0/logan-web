export default {
    name: 'checkbox',
    props: {
        checked: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: ''
        },
        priority: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {}
    },
    computed: {
        styleObject() {
            let color = !!this.color ? '#' + this.color : 'rgba(0, 0, 0, 0.3)';
            let style = {
                border: 'solid 1px ' + color,
                background: 'none'
            };

            if (this.checked)
                style.background = `radial-gradient(circle at center, ${color} 0%, ${color} 54.5%, rgba(0, 0, 0, 0) 55.5%, rgba(0, 0, 0, 0) 100%)`;
            
            return style;
        },
        priorityText() {
            switch (this.priority) {
                case 2:
                    return '!!';
                case 1:
                    return '!';
                case 0:
                    return '';
                case -1:
                    return '~';
                case -2:
                    return '≈';
            }
        },
        priorityLabelStyle() {
            const style = {
                color: '#' + this.color
            };

            if (this.priority > 0) {
                style.top = '1px';
            }

            return style;
        }
    }
}