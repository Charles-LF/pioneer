import { Context, Session } from "koishi";
import { Items } from "../Item/items";

export async function lookBackpack(session: Session, ctx: Context) {
    const player = await ctx.database.get('signIn', { userId: session.userId })
    const target_backpack = await ctx.database.get("backpack", {
        userId: session.userId
    })
    if (target_backpack.length == 0) {
        return `还么有创建数据哦，发送 /冒泡 先签到一下吧`
    }
    if (player.length == 0) {
        return `还么有创建数据哦，发送 /冒泡 先签到一下吧`
    }
    let msg = `💰 背包 💰\n血汗钱:  ${player[0].gold}\n`
    target_backpack[0].Items.forEach((itemID, count) => {
        const item = Items.find(i => i.id === itemID.id)
        count = target_backpack[0].Items[0].stack
        if (item) msg += `物品ID: ${item.id}  名称: ${item.name}  数量: ${itemID.stack} \n`
    })
    return msg
}