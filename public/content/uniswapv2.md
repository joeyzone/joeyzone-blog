# Uniswap V2 数学公式与核心机制整理

> 本文主要用于整理 Uniswap V2 中常见的数学公式与推导思路，方便后续复习 AMM、滑点、手续费、LP 份额、价格预言机以及无常损失等问题。  
> 重点不是介绍 Uniswap V2 的使用方式，而是把核心公式系统化记录下来，方便面试和工程实践中快速回忆。

---

## 1. Uniswap V2 的基本模型

Uniswap V2 使用的是恒定乘积自动做市模型，即：

$$
x \cdot y = k
$$

其中：

- $x$ 表示池子中 token0 的储备量
- $y$ 表示池子中 token1 的储备量
- $k$ 表示恒定乘积
- 在没有手续费和外部流动性变化的情况下，每次交易后都应满足新的储备量乘积不小于原来的 $k$

交易的本质是：

> 用户向池子输入一种 token，池子根据恒定乘积公式输出另一种 token。

假设用户输入 $\Delta x$ 个 token0，输出 $\Delta y$ 个 token1，则交易前后满足：

$$
x \cdot y = (x + \Delta x) \cdot (y - \Delta y)
$$

由此可得：

$$
\Delta y = y - \frac{x \cdot y}{x + \Delta x}
$$

进一步整理：

$$
\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}
$$

这是不考虑手续费时的输出公式。

---

## 2. 现货价格与边际价格

在 Uniswap V2 中，池子的即时价格由两种资产的储备比例决定。

如果用 token0 计价 token1，则：

$$
P_{0 \rightarrow 1} = \frac{y}{x}
$$

如果用 token1 计价 token0，则：

$$
P_{1 \rightarrow 0} = \frac{x}{y}
$$

需要注意的是，Uniswap V2 中的价格不是订单簿中的固定价格，而是曲线上的边际价格。

恒定乘积函数为：

$$
y = \frac{k}{x}
$$

对 $x$ 求导：

$$
\frac{dy}{dx} = -\frac{k}{x^2}
$$

因为：

$$
k = x \cdot y
$$

所以：

$$
\frac{dy}{dx} = -\frac{y}{x}
$$

因此，池子的边际价格可以理解为储备量比例：

$$
P = \frac{y}{x}
$$

---

## 3. 考虑手续费后的 swap 输出公式

Uniswap V2 默认收取 0.3% 手续费。也就是说，用户输入的 token 中，只有 99.7% 会真正参与恒定乘积计算。

设：

$$
f = 0.003
$$

则有效输入数量为：

$$
\Delta x_{\text{eff}} = \Delta x \cdot (1 - f)
$$

在 Uniswap V2 中：

$$
1 - f = 0.997
$$

所以：

$$
\Delta x_{\text{eff}} = 0.997 \Delta x
$$

输出 token 数量为：

$$
\Delta y = \frac{y \cdot \Delta x_{\text{eff}}}{x + \Delta x_{\text{eff}}}
$$

代入手续费：

$$
\Delta y = \frac{y \cdot 0.997 \Delta x}{x + 0.997 \Delta x}
$$

在合约中，为了避免浮点数，Uniswap V2 使用整数形式：

$$
\text{amountOut} =
\frac{\text{amountIn} \times 997 \times \text{reserveOut}}
{\text{reserveIn} \times 1000 + \text{amountIn} \times 997}
$$

对应代码逻辑可以理解为：

```solidity
amountInWithFee = amountIn * 997;
numerator = amountInWithFee * reserveOut;
denominator = reserveIn * 1000 + amountInWithFee;
amountOut = numerator / denominator;
```

这是 Uniswap V2 中最核心的 swap 输出公式。

## 4. 给定输出数量时，需要输入多少 token

有时候用户不是指定输入多少，而是希望精确得到某个数量的输出 token。

假设用户想得到 $\Delta y$ 个 token1，那么需要输入多少 token0？

考虑手续费后：

$$
\Delta y =
\frac{y \cdot 0.997 \Delta x}{x + 0.997 \Delta x}
$$

整理：

$$
\Delta y (x + 0.997 \Delta x) = y \cdot 0.997 \Delta x
$$

展开：

$$
\Delta y \cdot x + \Delta y \cdot 0.997 \Delta x = y \cdot 0.997 \Delta x
$$

移项：

$$
\Delta y \cdot x = 0.997 \Delta x (y - \Delta y)
$$

所以：

$$
\Delta x =
\frac{x \cdot \Delta y}{0.997 (y - \Delta y)}
$$

合约中的整数形式为：

$$
\text{amountIn} =
\frac{\text{reserveIn} \times \text{amountOut} \times 1000}
{(\text{reserveOut} - \text{amountOut}) \times 997}
$$

这里最后加 1 是为了向上取整，防止因为整数除法截断导致输入不足。

---

## 5. 滑点的数学理解

滑点来自于交易会改变池子的储备比例。

交易前价格为：

$$
P_{\text{before}} = \frac{y}{x}
$$

用户输入 $\Delta x$ 后，有效输入为：

$$
\Delta x_{\text{eff}} = 0.997 \Delta x
$$

交易后储备变为：

$$
x' = x + \Delta x_{\text{eff}}
$$

$$
y' = y - \Delta y
$$

交易后价格为：

$$
P_{\text{after}} = \frac{y'}{x'}
$$

由于用户买走了 token1，池子中 token1 减少，token0 增加，因此：

$$
P_{\text{after}} < P_{\text{before}}
$$

也就是说，token0 相对于 token1 变多，token1 变贵。

### 平均成交价格

用户实际成交的平均价格为：

$$
P_{\text{avg}} = \frac{\Delta y}{\Delta x}
$$

如果考虑手续费，实际有效成交价格可以写成：

$$
P_{\text{avg, eff}} = \frac{\Delta y}{\Delta x_{\text{eff}}}
$$

滑点可以理解为平均成交价格与交易前池子价格之间的偏离：

$$
\text{slippage} =
\frac{P_{\text{before}} - P_{\text{avg}}}{P_{\text{before}}}
$$

交易量越大，相对于池子储备量越大，滑点越明显。

---

## 6. 价格冲击 Price Impact

Price Impact 和 Slippage 很接近，但更强调交易本身对池子价格造成的影响。

交易前价格：

$$
P_{\text{before}} = \frac{y}{x}
$$

交易后价格：

$$
P_{\text{after}} = \frac{y'}{x'}
$$

价格冲击可以表示为：

$$
\text{Price Impact} =
\frac{P_{\text{before}} - P_{\text{after}}}{P_{\text{before}}}
$$

在实际前端中，用户看到的 price impact 通常还会综合考虑路由、手续费、池子深度等因素。

---

## 7. 恒定乘积中的手续费效果

在没有手续费的情况下，交易前后满足：

$$
x \cdot y = x' \cdot y'
$$

但在有手续费的情况下，手续费会留在池子中，导致交易后的实际储备乘积增加：

$$
x' \cdot y' > x \cdot y
$$

这就是为什么 LP 可以从交易中获得手续费收益。

更准确地说，只有用户输入数量的 99.7% 参与定价计算，而完整的输入数量最终会进入池子储备，因此池子的 $k$ 会变大。

可以理解为：

$$
k' > k
$$

长期来看，只要池子有交易量，手续费会让 LP 持有的池子份额对应更多资产。

---

## 8. 添加流动性 Add Liquidity

假设池子当前储备为：

$$
x, y
$$

如果用户添加流动性，为了不改变池子价格，需要按照当前储备比例添加两种 token：

$$
\frac{\Delta x}{\Delta y} = \frac{x}{y}
$$

或者：

$$
\Delta y = \frac{y}{x} \Delta x
$$

如果添加比例偏离当前池子比例，实际合约通常只会按照最优比例接收资产，多余部分退还。

### 首次添加流动性

如果池子为空，首次添加流动性时，LP token 的初始铸造数量由两种资产投入量的几何平均数决定：

$$
L = \sqrt{\Delta x \cdot \Delta y}
$$

在 Uniswap V2 中，为了防止首次流动性提供者在极端情况下完全移除流动性，合约会永久锁定一小部分最小流动性。因此，首次流动性提供者实际获得的 LP token 数量为：

$$
L_{\text{mint}} = \sqrt{\Delta x \cdot \Delta y} - 1000
$$

其中，`MINIMUM_LIQUIDITY = 1000`。

这 `1000` 个 LP token 会被永久铸造到零地址，因此无法被取回。

---

## 9. 非首次添加流动性

如果池子已经存在流动性，当前总 LP token 供应量为：

$$
L_{\text{total}}
$$

用户添加：

$$
\Delta x, \Delta y
$$

则新铸造的 LP token 数量为：

$$
L_{\text{mint}} =
\min
\left(
\frac{\Delta x \cdot L_{\text{total}}}{x},
\frac{\Delta y \cdot L_{\text{total}}}{y}
\right)
$$

这里取最小值，是为了保证用户按照池子当前比例添加流动性。

如果其中一种 token 添加过多，多出来的部分不会增加 LP 份额。

---

## 10. 移除流动性 Remove Liquidity

如果用户持有的 LP token 数量为：

$$
L_{\text{burn}}
$$

池子的总 LP token 供应量为：

$$
L_{\text{total}}
$$

当前储备为：

$$
x, y
$$

则用户可以取回的 token 数量为：

$$
\Delta x =
\frac{L_{\text{burn}}}{L_{\text{total}}} \cdot x
$$

$$
\Delta y =
\frac{L_{\text{burn}}}{L_{\text{total}}} \cdot y
$$

也就是说，LP token 表示的是对池子资产的按比例所有权。

---

## 11. LP token 的本质

LP token 可以理解为池子份额凭证。

如果某个用户持有的 LP token 数量为：

$$
L_i
$$

总供应量为：

$$
L_{\text{total}}
$$

那么用户拥有池子的比例是：

$$
s_i = \frac{L_i}{L_{\text{total}}}
$$

对应的资产份额为：

$$
x_i = s_i \cdot x
$$

$$
y_i = s_i \cdot y
$$

因此，LP 的收益来源主要包括：

1. 交易手续费带来的池子储备增长
2. 池子资产价格变化导致的资产价值变化
3. 与单纯持币相比，可能产生无常损失

---

## 12. 无常损失 Impermanent Loss

无常损失是指 LP 提供流动性后，相比单纯持有两种资产，因价格变化而产生的相对损失。

假设初始价格为：

$$
P_0
$$

价格变化后为：

$$
P_1
$$

定义价格变化倍数：

$$
r = \frac{P_1}{P_0}
$$

对于 50/50 的恒定乘积池，无常损失公式为：

$$
IL =
\frac{2\sqrt{r}}{1+r} - 1
$$

如果 $r = 1$，说明价格没有变化：

$$
IL = 0
$$

如果价格上涨 2 倍，即：

$$
r = 2
$$

则：

$$
IL =
\frac{2\sqrt{2}}{3} - 1
\approx -5.72%
$$

如果价格上涨 4 倍，即：

$$
r = 4
$$

则：

$$
IL =
\frac{2\sqrt{4}}{5} - 1
= \frac{4}{5} - 1
= -20\%
$$

需要注意：

> 无常损失不是绝对亏损，而是相对于单纯持币策略的机会成本。

如果交易手续费收益足够高，LP 仍然可能整体盈利。

---

## 13. 无常损失的简单推导

假设初始提供流动性时，两种资产价值相等。

令初始资产数量为：

$$
x_0, y_0
$$

初始价格归一化为：

$$
P_0 = 1
$$

则初始池子价值为：

$$
V_{\text{hold},0} = x_0 + y_0
$$

假设初始时两边价值相等，可以令：

$$
x_0 = y_0 = 1
$$

所以：

$$
V_{\text{hold},0} = 2
$$

当价格变为 $r$ 后，如果只是持币，则价值为：

$$
V_{\text{hold}} = r + 1
$$

对于 AMM 池子，因为满足：

$$
x \cdot y = k
$$

并且新价格为：

$$
\frac{y}{x} = r
$$

可以得到：

$$
y = r x
$$

代入恒定乘积：

$$
x \cdot r x = k
$$

$$
r x^2 = k
$$

若初始 $k = 1$，则：

$$
x = \frac{1}{\sqrt{r}}
$$

$$
y = \sqrt{r}
$$

池子中 LP 的价值为：

$$
V_{\text{LP}} = r \cdot x + y
$$

代入：

$$
V_{\text{LP}} = r \cdot \frac{1}{\sqrt{r}} + \sqrt{r}
$$

$$
V_{\text{LP}} = 2\sqrt{r}
$$

所以 LP 相比持币的相对价值为：

$$
\frac{V_{\text{LP}}}{V_{\text{hold}}}
= \frac{2\sqrt{r}}{1+r}
$$

因此无常损失为：

$$
IL =
\frac{2\sqrt{r}}{1+r} - 1
$$

---

## 14. Arbitrage 与价格回归

Uniswap V2 池子中的价格由储备比例决定：

$$
P_{\text{pool}} = \frac{y}{x}
$$

外部市场价格为：

$$
P_{\text{market}}
$$

当二者不一致时，套利者会通过交易让池子价格回归外部市场价格。

如果：

$$
P_{\text{pool}} < P_{\text{market}}
$$

说明池子中的 token1 相对便宜，套利者会买入 token1，使池子中 token1 减少、token0 增加，直到价格接近外部市场。

如果：

$$
P_{\text{pool}} > P_{\text{market}}
$$

说明池子中的 token1 相对昂贵，套利者会卖出 token1，买入 token0，直到价格回归。

套利者的存在使 AMM 池子的价格能够跟随外部市场变化。

---

## 15. 给定目标价格时需要交易多少

这是面试和协议分析中很常见的问题。

假设当前池子储备为：

$$
x, y
$$

当前池子价格为：

$$
P = \frac{y}{x}
$$

目标价格为：

$$
P^*
$$

如果不考虑手续费，交易后应满足：

$$
\frac{y'}{x'} = P^*
$$

同时：

$$
x' \cdot y' = k
$$

所以：

$$
y' = P^* x'
$$

代入：

$$
x' \cdot P^* x' = k
$$

$$
P^* x'^2 = k
$$

因此：

$$
x' = \sqrt{\frac{k}{P^*}}
$$

$$
y' = \sqrt{kP^*}
$$

如果需要把价格推到目标价格，那么需要改变的储备量为：

$$
\Delta x = x' - x
$$

$$
\Delta y = y - y'
$$

如果 $x' > x$，说明需要向池子输入 token0。
如果 $y' > y$，说明需要向池子输入 token1。

考虑手续费时，实际输入还要除以有效输入比例：

$$
\Delta x_{\text{actual}} =
\frac{\Delta x_{\text{eff}}}{0.997}
$$

---

## 16. TWAP 价格预言机

Uniswap V2 引入了累积价格机制，可以用于计算时间加权平均价格 TWAP。

池子中会维护两个累积价格变量：

$$
\text{price0CumulativeLast}
$$

$$
\text{price1CumulativeLast}
$$

每次更新时，会根据距离上次更新的时间累积价格：

$$
\text{price0Cumulative} += P_0 \cdot \Delta t
$$

$$
\text{price1Cumulative} += P_1 \cdot \Delta t
$$

其中：

$$
P_0 = \frac{\text{reserve1}}{\text{reserve0}}
$$

$$
P_1 = \frac{\text{reserve0}}{\text{reserve1}}
$$

如果要计算某个时间区间 $[t_1, t_2]$ 的 TWAP，则：

$$
\text{TWAP}_{0} =
\frac{
\text{price0Cumulative}(t_2) - \text{price0Cumulative}(t_1)
}{
t_2 - t_1
}
$$

同理：

$$
\text{TWAP}_{1} =
\frac{
\text{price1Cumulative}(t_2) - \text{price1Cumulative}(t_1)
}{
t_2 - t_1
}
$$

TWAP 的核心思想是：

> 不直接使用某一瞬间的价格，而是使用一段时间内价格的平均值，从而提高操纵成本。

---

## 17. 为什么 TWAP 更难被操纵

如果攻击者想操纵某一瞬时价格，只需要在一个区块内大额交易即可。

但如果协议使用的是一段时间的 TWAP，攻击者就需要在较长时间内持续维持被操纵价格。

假设 TWAP 时间窗口为：

$$
T
$$

攻击者操纵价格持续时间为：

$$
t
$$

操纵后的价格为：

$$
P_{\text{attack}}
$$

正常价格为：

$$
P_{\text{normal}}
$$

则 TWAP 大致为：

$$
P_{\text{TWAP}} =
\frac{
P_{\text{attack}} \cdot t + P_{\text{normal}} \cdot (T - t)
}{T}
$$

如果 $t$ 很短，那么对 TWAP 的影响有限。

因此，要显著影响 TWAP，攻击者必须延长操纵时间或大幅提高操纵价格，这都会增加成本和风险。

---

## 18. Uniswap V2 中的 K 值检查

在 pair 合约的 swap 中，Uniswap V2 不会直接根据输入参数计算用户到底输入了多少，而是在转账完成后，通过余额变化反推出输入数量。

交易后合约会读取实际余额：

$$
\text{balance0}
$$

$$
\text{balance1}
$$

然后根据输出数量和储备量反推输入数量：

$$
\text{amount0In} =
\text{balance0} > \text{reserve0} - \text{amount0Out}
?
\text{balance0} - (\text{reserve0} - \text{amount0Out})
:
0
$$

$$
\text{amount1In} =
\text{balance1} > \text{reserve1} - \text{amount1Out}
?
\text{balance1} - (\text{reserve1} - \text{amount1Out})
:
0
$$

然后进行带手续费的 $k$ 检查。

手续费调整后的余额为：

$$
\text{balance0Adjusted} = \text{balance0} \times 1000 - \text{amount0In} \times 3
$$

$$
\text{balance1Adjusted} = \text{balance1} \times 1000 - \text{amount1In} \times 3
$$

要求：

$$
\text{balance0Adjusted} \times \text{balance1Adjusted}
\ge
\text{reserve0} \times \text{reserve1} \times 1000^2
$$

也就是：

$$
\text{balance0Adjusted} \times \text{balance1Adjusted}
\ge
\text{reserve0} \times \text{reserve1} \times 1000000
$$

这就是 Uniswap V2 swap 中最核心的安全检查。

它保证了：

1. 用户必须支付足够的输入 token
2. 交易后不能破坏恒定乘积约束
3. 手续费被正确计入池子
4. 支持 flash swap，因为合约只关心最终余额是否满足约束

---

## 19. Flash Swap 的数学本质

Uniswap V2 支持 flash swap，即用户可以先拿走 token，再在同一笔交易中归还足够的 token。

从数学角度看，flash swap 并不破坏 AMM 模型，因为 pair 合约最终只检查交易结束时的余额是否满足：

$$
k' \ge k
$$

更准确地说，是满足带手续费的 adjusted balance 检查：

$$
\text{balance0Adjusted} \times \text{balance1Adjusted}
\ge
\text{reserve0} \times \text{reserve1} \times 1000^2
$$

因此，Uniswap V2 并不关心用户在中间过程如何使用借出的 token，只要求在交易结束时：

> 要么归还同一种 token 加手续费，要么归还另一种 token，使池子满足恒定乘积约束。

这也是 flash swap 可以用于套利、清算、抵押迁移等场景的原因。

---

## 20. 单边归还 Flash Swap 的手续费

如果用户借出 token0，并最终也归还 token0，那么需要归还的数量略高于借出数量。

因为输入 token 的有效比例为：

$$
0.997
$$

假设借出数量为：

$$
\Delta x
$$

需要归还数量为：

$$
R
$$

需要满足：

$$
0.997 R \ge \Delta x
$$

所以：

$$
R \ge \frac{\Delta x}{0.997}
$$

手续费比例大约为：

$$
\frac{1}{0.997} - 1 \approx 0.003009
$$

也就是约：

$$
0.3009%
$$

这也是为什么单边 flash swap 的实际手续费略高于 0.3%。

---

## 21. 多跳交易 Multi-hop Swap

如果用户从 token A 换到 token C，中间经过 token B，则路径为：

$$
A \rightarrow B \rightarrow C
$$

第一跳输出：

$$
\Delta B =
\frac{R_B \cdot 0.997 \Delta A}{R_A + 0.997 \Delta A}
$$

第二跳输出：

$$
\Delta C =
\frac{R_C \cdot 0.997 \Delta B}{R_B' + 0.997 \Delta B}
$$

其中第二跳的输入是第一跳的输出。

多跳交易的最终输出是逐池计算的结果：

$$
\text{amounts}[i+1] =
\text{getAmountOut}(
\text{amounts}[i],
\text{reserveIn}_i,
\text{reserveOut}_i
)
$$

多跳路径会带来更多手续费成本，因为每一跳都会扣除 0.3% 手续费。

如果路径长度为 $n$，则仅从手续费角度看，有效输入比例大约为：

$$
0.997^n
$$

---

## 22. 最优套利数量的直观理解

两个池子之间存在价格差时，可以套利。

假设两个池子分别是：

池子 A：

$$
x_A, y_A
$$

池子 B：

$$
x_B, y_B
$$

价格分别为：

$$
P_A = \frac{y_A}{x_A}
$$

$$
P_B = \frac{y_B}{x_B}
$$

如果：

$$
P_A < P_B
$$

说明 token1 在池子 A 中更便宜，可以在 A 买 token1，再到 B 卖出 token1。

最优套利点不是把两个池子的价格完全拉平到原始意义上的相等，而是要考虑：

1. 两边池子的深度
2. 交易手续费
3. 交易对价格曲线
4. gas 成本
5. 滑点

理想情况下，套利会进行到边际利润为 0：

$$
\text{marginal profit} = 0
$$

也就是继续增加一点交易量，获得的价格差收益刚好等于手续费与滑点成本。

---

## 23. Sandwich Attack 的数学直觉

Sandwich Attack 通常包含三步：

1. 攻击者先买入，推高价格
2. 用户按更差价格成交
3. 攻击者卖出，赚取用户造成的价格移动

假设用户原本预期输出为：

$$
\Delta y_{\text{expected}}
$$

但由于攻击者提前交易，用户实际得到：

$$
\Delta y_{\text{actual}}
$$

用户损失为：

$$
\Delta y_{\text{loss}} = \Delta y_{\text{expected}} - \Delta y_{\text{actual}}
$$

如果用户设置的最小输出为：

$$
\text{amountOutMin}
$$

只要：

$$
\Delta y_{\text{actual}} \ge \text{amountOutMin}
$$

交易仍然会成功。

因此，过高的滑点容忍度会给 sandwich attack 留出利润空间。

防范方式包括：

1. 设置合理的 `amountOutMin`
2. 使用私有交易通道
3. 减少大额单笔交易
4. 使用 TWAP 或其他抗操纵机制
5. 在协议层面限制可接受价格偏移

---

## 24. `amountOutMin` 与滑点保护

前端通常会根据用户设置的滑点容忍度计算最小输出。

假设预期输出为：

$$
\text{amountOutExpected}
$$

滑点容忍度为：

$$
s
$$

则：

$$
\text{amountOutMin} = \text{amountOutExpected} \times (1 - s)
$$

例如滑点设置为 0.5%，则：

$$
s = 0.005
$$

$$
\text{amountOutMin} = \text{amountOutExpected} \times 0.995
$$

如果实际输出低于 `amountOutMin`，交易会 revert。

---

## 25. `amountInMax` 与精确输出交易

对于 exact output swap，用户指定想要得到多少输出 token，然后设置最大可接受输入。

假设预期输入为：

$$
\text{amountInExpected}
$$

滑点容忍度为：

$$
s
$$

则最大输入为：

$$
\text{amountInMax} = \text{amountInExpected} \times (1 + s)
$$

如果实际需要输入超过 `amountInMax`，交易会 revert。

---

## 26. Uniswap V2 与订单簿的价格差异

订单簿中，每个价格档位有独立挂单：

$$
P_1, P_2, P_3, \dots
$$

AMM 中没有离散订单，而是连续价格曲线：

$$
x \cdot y = k
$$

订单簿的价格由挂单决定，AMM 的价格由资产储备比例决定。

AMM 的核心优势是：

1. 永远有报价
2. 不需要主动做市商挂单
3. 合约逻辑简单
4. 流动性可以被动提供

AMM 的核心代价是：

1. 大额交易滑点明显
2. LP 承担无常损失
3. 价格依赖套利者校准
4. 容易受到 MEV 和 sandwich attack 影响

---

## 27. 常见面试问题速记

### 27.1 为什么 Uniswap V2 使用 $x \cdot y = k$？

因为恒定乘积曲线可以保证池子在任意价格下都有流动性，不会像订单簿一样在某个价位被完全吃穿。

---

### 27.2 为什么交易后 $k$ 会变大？

因为手续费留在池子中。定价时只使用输入数量的 99.7%，但实际完整输入都会进入池子余额，所以最终：

$$
k' > k
$$

---

### 27.3 为什么添加流动性要按比例？

如果不按当前储备比例添加，就会改变池子价格，给套利者留下无风险套利空间。按比例添加可以保持：

$$
\frac{x}{y}
$$

不变。

---

### 27.4 LP token 代表什么？

LP token 代表对池子资产的份额所有权：

$$
s_i = \frac{L_i}{L_{\text{total}}}
$$

用户可以按这个比例取回池子中的两种资产。

---

### 27.5 无常损失为什么会出现？

因为 AMM 会自动在价格变化过程中“卖出上涨资产、买入下跌资产”，导致 LP 相比单纯持币少赚一部分。

---

### 27.6 TWAP 为什么更安全？

因为攻击者不能只操纵一个瞬时价格，而需要在一段时间内持续影响价格。时间窗口越长，操纵成本越高。

---

### 27.7 Flash Swap 为什么安全？

因为 Uniswap V2 在 swap 结束时检查最终余额是否满足带手续费的恒定乘积约束。只要最终满足：

$$
\text{balance0Adjusted} \times \text{balance1Adjusted}
\ge
\text{reserve0} \times \text{reserve1} \times 1000^2
$$

中间过程如何使用 token 并不重要。

---

## 28. 核心公式汇总

### 恒定乘积

$$
x \cdot y = k
$$

### 现货价格

$$
P_{0 \rightarrow 1} = \frac{y}{x}
$$

$$
P_{1 \rightarrow 0} = \frac{x}{y}
$$

### 不考虑手续费的输出

$$
\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}
$$

### 考虑手续费的输出

$$
\Delta y =
\frac{y \cdot 0.997 \Delta x}{x + 0.997 \Delta x}
$$

### 合约形式 amountOut

$$
\text{amountOut} =
\frac{\text{amountIn} \times 997 \times \text{reserveOut}}
{\text{reserveIn} \times 1000 + \text{amountIn} \times 997}
$$

### 合约形式 amountIn

$$
\text{amountIn} =
\frac{\text{reserveIn} \times \text{amountOut} \times 1000}
{(\text{reserveOut} - \text{amountOut}) \times 997}

* 1
$$

### 首次添加流动性

$$
L = \sqrt{\Delta x \cdot \Delta y}
$$

### 非首次添加流动性

$$
L_{\text{mint}} =
\min
\left(
\frac{\Delta x \cdot L_{\text{total}}}{x},
\frac{\Delta y \cdot L_{\text{total}}}{y}
\right)
$$

### 移除流动性

$$
\Delta x =
\frac{L_{\text{burn}}}{L_{\text{total}}} \cdot x
$$

$$
\Delta y =
\frac{L_{\text{burn}}}{L_{\text{total}}} \cdot y
$$

### 无常损失

$$
IL =
\frac{2\sqrt{r}}{1+r} - 1
$$

### TWAP

$$
\text{TWAP} =
\frac{
\text{priceCumulative}(t_2) - \text{priceCumulative}(t_1)
}{
t_2 - t_1
}
$$

### 带手续费的 K 检查

$$
\text{balance0Adjusted} \times \text{balance1Adjusted}
\ge
\text{reserve0} \times \text{reserve1} \times 1000^2
$$

---

## 29. 总结

Uniswap V2 的数学核心并不复杂，最重要的是围绕以下几个问题建立清晰理解：

1. 池子价格由储备比例决定：

$$
P = \frac{y}{x}
$$

2. 交易输出由恒定乘积公式决定：

$$
x \cdot y = k
$$

3. 手续费通过有效输入数量体现：

$$
\Delta x_{\text{eff}} = 0.997 \Delta x
$$

4. LP token 本质是池子份额：

$$
s_i = \frac{L_i}{L_{\text{total}}}
$$

5. 无常损失来自 AMM 被动再平衡：

$$
IL =
\frac{2\sqrt{r}}{1+r} - 1
$$

6. TWAP 通过时间加权价格降低瞬时价格操纵风险。

从工程角度看，Uniswap V2 的精妙之处在于：

> 它没有复杂订单簿，也不依赖中心化撮合，而是用一个非常简单的数学约束，把交易、做市、手续费分配、套利校准和价格发现统一到了同一个模型中。

这也是 AMM 机制在 DeFi 中具有基础设施意义的原因。
