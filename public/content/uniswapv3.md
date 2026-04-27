# Uniswap V3 数学公式与核心机制整理

> 本文是一篇面向个人复习和面试准备的 Uniswap V3 技术笔记。  
> 重点整理 Uniswap V3 中的数学模型、集中流动性、价格区间、tick、sqrtPriceX96、swap 计算、LP 头寸价值、手续费与无常损失等核心公式。  
> 与 Uniswap V2 相比，V3 最大的变化不是恒定乘积模型消失了，而是流动性从“全价格区间均匀分布”变成了“指定价格区间内集中分布”。

---

## 1. 从 Uniswap V2 到 Uniswap V3

Uniswap V2 的核心公式是：

$$
x \cdot y = k
$$

其中：

- $x$ 表示 token0 储备量
- $y$ 表示 token1 储备量
- $k$ 表示恒定乘积

在 V2 中，LP 提供的流动性分布在整个价格区间：

$$
(0, +\infty)
$$

这意味着 LP 的资金会覆盖所有可能价格，即使绝大多数价格永远不会被交易到，资金仍然被动地分布在那里。

Uniswap V3 的核心改进是：

> LP 可以选择一个价格区间，只在该区间内提供流动性。

例如，LP 可以选择只在：

$$
P_a \le P \le P_b
$$

这个价格区间内提供流动性。

其中：

- $P$ 表示当前价格
- $P_a$ 表示区间下界价格
- $P_b$ 表示区间上界价格

这就是集中流动性：

$$
\text{Concentrated Liquidity}
$$

---

## 2. Uniswap V3 的核心思想

Uniswap V3 仍然基于恒定乘积思想，但每个 LP 的流动性只在自己选择的价格区间内生效。

可以理解为：

> V3 把一条完整的 V2 曲线切成了很多小区间，每个区间都有自己的流动性。

当当前价格位于某个 LP 设置的区间内时，该 LP 的资金参与交易并赚取手续费。

当当前价格离开该 LP 的区间时，该 LP 的资金不再参与交易，也不再赚取手续费。

如果 LP 设置的区间是：

$$
[P_a, P_b]
$$

那么：

1. 当 $P < P_a$ 时，LP 头寸全部变成 token0
2. 当 $P_a \le P \le P_b$ 时，LP 同时持有 token0 和 token1
3. 当 $P > P_b$ 时，LP 头寸全部变成 token1

这是理解 V3 的关键。

---

## 3. 价格表示方式

在 Uniswap V3 中，价格通常表示为：

$$
P = \frac{\text{token1}}{\text{token0}}
$$

也就是说：

> 1 个 token0 可以兑换多少 token1。

如果 token0 是 ETH，token1 是 USDC，那么：

$$
P = \frac{USDC}{ETH}
$$

例如：

$$
P = 3000
$$

表示：

$$
1 ETH = 3000 USDC
$$

---

## 4. 为什么使用平方根价格

Uniswap V3 内部大量使用平方根价格：

$$
\sqrt{P}
$$

而不是直接使用价格 $P$。

原因是，在集中流动性模型中，token 数量和价格之间的关系用平方根价格表达会更简洁。

定义：

$$
S = \sqrt{P}
$$

其中：

- $S$ 表示 sqrt price
- $P$ 表示实际价格

因此：

$$
P = S^2
$$

Uniswap V3 合约中保存的核心价格变量是：

$$
\text{sqrtPriceX96}
$$

它表示：

$$
\text{sqrtPriceX96} = \sqrt{P} \times 2^{96}
$$

所以：

$$
\sqrt{P} = \frac{\text{sqrtPriceX96}}{2^{96}}
$$

进一步得到实际价格：

$$
P = \left(\frac{\text{sqrtPriceX96}}{2^{96}}\right)^2
$$

---

## 5. Q64.96 定点数

Solidity 中没有浮点数，因此 Uniswap V3 使用定点数表示小数。

`sqrtPriceX96` 使用的是 Q64.96 格式。

这表示：

- 整数部分最多 64 bit
- 小数部分 96 bit
- 实际值需要除以 $2^{96}$

公式为：

$$
\text{real value} = \frac{\text{stored value}}{2^{96}}
$$

所以：

$$
\sqrt{P} = \frac{\text{sqrtPriceX96}}{2^{96}}
$$

如果要还原价格：

$$
P = \frac{\text{sqrtPriceX96}^2}{2^{192}}
$$

因为：

$$
(2^{96})^2 = 2^{192}
$$

---

## 6. Tick 的概念

Uniswap V3 不直接用任意连续价格管理流动性，而是将价格离散化为 tick。

每个 tick 对应一个价格：

$$
P(i) = 1.0001^i
$$

其中：

- $i$ 是 tick index
- $1.0001$ 是每个 tick 之间的价格间隔

因此：

$$
\text{tick} = i
$$

时，对应价格为：

$$
P = 1.0001^i
$$

反过来，如果知道价格 $P$，可以计算 tick：

$$
i = \log_{1.0001}(P)
$$

换成自然对数：

$$
i = \frac{\ln P}{\ln 1.0001}
$$

在合约和 SDK 中，tick 通常取整数。

---

## 7. Tick 与 sqrt price 的关系

因为：

$$
P = 1.0001^i
$$

所以：

$$
\sqrt{P} = \sqrt{1.0001^i}
$$

也就是：

$$
\sqrt{P} = 1.0001^{i/2}
$$

因此 tick 对应的 sqrt price 为：

$$
S(i) = 1.0001^{i/2}
$$

在合约中，对应：

$$
\text{sqrtPriceX96}(i) = 1.0001^{i/2} \times 2^{96}
$$

这就是 `TickMath.getSqrtRatioAtTick(tick)` 的数学含义。

---

## 8. Tick Spacing

Uniswap V3 不允许所有 tick 都作为流动性边界。

不同手续费池有不同的 tick spacing。

常见关系是：

- 0.01% fee tier: tick spacing = 1
- 0.05% fee tier: tick spacing = 10
- 0.30% fee tier: tick spacing = 60
- 1.00% fee tier: tick spacing = 200

如果 tick spacing 为 60，那么合法 tick 必须是 60 的整数倍：

$$
i \equiv 0 \pmod{60}
$$

例如：

$$
..., -120, -60, 0, 60, 120, ...
$$

tick spacing 的作用是：

1. 降低状态数量
2. 降低存储成本
3. 控制流动性分布粒度
4. 不同费率池对应不同交易场景

一般来说：

- 稳定币交易对价格波动小，可以用低费率和更小 tick spacing
- 高波动资产交易对需要更高费率和更大 tick spacing

---

## 9. V3 中的虚拟储备

Uniswap V3 中，每个价格区间内仍然可以看作是一个恒定乘积 AMM。

但它不是直接使用真实 token 储备，而是引入了虚拟储备：

$$
x_{virtual}
$$

$$
y_{virtual}
$$

在某个价格区间内，依然满足：

$$
x_{virtual} \cdot y_{virtual} = L^2
$$

其中：

- $L$ 表示流动性 liquidity
- $L^2$ 类似于 V2 中的 $k$

因此：

$$
L = \sqrt{x_{virtual} \cdot y_{virtual}}
$$

在 V3 中，流动性 $L$ 是一个核心变量。

相比 V2 中的 $k$，V3 更常使用 $L$ 来描述池子的可交易深度。

---

## 10. 流动性 L 与价格的关系

在 V3 中，对于一个价格区间：

$$
[P_a, P_b]
$$

定义：

$$
S = \sqrt{P}
$$

$$
S_a = \sqrt{P_a}
$$

$$
S_b = \sqrt{P_b}
$$

其中：

- $S$ 是当前平方根价格
- $S_a$ 是区间下界平方根价格
- $S_b$ 是区间上界平方根价格

在当前价格位于区间内部时：

$$
S_a \le S \le S_b
$$

LP 同时持有 token0 和 token1。

---

## 11. 区间内 token0 数量公式

当价格位于区间内部：

$$
S_a \le S \le S_b
$$

LP 持有的 token0 数量为：

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

也可以写成：

$$
x = L \cdot \left(\frac{1}{S} - \frac{1}{S_b}\right)
$$

因为：

$$
\frac{S_b - S}{S \cdot S_b} = \frac{1}{S} - \frac{1}{S_b}
$$

这个公式说明：

- 当价格 $S$ 上升时，$x$ 减少
- 当价格达到上界 $S_b$ 时，$x = 0$
- 也就是说，LP 的 token0 会逐渐被换成 token1

---

## 12. 区间内 token1 数量公式

当价格位于区间内部：

$$
S_a \le S \le S_b
$$

LP 持有的 token1 数量为：

$$
y = L \cdot (S - S_a)
$$

这个公式说明：

- 当价格 $S$ 上升时，$y$ 增加
- 当价格等于下界 $S_a$ 时，$y = 0$
- 也就是说，LP 在区间底部全部是 token0，随着价格上升逐渐换成 token1

---

## 13. 三种价格状态下的 LP 资产构成

假设 LP 设置的价格区间为：

$$
[P_a, P_b]
$$

对应平方根价格为：

$$
[S_a, S_b]
$$

### 13.1 当前价格低于区间

当：

$$
P < P_a
$$

或者：

$$
S < S_a
$$

LP 的资产全部是 token0。

token0 数量为：

$$
x = L \cdot \frac{S_b - S_a}{S_a \cdot S_b}
$$

token1 数量为：

$$
y = 0
$$

含义：

> 当前价格低于 LP 设置的区间，LP 尚未开始参与交易，头寸全部表现为 token0。

---

### 13.2 当前价格位于区间内部

当：

$$
P_a \le P \le P_b
$$

或者：

$$
S_a \le S \le S_b
$$

LP 同时持有 token0 和 token1。

token0 数量为：

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

token1 数量为：

$$
y = L \cdot (S - S_a)
$$

---

### 13.3 当前价格高于区间

当：

$$
P > P_b
$$

或者：

$$
S > S_b
$$

LP 的资产全部是 token1。

token0 数量为：

$$
x = 0
$$

token1 数量为：

$$
y = L \cdot (S_b - S_a)
$$

含义：

> 当前价格高于 LP 设置的区间，LP 的 token0 已经全部被换成 token1。

---

## 14. 给定 token0 计算流动性 L

如果 LP 只根据 token0 数量计算可提供的流动性，在价格区间：

$$
[S_a, S_b]
$$

内，token0 数量公式为：

$$
x = L \cdot \frac{S_b - S_a}{S_a \cdot S_b}
$$

整理得到：

$$
L = x \cdot \frac{S_a \cdot S_b}{S_b - S_a}
$$

这通常用于当前价格低于区间时，LP 全部使用 token0 提供流动性。

---

## 15. 给定 token1 计算流动性 L

如果 LP 只根据 token1 数量计算可提供的流动性：

$$
y = L \cdot (S_b - S_a)
$$

整理得到：

$$
L = \frac{y}{S_b - S_a}
$$

这通常用于当前价格高于区间时，LP 全部使用 token1 提供流动性。

---

## 16. 当前价格在区间内时如何计算 L

当当前价格位于区间内部：

$$
S_a \le S \le S_b
$$

LP 同时需要 token0 和 token1。

根据 token0 数量可计算：

$$
L_0 = x \cdot \frac{S \cdot S_b}{S_b - S}
$$

根据 token1 数量可计算：

$$
L_1 = \frac{y}{S - S_a}
$$

最终能够提供的流动性取决于较小的一方：

$$
L = \min(L_0, L_1)
$$

原因是：

> 提供流动性必须满足当前价格下 token0 和 token1 的比例要求，其中一种 token 不足会限制最终可铸造的流动性。

---

## 17. V3 LP 头寸价值

当价格位于区间内时，LP 持有：

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

$$
y = L \cdot (S - S_a)
$$

如果用 token1 计价，且：

$$
P = S^2
$$

则 token0 的价值为：

$$
x \cdot P
$$

所以头寸总价值为：

$$
V = x \cdot P + y
$$

代入：

$$
V =
L \cdot \frac{S_b - S}{S \cdot S_b} \cdot S^2
+
L \cdot (S - S_a)
$$

化简：

$$
V =
L \cdot \frac{S(S_b - S)}{S_b}
+
L \cdot (S - S_a)
$$

这个公式可以用于估算某个 V3 LP 头寸在当前价格下的价值。

---

## 18. 集中流动性为什么提高资金效率

在 V2 中，LP 的资金分布在：

$$
(0, +\infty)
$$

整个价格范围内。

在 V3 中，LP 可以把资金集中在：

$$
[P_a, P_b]
$$

一个较窄区间。

如果真实交易价格长期在该区间内波动，那么相同资金可以提供更大的有效流动性。

简单理解：

> V3 不是让 LP 拥有更多资产，而是让 LP 把资产放到更可能被交易到的价格范围，从而提高单位资金的交易深度。

价格区间越窄，单位资金对应的流动性越高。

但代价是：

> 如果价格离开区间，LP 的资金将不再参与交易，也不再赚取手续费。

---

## 19. V3 中的价格移动与 swap

在一个 active liquidity 区间内，流动性 $L$ 是固定的。

如果用户用 token0 换 token1，池子中的 token0 增加，token1 减少，价格会下降。

如果用户用 token1 换 token0，池子中的 token1 增加，token0 减少，价格会上升。

在 V3 中，swap 的核心就是：

> 根据输入 token 数量，推动当前 sqrt price 在 tick 区间内移动；如果一个区间的流动性被用完，就跨过 tick，进入下一个区间继续计算。

---

## 20. token0 输入导致价格变化

假设在某个区间内，流动性为 $L$，当前平方根价格为 $S$。

当用户输入 token0，价格从 $S$ 下降到 $S'$。

token0 数量变化公式为：

$$
\Delta x = L \cdot \left(\frac{1}{S'} - \frac{1}{S}\right)
$$

因为 token0 输入后价格下降：

$$
S' < S
$$

所以：

$$
\frac{1}{S'} > \frac{1}{S}
$$

因此：

$$
\Delta x > 0
$$

对应的 token1 输出为：

$$
\Delta y = L \cdot (S - S')
$$

---

## 21. token1 输入导致价格变化

当用户输入 token1，价格从 $S$ 上升到 $S'$。

token1 数量变化公式为：

$$
\Delta y = L \cdot (S' - S)
$$

因为 token1 输入后价格上升：

$$
S' > S
$$

所以：

$$
\Delta y > 0
$$

对应的 token0 输出为：

$$
\Delta x = L \cdot \left(\frac{1}{S} - \frac{1}{S'}\right)
$$

---

## 22. 根据 token0 输入计算新价格

已知：

$$
\Delta x = L \cdot \left(\frac{1}{S'} - \frac{1}{S}\right)
$$

整理：

$$
\frac{\Delta x}{L} = \frac{1}{S'} - \frac{1}{S}
$$

所以：

$$
\frac{1}{S'} = \frac{\Delta x}{L} + \frac{1}{S}
$$

因此：

$$
S' = \frac{1}{\frac{1}{S} + \frac{\Delta x}{L}}
$$

进一步化简：

$$
S' = \frac{L \cdot S}{L + \Delta x \cdot S}
$$

这就是 token0 输入时，sqrt price 下降的新价格公式。

考虑手续费后，实际参与推动价格的输入是：

$$
\Delta x_{\text{eff}} = \Delta x \cdot (1 - f)
$$

因此：

$$
S' = \frac{L \cdot S}{L + \Delta x_{\text{eff}} \cdot S}
$$

---

## 23. 根据 token1 输入计算新价格

已知：

$$
\Delta y = L \cdot (S' - S)
$$

整理：

$$
S' - S = \frac{\Delta y}{L}
$$

所以：

$$
S' = S + \frac{\Delta y}{L}
$$

考虑手续费后：

$$
\Delta y_{\text{eff}} = \Delta y \cdot (1 - f)
$$

因此：

$$
S' = S + \frac{\Delta y_{\text{eff}}}{L}
$$

这就是 token1 输入时，sqrt price 上升的新价格公式。

---

## 24. token0 输入时的输出公式

当 token0 输入，价格从 $S$ 下降到 $S'$。

token1 输出数量为：

$$
\Delta y = L \cdot (S - S')
$$

其中：

$$
S' = \frac{L \cdot S}{L + \Delta x_{\text{eff}} \cdot S}
$$

所以：

$$
\Delta y =
L \cdot \left(
S - \frac{L \cdot S}{L + \Delta x_{\text{eff}} \cdot S}
\right)
$$

这表示在当前流动性区间内，输入 token0 能够换出的 token1 数量。

如果这次 swap 让价格到达当前 tick 区间边界，则需要进入下一个 tick 区间继续计算。

---

## 25. token1 输入时的输出公式

当 token1 输入，价格从 $S$ 上升到 $S'$。

token0 输出数量为：

$$
\Delta x = L \cdot \left(\frac{1}{S} - \frac{1}{S'}\right)
$$

其中：

$$
S' = S + \frac{\Delta y_{\text{eff}}}{L}
$$

所以：

$$
\Delta x =
L \cdot \left(
\frac{1}{S} -
\frac{1}{S + \frac{\Delta y_{\text{eff}}}{L}}
\right)
$$

这表示在当前流动性区间内，输入 token1 能够换出的 token0 数量。

---

## 26. 跨 Tick 交易

在 V3 中，每个 tick 可以理解为一个价格边界。

当 swap 推动价格移动到某个 tick 时，可能会发生流动性变化。

如果价格从低向高穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} + \Delta L_{\text{tick}}
$$

如果价格从高向低穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} - \Delta L_{\text{tick}}
$$

这里的正负取决于该 tick 是某些 LP 头寸的下界还是上界。

核心理解：

> V3 swap 不是在整条曲线上一次性完成，而是在一个个 tick 区间中逐段计算。每跨过一个 initialized tick，active liquidity 都可能发生变化。

---

## 27. Tick 中的 liquidityNet 与 liquidityGross

每个 initialized tick 会记录与流动性相关的数据。

两个重要概念：

$$
\text{liquidityGross}
$$

$$
\text{liquidityNet}
$$

### 27.1 liquidityGross

`liquidityGross` 表示所有以该 tick 作为边界的流动性绝对值之和。

它不区分是下界还是上界。

可以理解为：

$$
\text{liquidityGross} = \sum |L_i|
$$

### 27.2 liquidityNet

`liquidityNet` 表示价格从左向右穿过该 tick 时，active liquidity 的净变化。

如果某个头寸以该 tick 作为下界，则价格向上穿过时，该头寸开始生效：

$$
+L
$$

如果某个头寸以该 tick 作为上界，则价格向上穿过时，该头寸失效：

$$
-L
$$

因此：

$$
\text{liquidityNet} = \sum L_{\text{lower}} - \sum L_{\text{upper}}
$$

价格向上穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} + \text{liquidityNet}
$$

价格向下穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} - \text{liquidityNet}
$$

---

## 28. V3 的手续费层级

Uniswap V3 支持多个手续费等级。

常见 fee tier：

- 0.01%
- 0.05%
- 0.30%
- 1.00%

不同池子可以使用不同手续费。

一般理解：

- 稳定币交易对：价格波动小，适合低手续费
- 主流资产交易对：适合中等手续费
- 长尾资产交易对：波动大，适合高手续费

手续费参数记为：

$$
f
$$

有效输入为：

$$
\Delta x_{\text{eff}} = \Delta x \cdot (1 - f)
$$

或者：

$$
\Delta y_{\text{eff}} = \Delta y \cdot (1 - f)
$$

手续费部分会计入：

$$
\Delta x_{\text{fee}} = \Delta x \cdot f
$$

或者：

$$
\Delta y_{\text{fee}} = \Delta y \cdot f
$$

手续费按照当前 active liquidity 在区间内分配给 LP。

---

## 29. V3 手续费增长变量 feeGrowthGlobal

Uniswap V3 使用 fee growth 机制记录手续费累计增长。

对于 token0 和 token1，分别有：

$$
\text{feeGrowthGlobal0X128}
$$

$$
\text{feeGrowthGlobal1X128}
$$

它表示：

> 每单位流动性累计获得的手续费数量。

通常使用 Q128.128 定点数表示。

如果某次 swap 产生 token0 手续费：

$$
\Delta fee_0
$$

当前 active liquidity 为：

$$
L
$$

则全局手续费增长为：

$$
\Delta \text{feeGrowthGlobal0} = \frac{\Delta fee_0}{L}
$$

合约中会乘以：

$$
2^{128}
$$

所以实际存储为：

$$
\Delta \text{feeGrowthGlobal0X128}
=
\frac{\Delta fee_0 \cdot 2^{128}}{L}
$$

同理 token1：

$$
\Delta \text{feeGrowthGlobal1X128}
=
\frac{\Delta fee_1 \cdot 2^{128}}{L}
$$

---

## 30. LP 如何计算自己获得的手续费

某个 LP 头寸的流动性为：

$$
L_i
$$

该头寸在某段时间内对应的 fee growth 增量为：

$$
\Delta \text{feeGrowthInside}
$$

则该 LP 应得手续费为：

$$
\text{feesOwed} =
L_i \cdot \Delta \text{feeGrowthInside}
$$

考虑 Q128.128 定点数后：

$$
\text{feesOwed} =
\frac{
L_i \cdot \Delta \text{feeGrowthInsideX128}
}{
2^{128}
}
$$

因此，V3 手续费计算的核心不是每次交易都遍历 LP，而是通过全局累计变量和区间累计变量，让 LP 在 mint、burn、collect 时按需结算。

这是一种典型的懒结算设计。

---

## 31. feeGrowthInside 的含义

对于一个 LP 头寸：

$$
[tickLower, tickUpper]
$$

真正属于该头寸的手续费增长是区间内部的手续费增长：

$$
\text{feeGrowthInside}
$$

它可以理解为：

$$
\text{feeGrowthInside}
=
\text{feeGrowthGlobal}
-
\text{feeGrowthBelow}
-
\text{feeGrowthAbove}
$$

其中：

- `feeGrowthBelow` 表示低于 lower tick 的手续费增长
- `feeGrowthAbove` 表示高于 upper tick 的手续费增长
- 剩下的就是该头寸区间内的手续费增长

公式为：

$$
\text{feeGrowthInside}
=
\text{feeGrowthGlobal}
-
\text{feeGrowthOutsideLower}
-
\text{feeGrowthOutsideUpper}
$$

但具体计算时需要根据当前 tick 是否在区间内进行方向判断。

核心思想是：

> 只给当前价格经过 LP 区间时产生的手续费分配给该 LP。

如果价格长期在 LP 区间之外，该 LP 不会获得手续费。

---

## 32. V3 中的 NFT 头寸

Uniswap V2 中，LP token 是 ERC20。

因为 V2 中所有 LP 的流动性都等价，只是份额大小不同。

但在 Uniswap V3 中，每个 LP 可以选择不同的：

- token pair
- fee tier
- tickLower
- tickUpper
- liquidity

因此 LP 头寸不再是完全同质化的 ERC20。

V3 使用 NFT 表示 LP 头寸。

一个 V3 position 可以理解为：

$$
\text{Position} =
(\text{token0}, \text{token1}, \text{fee}, \text{tickLower}, \text{tickUpper}, L)
$$

因为每个头寸参数不同，所以它是非同质化资产。

---

## 33. V3 中的无常损失

V3 的无常损失比 V2 更复杂。

在 V2 中，流动性覆盖全价格区间，50/50 恒定乘积池的无常损失公式为：

$$
IL =
\frac{2\sqrt{r}}{1+r} - 1
$$

其中：

$$
r = \frac{P_1}{P_0}
$$

但在 V3 中，LP 只在指定区间：

$$
[P_a, P_b]
$$

内提供流动性。

因此，V3 的无常损失取决于：

1. 初始价格
2. 当前价格
3. 区间下界
4. 区间上界
5. 是否已经出区间
6. 手续费收入

狭窄区间会提高资金效率，但也会放大价格变化带来的资产转换速度。

---

## 34. V3 无常损失的直观理解

对于一个区间：

$$
[P_a, P_b]
$$

如果价格从区间中部开始上涨：

- LP 会逐渐卖出 token0
- LP 会逐渐买入或持有更多 token1
- 当价格达到上界 $P_b$ 时，LP 全部变成 token1

如果价格继续上涨，LP 不再参与交易，也不会继续获得上涨资产 token0 的收益。

因此，V3 中如果区间设置过窄，价格单边离开区间后：

> LP 会更早地完成资产转换，也更早地停止赚取手续费。

这可能导致比 V2 更明显的机会成本。

但如果价格长期在区间内震荡：

> V3 LP 可以用更少资金获得更高交易手续费收益。

所以 V3 的核心是主动流动性管理。

---

## 35. V3 LP 与限价单的关系

Uniswap V3 的集中流动性有时可以近似理解为链上限价单。

例如，当前价格低于某个区间：

$$
P < P_a
$$

LP 在：

$$
[P_a, P_b]
$$

提供 token0 流动性。

当价格上涨进入区间后，LP 的 token0 会逐渐被换成 token1。

当价格超过上界：

$$
P > P_b
$$

LP 资产全部变成 token1。

这类似于：

> 在 $[P_a, P_b]$ 区间内逐步卖出 token0，换成 token1。

如果区间设置得非常窄，就更接近一个限价单。

但是它和传统限价单仍然不同：

1. V3 是区间成交，不是单点成交
2. 成交价格沿曲线变化
3. LP 可以赚取手续费
4. 如果价格反向回到区间，资产会重新转换回来

---

## 36. 集中流动性的风险

V3 的资金效率更高，但风险也更集中。

主要风险包括：

### 36.1 出区间风险

如果价格离开 LP 设置区间：

$$
P < P_a
$$

或者：

$$
P > P_b
$$

LP 不再获得手续费。

### 36.2 更高的主动管理要求

V2 LP 可以比较被动。

V3 LP 需要考虑：

- 当前价格
- 价格波动范围
- 区间宽度
- fee tier
- 重新平衡成本
- gas 成本
- 无常损失
- 手续费收入

### 36.3 区间过窄导致频繁再平衡

区间越窄，资金效率越高，但价格越容易出区间。

这会导致：

- 收益不稳定
- 频繁调整头寸
- gas 成本增加
- 单边资产暴露增加

---

## 37. V3 中价格精度与 token decimals

实际计算价格时，不能忽略 token decimals。

如果 token0 的 decimals 为：

$$
d_0
$$

token1 的 decimals 为：

$$
d_1
$$

合约中的原始价格为：

$$
P_{raw} = \frac{\text{amount1 raw}}{\text{amount0 raw}}
$$

人类可读价格需要调整 decimals：

$$
P_{human} = P_{raw} \cdot 10^{d_0 - d_1}
$$

因为：

$$
\text{amount0 human} = \frac{\text{amount0 raw}}{10^{d_0}}
$$

$$
\text{amount1 human} = \frac{\text{amount1 raw}}{10^{d_1}}
$$

所以：

$$
P_{human}
=
\frac{\text{amount1 human}}{\text{amount0 human}}
=
\frac{\text{amount1 raw}}{\text{amount0 raw}}
\cdot
10^{d_0 - d_1}
$$

如果从 `sqrtPriceX96` 计算价格：

$$
P_{raw} = \frac{\text{sqrtPriceX96}^2}{2^{192}}
$$

则：

$$
P_{human}
=
\frac{\text{sqrtPriceX96}^2}{2^{192}}
\cdot
10^{d_0 - d_1}
$$

这一点在 ETH/USDC 之类交易对中特别重要。

---

## 38. ETH/USDC 价格示例

假设：

- token0 = ETH，decimals = 18
- token1 = USDC，decimals = 6

如果价格表示为：

$$
P = \frac{USDC}{ETH}
$$

那么：

$$
d_0 = 18
$$

$$
d_1 = 6
$$

所以 decimals 调整因子为：

$$
10^{18 - 6} = 10^{12}
$$

人类可读价格为：

$$
P_{human}
=
P_{raw} \cdot 10^{12}
$$

如果没有进行 decimals 调整，得到的价格会差很多数量级。

---

## 39. V3 Oracle 机制

Uniswap V3 也提供价格预言机能力。

相比 V2 的 price cumulative，V3 使用 observation 机制记录历史数据。

核心记录包括：

- blockTimestamp
- tickCumulative
- secondsPerLiquidityCumulativeX128
- initialized

其中最重要的是：

$$
\text{tickCumulative}
$$

它表示 tick 随时间的累计值。

如果在时间区间：

$$
[t_1, t_2]
$$

内，tickCumulative 分别为：

$$
C_1
$$

$$
C_2
$$

则该时间窗口的平均 tick 为：

$$
\text{avgTick} =
\frac{C_2 - C_1}{t_2 - t_1}
$$

然后可以通过平均 tick 计算 TWAP 价格：

$$
P_{\text{TWAP}} = 1.0001^{\text{avgTick}}
$$

---

## 40. V3 TWAP 的数学形式

V3 的 TWAP 可以理解为：

$$
\text{avgTick}
=
\frac{
\int_{t_1}^{t_2} tick(t) \, dt
}{
t_2 - t_1
}
$$

因为 tick 和价格的关系是：

$$
P = 1.0001^{tick}
$$

所以：

$$
P_{\text{TWAP}} = 1.0001^{\text{avgTick}}
$$

注意这里是基于 tick 的时间加权平均。

它不是简单地对价格 $P$ 做算术平均，而是对 tick 做平均后再转换为价格。

因为 tick 本质上是价格的对数表示：

$$
tick = \log_{1.0001}(P)
$$

所以 V3 TWAP 更接近几何平均价格。

---

## 41. secondsPerLiquidity 的作用

除了价格 oracle，V3 还记录：

$$
\text{secondsPerLiquidityCumulativeX128}
$$

它表示每单位流动性累积经过的时间。

直观理解：

$$
\text{secondsPerLiquidity}
=
\int \frac{1}{L(t)} dt
$$

乘以定点数精度后：

$$
\text{secondsPerLiquidityCumulativeX128}
=
\int \frac{2^{128}}{L(t)} dt
$$

它可以用于衡量某个区间内流动性的时间分布。

对于 LP 激励、流动性挖矿、时间加权流动性统计等场景有用。

---

## 42. V3 与 V2 的核心差异

### 42.1 流动性分布

V2：

$$
(0, +\infty)
$$

V3：

$$
[P_a, P_b]
$$

V3 允许 LP 自定义价格区间。

---

### 42.2 LP token 类型

V2 LP token 是 ERC20，因为所有 LP 份额同质化。

V3 LP position 是 NFT，因为每个头寸的 tick 区间和流动性都可能不同。

---

### 42.3 价格管理

V2 只有一个全局储备比例：

$$
P = \frac{y}{x}
$$

V3 使用：

$$
\text{sqrtPriceX96}
$$

和：

$$
tick
$$

来管理价格。

---

### 42.4 手续费

V2 通常固定为 0.3%。

V3 支持多个 fee tier：

$$
0.01\%, 0.05\%, 0.3\%, 1\%
$$

---

### 42.5 资金效率

V2 资金效率较低，但被动管理更简单。

V3 资金效率更高，但需要更主动的区间管理。

---

## 43. 面试常见问题速记

### 43.1 Uniswap V3 相比 V2 最大改进是什么？

最大改进是集中流动性。

V2 的流动性分布在整个价格区间：

$$
(0, +\infty)
$$

V3 允许 LP 指定价格区间：

$$
[P_a, P_b]
$$

从而提高资金效率。

---

### 43.2 为什么 V3 使用 sqrtPriceX96？

因为在 V3 的数学模型中，token 数量与平方根价格之间的关系更简单。

例如：

$$
x = L \cdot \left(\frac{1}{S} - \frac{1}{S_b}\right)
$$

$$
y = L \cdot (S - S_a)
$$

其中：

$$
S = \sqrt{P}
$$

同时 Solidity 没有浮点数，所以用 Q64.96 定点数保存：

$$
\text{sqrtPriceX96} = \sqrt{P} \times 2^{96}
$$

---

### 43.3 tick 是什么？

tick 是离散化的价格索引。

每个 tick 对应价格：

$$
P = 1.0001^{tick}
$$

tick 越大，价格越高。

---

### 43.4 V3 中 LP 为什么是 NFT？

因为每个 LP 头寸可能有不同的：

- token pair
- fee tier
- tickLower
- tickUpper
- liquidity

这些头寸不是同质化的，所以不能简单用 ERC20 表示，只能用 NFT 表示。

---

### 43.5 当前价格低于 LP 区间时，LP 持有什么？

如果：

$$
P < P_a
$$

LP 头寸全部是 token0。

---

### 43.6 当前价格高于 LP 区间时，LP 持有什么？

如果：

$$
P > P_b
$$

LP 头寸全部是 token1。

---

### 43.7 当前价格在区间内时，LP 持有什么？

如果：

$$
P_a \le P \le P_b
$$

LP 同时持有 token0 和 token1。

数量为：

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

$$
y = L \cdot (S - S_a)
$$

---

### 43.8 V3 的资金效率为什么更高？

因为 LP 可以把资金集中在更可能成交的价格区间，而不是平均分布在所有价格。

区间越窄，相同资金提供的有效流动性越大。

但风险是价格更容易离开区间。

---

### 43.9 liquidityNet 是什么？

`liquidityNet` 表示价格穿过某个 tick 时，active liquidity 的净变化。

价格向上穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} + \text{liquidityNet}
$$

价格向下穿过 tick：

$$
L_{\text{active}} = L_{\text{active}} - \text{liquidityNet}
$$

---

### 43.10 V3 swap 为什么要跨 tick 计算？

因为不同价格区间内 active liquidity 可能不同。

swap 推动价格移动时，如果到达某个 initialized tick，需要更新 active liquidity，然后进入下一个价格区间继续计算。

---

### 43.11 V3 TWAP 如何计算？

V3 使用 tickCumulative。

平均 tick 为：

$$
\text{avgTick}
=
\frac{
\text{tickCumulative}(t_2) - \text{tickCumulative}(t_1)
}{
t_2 - t_1
}
$$

然后：

$$
P_{\text{TWAP}} = 1.0001^{\text{avgTick}}
$$

---

### 43.12 V3 为什么更适合稳定币交易？

稳定币价格波动范围小，LP 可以设置很窄的价格区间。

这会让资金集中在稳定币实际交易范围附近，从而提供极高资金效率和较低滑点。

---

## 44. 核心公式汇总

### 44.1 价格与 tick

$$
P = 1.0001^{tick}
$$

$$
tick = \frac{\ln P}{\ln 1.0001}
$$

---

### 44.2 价格与 sqrt price

$$
S = \sqrt{P}
$$

$$
P = S^2
$$

---

### 44.3 sqrtPriceX96

$$
\text{sqrtPriceX96} = \sqrt{P} \times 2^{96}
$$

$$
P = \frac{\text{sqrtPriceX96}^2}{2^{192}}
$$

---

### 44.4 tick 对应 sqrt price

$$
S(i) = 1.0001^{i/2}
$$

$$
\text{sqrtPriceX96}(i) = 1.0001^{i/2} \times 2^{96}
$$

---

### 44.5 区间内 token0 数量

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

或者：

$$
x = L \cdot \left(\frac{1}{S} - \frac{1}{S_b}\right)
$$

---

### 44.6 区间内 token1 数量

$$
y = L \cdot (S - S_a)
$$

---

### 44.7 当前价格低于区间

$$
x = L \cdot \frac{S_b - S_a}{S_a \cdot S_b}
$$

$$
y = 0
$$

---

### 44.8 当前价格高于区间

$$
x = 0
$$

$$
y = L \cdot (S_b - S_a)
$$

---

### 44.9 根据 token0 计算 L

$$
L = x \cdot \frac{S_a \cdot S_b}{S_b - S_a}
$$

---

### 44.10 根据 token1 计算 L

$$
L = \frac{y}{S_b - S_a}
$$

---

### 44.11 当前价格在区间内时根据 token0 计算 L

$$
L_0 = x \cdot \frac{S \cdot S_b}{S_b - S}
$$

---

### 44.12 当前价格在区间内时根据 token1 计算 L

$$
L_1 = \frac{y}{S - S_a}
$$

---

### 44.13 最终可提供流动性

$$
L = \min(L_0, L_1)
$$

---

### 44.14 token0 输入导致价格下降

$$
\Delta x = L \cdot \left(\frac{1}{S'} - \frac{1}{S}\right)
$$

$$
S' = \frac{L \cdot S}{L + \Delta x_{\text{eff}} \cdot S}
$$

$$
\Delta y = L \cdot (S - S')
$$

---

### 44.15 token1 输入导致价格上升

$$
\Delta y = L \cdot (S' - S)
$$

$$
S' = S + \frac{\Delta y_{\text{eff}}}{L}
$$

$$
\Delta x = L \cdot \left(\frac{1}{S} - \frac{1}{S'}\right)
$$

---

### 44.16 fee growth

$$
\Delta \text{feeGrowthGlobalX128}
=
\frac{\Delta fee \cdot 2^{128}}{L}
$$

---

### 44.17 LP 应得手续费

$$
\text{feesOwed}
=
\frac{
L_i \cdot \Delta \text{feeGrowthInsideX128}
}{
2^{128}
}
$$

---

### 44.18 V3 TWAP

$$
\text{avgTick}
=
\frac{
\text{tickCumulative}(t_2) - \text{tickCumulative}(t_1)
}{
t_2 - t_1
}
$$

$$
P_{\text{TWAP}} = 1.0001^{\text{avgTick}}
$$

---

### 44.19 decimals 调整

$$
P_{human}
=
P_{raw} \cdot 10^{d_0 - d_1}
$$

如果从 sqrtPriceX96 计算：

$$
P_{human}
=
\frac{\text{sqrtPriceX96}^2}{2^{192}}
\cdot
10^{d_0 - d_1}
$$

---

## 45. 一句话总结 Uniswap V3

Uniswap V3 的本质是：

> 在恒定乘积 AMM 的基础上，将流动性从全价格区间改为自定义价格区间，从而用更复杂的数学和头寸管理，换取更高的资金效率。

从数学上看，最重要的是理解以下关系：

1. 价格与 tick 的关系：

$$
P = 1.0001^{tick}
$$

2. 价格与 sqrt price 的关系：

$$
S = \sqrt{P}
$$

3. sqrtPriceX96 的定点数表示：

$$
\text{sqrtPriceX96} = S \times 2^{96}
$$

4. 区间内 token0 和 token1 数量：

$$
x = L \cdot \frac{S_b - S}{S \cdot S_b}
$$

$$
y = L \cdot (S - S_a)
$$

5. 当前价格离开区间后，LP 会变成单边资产。

Uniswap V3 相比 V2 更适合专业 LP 和主动做市策略。

它提高了资金效率，但也引入了：

- 区间管理
- tick 管理
- 手续费层级选择
- 主动再平衡
- 更复杂的无常损失
- 更复杂的合约与数学实现

因此，理解 V3 的关键不是背公式，而是建立一个整体图景：

> LP 选择价格区间，价格在 tick 之间移动，active liquidity 随 tick 变化，swap 在区间内逐段计算，手续费只分配给当前区间内的 LP。
