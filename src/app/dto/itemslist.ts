export enum ListType {
    shoppingList = 'SHOPPING_LIST',
    checkingList = 'CHECKING_LIST'
}

export enum UnitType {
    l = 'l',
    kg = 'kg',
    m = 'm',
    pcs = 'pcs'
}

export enum EditListType {
    none,
    create,
    update,
    duplicate,
    delete
}

// Item

export class ItemValuesDTO {
    label: string;
    description: string;
    unit: UnitType;
    quantity: number;
    checked: boolean;

    constructor() {
        this.label = '';
        this.description = '';
        this.unit = UnitType.pcs;
        this.quantity = 1;
        this.checked = false;
    }
}


export class ItemDTO {
    id: string;
    value: ItemValuesDTO;

    constructor() {
        this.id = '';
        this.value = new ItemValuesDTO();
    }
}


// Lists
export class ItemsListValuesDTO {
    name: string;
    description: string;
    type: ListType;

    constructor() {
        this.name = '';
        this.description = '';
        this.type = ListType.shoppingList;
    }

}

export class ItemsListDTO {
    id: string;
    value: ItemsListValuesDTO;
    items: ItemDTO[];

    constructor() {
        this.id = '';
        this.value = new ItemsListValuesDTO();
        this.items = [];
    }
}
