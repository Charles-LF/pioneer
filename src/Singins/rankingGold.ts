import { Context } from "koishi"

async function getGoldRanking(ctx: Context) {
    const topGolds = await ctx.database
        .select('signIn')
        .orderBy('gold', 'desc')
        .limit(10)
        .execute()
    if (topGolds.length === 0) {
        return '还未产生富豪榜'
    }
    let rankingMessage = '💰 富豪榜 💰\n'
    topGolds.forEach((user, index) => {
        rankingMessage += `${index + 1}.  ${user.username}  -  ${user.gold}  血汗钱\n`
    })

    return rankingMessage
}

export default getGoldRanking;