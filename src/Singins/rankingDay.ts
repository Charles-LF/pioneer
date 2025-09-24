import { Context } from "koishi"

async function getDayRanking(ctx: Context) {
    const topGolds = await ctx.database
        .select('signIn')
        .orderBy('allday', 'desc')
        .limit(10)
        .execute()
    if (topGolds.length === 0) {
        return '还未产生签到榜'
    }
    let rankingMessage = '💰 活跃榜 💰\n'
    topGolds.forEach((user, index) => {
        rankingMessage += `${index + 1}.  ${user.username}  -  ${user.allday}  天\n`
    })

    return rankingMessage
}

export default getDayRanking;