import { Context, Schema } from 'koishi'
import signIn from './Singins/singin'
import getGoldRanking from './Singins/rankingGold'
import getDayRanking from './Singins/rankingDay'

export const name = 'pioneer'
export const inject = ['database']

export const usage = `
    - 0.0.1 还在想要做什么
`
interface ISignInDb {
  userId: string
  username: string
  recordtime: Date
  allday: number
  gold: number
}

declare module 'koishi' {
  interface Tables {
    signIn: ISignInDb
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

  ctx.command("signin", "每天签到一下吧")
    .alias("签到").alias("冒泡")
    .action(({ session }) => {
      return signIn(ctx, session, config)
    });
  ctx.command("signin.goldRanking", "查看富豪榜").alias("富豪榜").action(() => {
    return getGoldRanking(ctx);
  });
  ctx.command("signin.dayRanking", "查看活跃榜").alias("活跃榜").action(() => {
    return getDayRanking(ctx);
  });
}
