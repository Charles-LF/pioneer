export interface IItem {
    id: number
    name: string
    price: number
    description: string
}

export const Items: IItem[] = [
    {
        id: 0,
        name: "原木",
        price: 20,
        description: "平平无奇的木头，砍伐树木获得的基础材料，可以制成许多木制品."
    }, {
        id: 1,
        name: "石头",
        price: 20,
        description: "平平无奇的石头，开采矿物获得的原料，可以制作石制品"
    }, {
        id: 2,
        name: "木板",
        price: 30,
        description: "经过锯木机洗礼后的木头"
    }, {
        id: 3,
        name: "石块",
        price: 30,
        description: "经过切石机洗礼后的石头"
    }, {
        id: 4,
        name: "小木棍",
        price: 5,
        description: "谁能拒绝一根直直的小木棍呢"
    }, {
        id: 5,
        name: "小石子",
        price: 5,
        description: "表面看起来很光滑的样子"
    }
]