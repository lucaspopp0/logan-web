const DEFAULT_COLOR = '#b3b3b3';

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
        currentColor() {
            return !!this.color ? '#' + this.color : DEFAULT_COLOR;
        },
        styleObject() {
            let style = {
                border: 'solid 1px ' + this.currentColor,
                background: 'none'
            };

            if (this.checked)
                style.background = `radial-gradient(circle at center, ${this.currentColor} 0%, ${this.currentColor} 54.5%, rgba(0, 0, 0, 0) 55.5%, rgba(0, 0, 0, 0) 100%)`;
            
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
                color: this.currentColor,
                display: 'inline-block'
            };

            if (this.priority > 0) {
                style.top = '1px';
            }

            if (this.checked) {
                style.display = 'none';
            }

            return style;
        }
    }
}