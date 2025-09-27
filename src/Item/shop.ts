import { Context, Session } from "koishi";
import { IItem, Items } from "./items";

export async function showShopItem() {
    let msg = `💰 Charles的黑心商店 💰\n`
    Items.forEach((item: IItem) => {
        msg += `${item.id}. ${item.name} - ${item.price} 血汗钱\n`
    })
    return msg + `购买发送 /购买 ID 数量\n查看物品说明发送 /查看物品 ID`
}
export async function lookItem(itemID: number) {
    const target: IItem = Items.find(Items => Items.id === itemID)
    if (target == null) {
        return `没有找到Id为${itemID}的商品哦！`
    }
    let msg = `💰 物品信息 💰\n`
    msg += `ID: ${target.id}\n名称: ${target.name}\n价格: ${target.price} 血汗钱\n介绍: ${target.description}\n`
    return msg
}


export async function buyFromShop(session: Session, ctx: Context, itemID: number, stack: number) {
    const target: IItem = Items.find(Items => Items.id === itemID)
    const player = await ctx.database.get("signIn", { userId: session.userId })
    let target_backpack = await ctx.database.get("backpack", { userId: session.userId }) || []
    if (target == null) {
        return `没有找到Id为${itemID}的商品哦！`
    }
    if (player.length == 0) {
        return `没有找到您的信息哦，发送 /冒泡 签到一下吧！`
    }
    if (target.price * stack > player[0].gold) {
        return `没那么多血汗钱哎，还差整整 ${target.price * stack - player[0].gold} 血汗钱嘞`
    }
    // 背包不存在  新建然后买入
    if (target_backpack.length == 0) {
        ctx.database.create("backpack", {
            userId: session.userId,
            Items: [{
                id: itemID,
                stack: stack
            }]
        })
        return `首次成功买入物品，使用 /查看背包 即可看到您的库存`
    }
    const itemList = target_backpack[0].Items
    const stackIndex = itemList.findIndex(item => item.id == itemID)
    // 物品存在于数据库，则修改
    if (stackIndex != -1) {
        itemList[stackIndex].stack += stack
        await ctx.database.upsert("backpack", [{
            userId: target_backpack[0].userId,
            Items: itemList
        }])
        await ctx.database.set("signIn", { userId: session.userId }, { gold: player[0].gold -= target.price })
        return `本轮交易已成功，使用 /查看背包 即可看到您的库存`
    }
    //物品不存在于数据库但有背包
    await ctx.database.upsert("backpack", [{
        userId: session.userId,
        Items: [...itemList, {
            id: itemID,
            stack: stack
        }]
    }])
    await ctx.database.set("signIn", { userId: session.userId }, { gold: player[0].gold -= target.price })
    return `本次交易已顺利完成，使用 /查看背包 即可看到您的库存`
}
export async function sellToShop(session: Session, ctx: Context, itemID: number, stack = 1) {
    const player = await ctx.database.get("signIn", { userId: session.userId })
    const target_backpack = await ctx.database.get("backpack", { userId: session.userId }) || []
    const target: IItem = Items.find(Items => Items.id === itemID)
    if (target == null) {
        return `没有找到Id为${itemID}的商品哦！`
    }
    if (player.length == 0) {
        return `没有找到您的信息哦，发送 /冒泡 签到一下吧！`
    }
    if (target_backpack.length == 0) {
        return `您背包里还没有东西嘞`
    }

    const itemList = target_backpack[0].Items
    const stackIndex = itemList.findIndex(item => item.id == itemID)
    // 物品存在于数据库，则修改
    // 黑心钱,但是还是不写转手续费到自己的账号了（ 0.0*
    const price = Math.floor(target.price * 0.8)
    if (stackIndex != -1) {
        itemList[stackIndex].stack -= stack
        await ctx.database.upsert("backpack", [{
            userId: target_backpack[0].userId,
            Items: itemList
        }])
        await ctx.database.set('signIn', { userId: session.userId }, {
            gold: player[0].gold + price
        })
        return `本轮交易已成功,我们收取了一些手续费，您一共获得 ${price} 枚血汗钱，使用 /查看背包 即可看到您的库存，欢迎下次光临！`
    }
}