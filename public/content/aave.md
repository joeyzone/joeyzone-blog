# Aave 利率模型核心：借款利率、存款利率与累积指数

> 本文主要整理 Aave 类借贷协议中的利率计算核心，包括借款利率曲线、存款利率计算、资金利用率、储备金比例，以及 index / accumulator 累积指数机制。  
> 重点不是复述 Aave 的全部合约实现，而是从数学公式角度理解：为什么利用率越高，借款利率越高；为什么存款利率与利用率相关；以及为什么协议不需要实时更新每个用户的余额。

---

## 1. 借贷协议中的利率从哪里来？

在 Aave 这类借贷协议中，用户可以做两类操作：

1. 存款：向资金池提供资产，获得存款利息。
2. 借款：从资金池借出资产，需要支付借款利息。

协议中并不是人为固定一个利率，而是根据资金池的供需关系动态计算利率。

最核心的变量是资金利用率：

$$
U = \frac{TotalBorrow}{TotalLiquidity}
$$

其中：

- $U$ 表示资金利用率 Utilization
- $TotalBorrow$ 表示已经被借出的资金
- $TotalLiquidity$ 表示资金池总规模，通常可以理解为可用资金加已借出资金

更直观地说：

$$
U = \frac{已借出资金}{总资金}
$$

如果一个池子中一共有 1000 USDC，其中 800 USDC 已经被借出，那么：

$$
U = \frac{800}{1000} = 0.8 = 80\%
$$

资金利用率越高，说明池子中剩余可借资金越少，流动性风险越高，因此协议会提高借款利率，以抑制继续借款，并鼓励更多人存款。

---

## 2. 借款利率曲线的基本思想

Aave 类协议通常不会使用一个简单的线性利率，而是使用分段利率模型。

这样做的原因是：

- 当利用率较低时，利率上升较慢，鼓励借款需求。
- 当利用率接近某个风险阈值时，利率上升加快，抑制过度借款。
- 当利用率过高时，利率可能急剧上升或达到封顶，用于保护资金池流动性。

可以把借款利率理解为一个关于资金利用率的函数：

$$
R_{borrow} = f(U)
$$

其中：

- $R_{borrow}$ 表示借款利率
- $U$ 表示资金利用率

---

## 3. 参数定义

假设协议中定义一个借款利率曲线结构：

    pub struct BorrowRateCurve {
        pub base_rate: FixedU128,      // 基础利率，U = 0 时的利率
        pub kink1_util: FixedU128,     // 第一个拐点利用率
        pub rate_at_kink1: FixedU128,  // U = kink1 时的利率
        pub kink2_util: FixedU128,     // 第二个拐点利用率
        pub rate_at_kink2: FixedU128,  // U = kink2 时的利率，也可以理解为封顶利率
    }

为了方便书写，下面使用简化符号：

- $base$ 表示基础利率
- $kink1$ 表示第一个拐点利用率
- $rate1$ 表示第一个拐点对应的利率
- $kink2$ 表示第二个拐点利用率
- $rate2$ 表示第二个拐点对应的利率，也作为封顶利率
- $U$ 表示当前资金利用率

---

## 4. 分段借款利率公式

整个借款利率曲线可以分为三段。

---

## 4.1 第一阶段：低利用率区间

当：

$$
0 \le U \le kink1
$$

借款利率从基础利率 $base$ 线性增长到 $rate1$。

第一段斜率为：

$$
slope_1 = \frac{rate1 - base}{kink1}
$$

因此，第一段借款利率为：

$$
R(U) = base + slope_1 \cdot U
$$

这一段通常表示资金池比较宽松，可用资金较多，因此借款利率上升较慢。

---

## 4.2 第二阶段：中高利用率区间

当：

$$
kink1 < U \le kink2
$$

借款利率从 $rate1$ 继续线性增长到 $rate2$。

第二段斜率为：

$$
slope_2 = \frac{rate2 - rate1}{kink2 - kink1}
$$

因此，第二段借款利率为：

$$
R(U) = rate1 + slope_2 \cdot (U - kink1)
$$

这里要注意，第二段公式不是：

$$
R(U) = base + slope_1 \cdot U
$$

因为第一段已经在 $U = kink1$ 处结束，第二段应该以 $rate1$ 为起点继续计算。

这一段表示资金池利用率已经较高，协议开始提高利率增长速度，以降低继续借款的吸引力。

---

## 4.3 第三阶段：极高利用率区间

当：

$$
U > kink2
$$

借款利率达到封顶利率：

$$
R(U) = rate2
$$

这一段表示资金池利用率已经非常高，协议不希望借款利率无限增长，因此设置一个上限。

当然，在不同协议设计中，也可能不设置封顶，而是在第二个拐点后继续使用更陡峭的斜率增长。本文这里采用你给出的双 kink + 封顶模型。

---

## 5. 借款利率计算示例

假设参数如下：

- $base = 0.05$，即 5%
- $kink1 = 0.20$，即 20%
- $rate1 = 0.12$，即 12%
- $kink2 = 0.80$，即 80%
- $rate2 = 0.35$，即 35%

---

## 5.1 第一段斜率

第一段从利用率 0% 到 20%。

利率从 5% 上升到 12%。

因此：

$$
slope_1 = \frac{0.12 - 0.05}{0.20}
$$

$$
slope_1 = \frac{0.07}{0.20} = 0.35
$$

第一段利率公式为：

$$
R(U) = 0.05 + 0.35 \cdot U
$$

例如，当利用率为 10% 时：

$$
U = 0.10
$$

$$
R(0.10) = 0.05 + 0.35 \cdot 0.10
$$

$$
R(0.10) = 0.085
$$

也就是：

$$
R(0.10) = 8.5\%
$$

---

## 5.2 第二段斜率

第二段从利用率 20% 到 80%。

利率从 12% 上升到 35%。

因此：

$$
slope_2 = \frac{0.35 - 0.12}{0.80 - 0.20}
$$

$$
slope_2 = \frac{0.23}{0.60}
$$

$$
slope_2 \approx 0.3833
$$

第二段利率公式为：

$$
R(U) = 0.12 + 0.3833 \cdot (U - 0.20)
$$

例如，当利用率为 50% 时：

$$
U = 0.50
$$

$$
R(0.50) = 0.12 + 0.3833 \cdot (0.50 - 0.20)
$$

$$
R(0.50) = 0.12 + 0.3833 \cdot 0.30
$$

$$
R(0.50) \approx 0.235
$$

也就是：

$$
R(0.50) \approx 23.5\%
$$

---

## 5.3 第三段封顶

当利用率超过 80% 时：

$$
U > 0.80
$$

借款利率封顶为：

$$
R(U) = 0.35
$$

也就是：

$$
R(U) = 35\%
$$

---

## 6. 为什么要设置 kink？

kink 可以理解为利率曲线上的风险分界点。

在借贷协议中，资金池不能被完全借空。因为如果利用率过高，存款人想要提现时，池子可能没有足够的可用资金。

因此，协议通常会设置一个目标利用率区间。

当利用率低于 kink 时，说明资金池比较充裕，可以用较低利率鼓励借款。

当利用率超过 kink 时，说明可用流动性变少，需要快速提高借款成本，抑制继续借款。

所以，kink 的作用是：

1. 平衡借款需求和存款流动性。
2. 在资金利用率过高时快速提高借款成本。
3. 防止资金池被过度借空。
4. 让利率模型更加符合风险管理需求。

---

## 7. 存款利率如何计算？

借款人支付的利息并不会全部分配给存款人。

协议通常会从利息收入中提取一部分作为储备金，用于风险基金、保险池或协议收入。

存款利率的核心公式为：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

其中：

- $R_{lend}$ 表示存款利率
- $R_{borrow}$ 表示借款利率
- $U$ 表示资金利用率
- $reserveFactor$ 表示储备金比例
- $1 - reserveFactor$ 表示分配给存款人的利息比例

---

## 8. 存款利率公式的直观理解

为什么存款利率不是直接等于借款利率？

因为不是所有存款资金都被借出。

例如，一个池子里一共有 1000 USDC，但只有 800 USDC 被借出。

那么借款人只对这 800 USDC 支付利息，而不是对全部 1000 USDC 支付利息。

因此，借款利息要分摊给整个资金池的存款人。

这就是为什么存款利率要乘以利用率 $U$。

如果：

$$
U = 80\%
$$

说明只有 80% 的资金在产生借款利息。

此外，协议还会收取一部分储备金。

所以最终给存款人的利率是：

$$
借款利率 \times 资金利用率 \times 出借人分成比例
$$

也就是：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

---

## 9. 存款利率示例

假设：

- 借款利率 $R_{borrow} = 20\%$
- 资金利用率 $U = 80\%$
- 储备金比例 $reserveFactor = 10\%$

代入公式：

$$
R_{lend} = 20\% \times 0.8 \times (1 - 0.1)
$$

$$
R_{lend} = 20\% \times 0.8 \times 0.9
$$

$$
R_{lend} = 14.4\%
$$

因此，存款人的年化利率是：

$$
14.4\%
$$

这说明，虽然借款人支付的是 20% 的借款利率，但由于只有 80% 的资金被借出，并且协议收取 10% 的储备金，最终存款人获得的利率是 14.4%。

---

## 10. 利率与资金利用率的关系

借款利率主要由利用率决定。

利用率越高：

$$
U \uparrow
$$

借款利率越高：

$$
R_{borrow} \uparrow
$$

存款利率也通常越高：

$$
R_{lend} \uparrow
$$

但是存款利率还会受到储备金比例影响。

如果储备金比例越高：

$$
reserveFactor \uparrow
$$

则存款人获得的部分越少：

$$
R_{lend} \downarrow
$$

因此，存款利率由三个因素共同决定：

1. 借款利率
2. 资金利用率
3. 储备金比例

---

## 11. 为什么协议需要 index / accumulator？

如果协议中每个用户的余额都随着利息实时增长，那么每过一秒都需要更新所有用户余额。

这在链上是不可能的，因为：

1. 用户数量可能很多。
2. 链上存储和计算成本很高。
3. 没有人能主动为所有账户持续更新状态。
4. 合约不能自己定时执行，必须由交易触发。

因此，Aave 类协议不会实时更新每个用户的 balance。

它使用 index / accumulator 机制。

核心思想是：

> 协议只维护一个全局累积指数，用户余额通过 scaled balance × index 动态计算。

---

## 12. 累积指数的核心公式

假设当前指数为：

$$
index
$$

当前利率为：

$$
r_{current}
$$

距离上次更新经过的时间为：

$$
\Delta t
$$

一年秒数为：

$$
secondsPerYear
$$

那么指数更新公式为：

$$
index \leftarrow index \times \left(1 + r_{current} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

这个公式表示：

> 在时间 $\Delta t$ 内，根据当前年化利率计算这段时间的利息，然后把它累积到 index 中。

如果利率发生变化，不需要回头修改历史，只需要从当前时间点开始使用新的利率继续累积。

---

## 13. scaled balance 的含义

用户真实余额可以表示为：

$$
balance = scaledBalance \times index
$$

因此：

$$
scaledBalance = \frac{balance}{index}
$$

当用户存款时，协议不是简单记录用户存入了多少资产，而是记录 scaled balance。

假设用户存入金额为：

$$
amount
$$

当前指数为：

$$
index
$$

则用户获得的 scaled balance 为：

$$
scaledBalance = \frac{amount}{index}
$$

之后，随着 index 增长，用户的真实余额自然增长：

$$
balance_t = scaledBalance \times index_t
$$

---

## 14. index 示例：前 10 天利率 8%，后 20 天利率 20%

假设用户初始存入：

$$
1000
$$

初始 index 为：

$$
Index_0 = 1
$$

前 10 天存款利率为 8%。

也就是：

$$
r_1 = 0.08
$$

时间为：

$$
\Delta t_1 = 10
$$

一年按 365 天计算。

则 10 天后的 index 为：

$$
Index_{10}
=
Index_0 \times \left(1 + 0.08 \times \frac{10}{365}\right)
$$

$$
Index_{10}
=
1 \times \left(1 + 0.08 \times \frac{10}{365}\right)
$$

$$
Index_{10}
\approx 1.0021917808
$$

接下来 20 天利率变为 20%。

也就是：

$$
r_2 = 0.20
$$

时间为：

$$
\Delta t_2 = 20
$$

因此 30 天后的 index 为：

$$
Index_{30}
=
Index_{10} \times \left(1 + 0.20 \times \frac{20}{365}\right)
$$

$$
Index_{30}
\approx 1.0021917808 \times 1.0109589041
$$

$$
Index_{30}
\approx 1.0131747044
$$

如果用户的 scaled balance 对应初始 1000，则 30 天后的余额约为：

$$
Balance_{30}
=
1000 \times 1.0131747044
$$

$$
Balance_{30}
\approx 1013.175
$$

所以：

$$
1000 \rightarrow 1013.175
$$

也就是说，用户 1000 存款在 30 天后约变为 1013.175。

---

## 15. 为什么不直接更新用户 balance？

协议内部不会每天真的去更新你的 balance。

它只需要维护：

$$
index
$$

用户只需要维护：

$$
scaledBalance
$$

当用户查询或交互时，再计算：

$$
balance = scaledBalance \times index
$$

这样做有几个好处：

1. 不需要遍历所有用户。
2. 每次只更新全局 index。
3. 用户余额可以按需计算。
4. 利率变化时，只需要更新 index。
5. 链上计算和存储成本更低。

这就是 accumulator 设计的核心价值。

---

## 16. 存款指数与借款指数

在 Aave 类协议中，通常会同时维护两类指数：

1. liquidity index
2. borrow index

可以简单理解为：

- liquidity index 用于计算存款人的资产增长。
- borrow index 用于计算借款人的债务增长。

---

## 16.1 liquidity index

存款人的余额随着存款利率增长。

如果用户的 scaled deposit balance 为：

$$
scaledDeposit
$$

当前 liquidity index 为：

$$
liquidityIndex
$$

则用户当前存款余额为：

$$
depositBalance = scaledDeposit \times liquidityIndex
$$

当存款利率越高，liquidity index 增长越快，存款人的余额增长也越快。

---

## 16.2 borrow index

借款人的债务随着借款利率增长。

如果用户的 scaled debt balance 为：

$$
scaledDebt
$$

当前 borrow index 为：

$$
borrowIndex
$$

则用户当前债务为：

$$
debtBalance = scaledDebt \times borrowIndex
$$

当借款利率越高，borrow index 增长越快，借款人的债务增长也越快。

---

## 17. 存款和借款的 index 本质是一样的

虽然存款和借款看起来是相反方向，但 index 的数学本质是一样的：

$$
index \leftarrow index \times \left(1 + r \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

区别只是：

- 存款使用存款利率 $R_{lend}$
- 借款使用借款利率 $R_{borrow}$

所以：

$$
liquidityIndex \leftarrow liquidityIndex \times \left(1 + R_{lend} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

$$
borrowIndex \leftarrow borrowIndex \times \left(1 + R_{borrow} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

---

## 18. 从借款利率到存款利率，再到 index

整个利率系统可以串起来理解。

第一步，根据资金利用率计算借款利率：

$$
R_{borrow} = f(U)
$$

第二步，根据借款利率、利用率、储备金比例计算存款利率：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

第三步，根据存款利率更新 liquidity index：

$$
liquidityIndex \leftarrow liquidityIndex \times \left(1 + R_{lend} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

第四步，根据借款利率更新 borrow index：

$$
borrowIndex \leftarrow borrowIndex \times \left(1 + R_{borrow} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

第五步，用户余额通过 scaled balance 和 index 计算：

$$
depositBalance = scaledDeposit \times liquidityIndex
$$

$$
debtBalance = scaledDebt \times borrowIndex
$$

这就是 Aave 类借贷协议利率系统的核心链路。

---

## 19. 利率变化时 index 怎么处理？

假设前 10 天利用率较低，借款利率为 8%。

后 20 天利用率上升，触发拐点，借款利率变为 20%。

协议不需要重新计算前 10 天的利息。

它只需要：

1. 在第 10 天更新一次 index。
2. 从第 10 天开始使用新的利率。
3. 到第 30 天再次更新 index。

数学上就是分段累积：

$$
Index_{10}
=
Index_0 \times \left(1 + r_1 \cdot \frac{10}{365}\right)
$$

$$
Index_{30}
=
Index_{10} \times \left(1 + r_2 \cdot \frac{20}{365}\right)
$$

也可以合并写成：

$$
Index_{30}
=
Index_0
\times
\left(1 + r_1 \cdot \frac{10}{365}\right)
\times
\left(1 + r_2 \cdot \frac{20}{365}\right)
$$

这说明 index 天然支持利率分段变化。

---

## 20. 单利累积与复利累积

前面的公式：

$$
index \leftarrow index \times \left(1 + r \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

可以理解为每次更新间隔内使用简单利息。

如果更新非常频繁，效果接近连续复利。

如果要表达理论上的连续复利，可以写成：

$$
index_t = index_0 \times e^{r t}
$$

其中：

$$
t = \frac{\Delta t}{secondsPerYear}
$$

不过在链上实现中，为了计算效率和确定性，通常不会直接使用指数函数，而是采用定点数和近似计算。

对于工程理解来说，最重要的是：

> index 通过每次交互触发更新，并把时间经过产生的利息累计进去。

---

## 21. 资金利用率变化如何影响整个系统？

假设资金池状态发生变化。

当更多用户借款时：

$$
TotalBorrow \uparrow
$$

利用率上升：

$$
U \uparrow
$$

借款利率上升：

$$
R_{borrow} \uparrow
$$

存款利率也上升：

$$
R_{lend} \uparrow
$$

结果是：

- 借款变贵，抑制继续借款。
- 存款收益变高，吸引更多存款。
- 资金池流动性有机会恢复。

反过来，当更多用户还款时：

$$
TotalBorrow \downarrow
$$

利用率下降：

$$
U \downarrow
$$

借款利率下降：

$$
R_{borrow} \downarrow
$$

存款利率下降：

$$
R_{lend} \downarrow
$$

结果是：

- 借款变便宜，刺激借款需求。
- 存款收益降低，减少过度资金闲置。
- 协议回到新的供需平衡。

---

## 22. 利率模型的经济学意义

Aave 利率模型的本质是一个自动调节资金供需的机制。

当资金池资金充裕时：

$$
U \downarrow
$$

借款利率较低，鼓励借款。

当资金池资金紧张时：

$$
U \uparrow
$$

借款利率升高，抑制借款并鼓励存款。

因此，利率曲线实际上承担了两个功能：

1. 定价功能：根据资金供需决定借款成本。
2. 风控功能：通过高利用率下的高利率保护资金池流动性。

---

## 23. 储备金比例 reserve factor 的作用

储备金比例表示协议从借款利息中抽取的比例。

如果：

$$
reserveFactor = 10\%
$$

说明借款人支付的利息中，有 10% 进入协议储备，剩下 90% 分配给存款人。

存款利率公式为：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

当 reserve factor 越高：

$$
R_{lend} \downarrow
$$

协议储备增长越快：

$$
Reserve \uparrow
$$

这部分储备通常用于：

1. 协议风险准备金
2. 坏账缓冲
3. 保险基金
4. 协议收入

所以 reserve factor 是协议安全性和存款人收益之间的权衡。

---

## 24. 面试时如何解释 Aave 利率模型？

可以这样回答：

Aave 的利率模型主要根据资金利用率动态调整借款利率。资金利用率越高，说明池子中可用流动性越少，协议会提高借款利率来抑制继续借款，并提高存款收益来吸引流动性。

借款利率通常是分段函数，在低利用率时利率较低且增长缓慢，在超过 kink 之后利率增长更快，用于防止资金池被过度借空。

存款利率不是直接等于借款利率，而是：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

因为只有被借出的资金才产生利息，而且协议会抽取一部分作为储备金。

为了避免实时更新所有用户余额，Aave 使用 index 机制。用户余额不直接存储为实时增长的 balance，而是存储 scaled balance。真实余额通过：

$$
balance = scaledBalance \times index
$$

动态计算。index 会在用户交互时根据经过时间和当前利率更新。

---

## 25. 核心公式汇总

### 25.1 资金利用率

$$
U = \frac{TotalBorrow}{TotalLiquidity}
$$

---

### 25.2 第一段借款利率

当：

$$
0 \le U \le kink1
$$

$$
slope_1 = \frac{rate1 - base}{kink1}
$$

$$
R(U) = base + slope_1 \cdot U
$$

---

### 25.3 第二段借款利率

当：

$$
kink1 < U \le kink2
$$

$$
slope_2 = \frac{rate2 - rate1}{kink2 - kink1}
$$

$$
R(U) = rate1 + slope_2 \cdot (U - kink1)
$$

---

### 25.4 第三段借款利率

当：

$$
U > kink2
$$

$$
R(U) = rate2
$$

---

### 25.5 存款利率

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

---

### 25.6 index 更新

$$
index \leftarrow index \times \left(1 + r_{current} \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

---

### 25.7 用户真实余额

$$
balance = scaledBalance \times index
$$

---

### 25.8 用户 scaled balance

$$
scaledBalance = \frac{balance}{index}
$$

---

### 25.9 存款余额

$$
depositBalance = scaledDeposit \times liquidityIndex
$$

---

### 25.10 借款余额

$$
debtBalance = scaledDebt \times borrowIndex
$$

---

## 26. 总结

Aave 类借贷协议的利率系统可以分为三层理解。

第一层是借款利率。

借款利率由资金利用率决定：

$$
R_{borrow} = f(U)
$$

利用率越高，借款利率越高。这是为了保护资金池流动性。

第二层是存款利率。

存款利率来自借款人支付的利息，但需要乘以资金利用率，并扣除协议储备金：

$$
R_{lend} = R_{borrow} \times U \times (1 - reserveFactor)
$$

第三层是 index 累积指数。

协议不会实时更新每个用户余额，而是维护全局 index：

$$
index \leftarrow index \times \left(1 + r \cdot \frac{\Delta t}{secondsPerYear}\right)
$$

用户真实余额通过：

$$
balance = scaledBalance \times index
$$

计算得到。

因此，Aave 利率模型的核心可以总结为：

> 利用率决定借款利率，借款利率和利用率决定存款利率，index 负责把利率随时间累积到用户余额中。

这个设计的精妙之处在于，它同时解决了三个问题：

1. 如何根据资金供需动态定价。
2. 如何保护资金池流动性。
3. 如何在链上高效计算所有用户的利息。
