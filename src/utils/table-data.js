class Section {

    constructor(title, content) {
        this.title = title || "";
        this.content = [...(content || [])];
    }

    addItem(item) {
        this.content.push(item);
    }

}

class TableData {
    
    constructor() {
        this.groups = [];
    }

    addItem(groupTitle, item) {
        for (const group of this.groups) {
            if (group.title === groupTitle) {
                group.addItem(item);
                return;
            }
        }

        this.groups.push(new Section(groupTitle, [item]));
    }

    addGroup(group) {
        this.groups.push(group);
    }

    clear() {
        this.groups = [];
    }

    flat() {
        let arr = [];
        for (const group of this.groups) {
            arr.push(...group.content);
        }
        return arr;
    }

}

export default TableData;