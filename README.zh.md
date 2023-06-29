# spaced-repetition.js

[English Version](README.md)

本项目是间隔重复记忆算法的简单实现，目前已实现了算法SM-2、SM-4和SM-5。

## 目录

- [简介](#简介)
- [安装](#安装)
- [使用方法](#使用方法)
- [贡献](#贡献)
- [许可证](#许可证)

## 简介

间隔重复记忆法是由Piotr Woźniak在80年代创造，旨在提高记忆效果和效率。顾名思义，间隔重复记忆法的核心是寻找知识点的最佳复习间隔时间。算法通过计算知识点的学习情况得出复习的最佳间隔时间。这套算法已经迭代了很多个版本。

目前根据官方文档我们只实现了SM-2、SM-4和SM-5。

### SM-2

SM-2是间隔重复记忆算法的第一个版本，它使用重复次数、学习效果以及一个因数efactor来计算复习间隔时间。算法简单明了，应用广泛，比较知名的的产品如Anki、Mnemosyne一直在使用。

SM-2的缺点就是无法利用以往的学习数据来优化间隔时间。

### SM-4

SM-4引入了一个矩阵（OIMatrix）来解决SM-2无法利用学习数据优化间隔时间的问题。按作者的说法，这个算法收敛的太慢，以至于几个月后，矩阵并没有太大变化。

7个月后被SM-5取代。

### SM-5

SM-5不再使用OIMatrix，改用OFMatrix，并且达到了作者预期的效果。

## 安装

安装 `spaced-repetition.js`, 只需要执行如下命令:
```zsh
npm install spaced-repetition.js
```

## 使用方法

早期版本（1.0.x）导出了太多用户无需关心的数据，所以在1.1.x版本中，我们做了一些优化，这些数据都整合到了一起，用户只需要在调用算法后存储下来，并在使用算法时再传递过来就可以了。这也导致了SM-2算法有两种使用方式。

算法只关心重复次数（count）、记忆质量（quality）、efactor、以及SM-4和SM-5中的矩阵数据。这些数据算法自己计算使用，用户只负责存储和传递即可。

**注意：**所有算法中计算出来的间隔（interval）的单位都是**天**。

### SM-2在1.0.x中的使用方法
```ts
//1.0.x中的使用方法，在1.1.x及以后仍可以使用。
import sm2, {SM2Item} from 'spaced-repetition.js';

//获取一个知识卡，卡中存放着需要记忆的知识点。
const card = getCardFromSomeWhere();

//根据知识卡，获取对应的SM-2算法相关数据：重复次数、efactor、间隔时间。
//第一次使用可为空
const { count, efactor, interval } = getSM2ItemByCard(card);

//给展示知识卡后，用户（或系统自动）为这次记忆做出评估，分数为0,1,2,3,4,5
const quality = getQualityFromUserResponse(card);

//构造SM2Item,其中quality不能为空。
//其他三项可为空，意味着这是一个新知识点，比没有SM-2相关数据。
const item: SM2Item = { count, efactor, interval, quality }; 

//将item传递给sm2函数计算得出结果。
const result: SM2Result = sm2(item);

//结果包含needRepeat和item两个字段。
const { needRepeat, item } = result;
const { count, efactor, interval } = item;

//通过interval计算出下次复习的日期。
const nextRepetitionDate = dayjs().add(interval, 'day');
//将item中的相关数据存储到知识卡相关的位置，方便下次使用。
saveSM2DataByCard(card, count, efactor, interval, nextRepetitionDate);

//如果needRepeat为true，意味着这个知识卡记忆不牢固，需要再次记忆直到为false。
//也就是本知识卡重复以上过程。
if (needRepeat) {
    scheduleAgain(card);
}

//下一张知识卡
...
```

### 1.1.x使用方法
1.1.x版本中，相关数据都整合到了一个string类型的字段（smdata）中。矩阵数据需要独立存储。需要注意的是，不同版本的算法数据是不通用的，不能混合使用。

```ts
//以下为SM-4算法的使用实例，只需要调用SMFactory.getSuperMemo时更换不同的SMType即可使用其他算法

import { SMFactory, SMType } from 'spaced-repetition.js';

//获取知识卡
const cards = getCardsFromSomewhere();

//获取矩阵数据，如果第一次使用，可为空，算法会自动初始化一份数据。
//如果使用SM-2算法，这行代码不需要。
const matrix = getMatrixFromSomewhere();

//获取对应算法，可以通过SMType.SM2和SMType.SM5来初始化SM-2和SM-5算法。
//注意：SM-2算法不需要传递matrix参数。
const sm4 = SMFactory.getSuperMemo(SMType.SM4, matrix);

for (const card of cards) {
    //获取卡片对应数据。
    const smdata = getSMDataByCard(card);

    //获取卡片记忆质量
    const quality = getQualityFromUserResponse(card);

    //计算下次间隔时间
    const result: SMResult = sm4?.evaluate(quality, smdata);

    //更新卡片相关数据，
    updateCard(card,result!.interval,result!.smdata);

    //每次学习一张卡片后，矩阵数据都会有变化，建议及时存储。
    saveMatrixToSomewhere(sm4?.getMatrix());

    //如果本卡片学习不合格，需要再次重复。
    if (result?.repeat) {
        scheduleAgain(card);
    }
}
```

## 贡献

...

## 许可证

MIT许可证