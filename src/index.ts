import { Context, Schema } from 'koishi'
import signIn from './Singins/singin'
import getGoldRanking from './Singins/rankingGold'
import getDayRanking from './Singins/rankingDay'
import { buyFromShop, lookItem, sellToShop, showShopItem } from './Item/shop'
import { lookBackpack } from './Player/backpack'

export const name = 'pioneer'
export const inject = ['database']

export const usage = `
    - 0.0.1 还在想要做什么
`
// 签到数据库
interface ISignInDb {
  userId: string
  username: string
  recordtime: Date
  allday: number
  gold: number
}
// 背包数据库
interface IPack {
  userId: string
  Items: [{
    id: number
    stack: number
  }]
}

declare module 'koishi' {
  interface Tables {
    signIn: ISignInDb
    backpack: IPack
  }
}

export interface Config {
  minGold: number
  maxGold: number
}

export const Config: Schema<Config> = Schema.object({
  minGold: Schema.number().default(1).description('最小金币数'),
  maxGold: Schema.number().default(20).description('最大金币数')
})

export function apply(ctx: Context, config: Config) {
  // 扩展数据库
  ctx.model.extend('signIn', {
    userId: 'string',
    username: 'string',
    allday: 'integer',
    recordtime: 'date',
    gold: 'integer'

  }, {
    primary: 'userId',
  })
  ctx.model.extend('backpack', {
    userId: 'string',
    Items: 'json'
  }, {
    primary: 'userId'
  })

  ctx.command("signin", "每天签到一下吧").alias("签到").alias("冒泡").action(({ session }) => signIn(ctx, session, config));
  ctx.command("signin.goldRanking", "查看富豪榜").alias("富豪榜").action(() => getGoldRanking(ctx));
  ctx.command("signin.dayRanking", "查看活跃榜").alias("活跃榜").action(() => getDayRanking(ctx));
  ctx.command("shop", "查看Charles的商店").alias("商店").action(() => showShopItem());
  ctx.command("shop.lookItem <id:integer>", "瞅瞅物品的信息").alias("查看物品").action(({ session }, id) => lookItem(id));
  ctx.command("shop.sell <id:integer> [stack:integer]", "从Charles商店卖出物品").alias("卖出物品").action(({ session }, id, stack = 1) => sellToShop(session, ctx, id, stack));
  ctx.command("shop.buy <id:integer> [stack:integer]", "从Charles商店购买物品").alias("购买物品").action(({ session }, id, stack = 1) => buyFromShop(session, ctx, id, stack));
  ctx.command("backpack", "查看背包").alias("查看背包").action(({ session }) => lookBackpack(session, ctx));

}
