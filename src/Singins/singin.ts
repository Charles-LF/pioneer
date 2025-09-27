import { Context, Session } from "koishi";
import { Config } from "..";

async function signIn(ctx: Context, session: Session, config: Config) {
    const userId = session.userId
    const username = session.username
    const isInDb = await ctx.database.get('signIn', { userId })
    const gold = Math.floor(Math.random() * (config.maxGold - config.minGold + 1)) + config.minGold
    const backpack = await ctx.database.get("backpack", { userId: session.userId })
    // 如果没有签到记录 就直接创建一条
    if (isInDb.length === 0) {
        await ctx.database.create('signIn', {
            userId, username, recordtime: new Date(), gold, allday: 1
        })
        await ctx.database.create("backpack", {
            userId: session.userId,
            Items: [{
                id: 4,
                stack: 1
            }]
        })
        return `签到成功咯！累计签到了 1 天，本次签到获得了${gold}血汗钱！\n 首次签到送您小木棍一根`
    }
    if (backpack.length == 0) {
        await ctx.database.create('backpack', {
            userId: session.userId,
            Items: [{
                id: 4,
                stack: 1
            }]
        })
    }
    const goldnew = isInDb[0].gold + gold
    const recordtime = isInDb[0].recordtime
    // 检查是否可以签到
    if (isCheckIn(recordtime)) {
        const allday = isInDb[0].allday + 1
        await ctx.database.upsert('signIn', [{
            userId: userId,
            username: username,
            recordtime: new Date(),
            gold: goldnew,
            allday: allday
        }])
        return `签到成功咯！累计签到了 ${allday} 天，今天签到获得了${gold}血汗钱！`
    }

    return `今天已经签到过了哦~~~~ (๑•́ ₃ •̀๑)`

}

function isCheckIn(recordtime: Date) {
    function getDateOnlyTimestamp(date: Date): number {
        const dateCopy = new Date(date);
        dateCopy.setHours(0, 0, 0, 0);
        return dateCopy.getTime();
    }
    const lastCheckInDate = getDateOnlyTimestamp(recordtime);
    const todayDate = getDateOnlyTimestamp(new Date());
    return todayDate - lastCheckInDate >= 86400000;
}

export default signIn;