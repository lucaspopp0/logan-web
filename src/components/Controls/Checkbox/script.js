export default {
    name: 'checkbox',
    props: ['checked', 'color'],
    data() {
        return {}
    },
    computed: {
        styleObject() {
            let color = !!this.color ? '#' + this.color : 'rgba(0, 0, 0, 0.3)';
            let style = {
                border: 'solid 1px rgba(0, 0, 0, 0.3)',
                background: 'none'
            };

            if (this.checked)
                style.background = `radial-gradient(circle at center, ${color} 0%, ${color} 48.5%, rgba(0, 0, 0, 0) 51.5%, rgba(0, 0, 0, 0) 100%)`;
            
            return style;
        }
    }
}