# Exploring DAO Governance

## Overview

官网：[https://docs.makerdao.com/smart-contract-modules/governance-module](https://docs.makerdao.com/smart-contract-modules/governance-module)

首先需要说明的是，这是执行投票的整个流程，非执行投票会放到文章最后一章节 “**非执行投票**”。非执行投票在官网中并没有讲解。

我先简单说一下整个治理流程：

- **Step1: 发起投票** — 编写 Spell 合约，编写描述文件，合约地址跟描述文件组合成一个投票
- **Step2: 民意投票** — 用户用手中的 MKR 代币锁定，并获得相应的投票权重投票
- **Step3: 执行投票** — 如果某个提案得票最高，将放到待执行队列，等审核期过了之后即可执行

官网中主要分成三个部分分别对应三个合约来讲述，对应下图 3 个绿色部分。

> note: 需要说明的是，官网关于 3 个合约的模板是 6 年前的，跟现在的流程是有一些区别的，上面官网的图也有一些误导的地方。下面我会以最新的流程来讲解。

![gov_dao.png](/content/img/makerdao/gov_dao.png)

我们以投票治理的 3 个阶段来分别详细分析整个流程及调用的合约。

接下来，我们会以 2024-08-22 号的一个治理过程来讲解整个流程。

[https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024](https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024)

## 1. 发起投票治理

### 1-1. 投票描述文档（description）

其中格式一般是这样的：

![description格式](/content/img/makerdao/gov_dao.png)

描述文件是一个 GitHub 上的 Markdown 文件。例如：

[https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive vote - August 22%2C 2024.md](https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive%20vote%20-%20August%2022%2C%202024.md)

安装 forge 及相应的 cast 命令工具，执行以下命令，算出 hash 值：

```
cast keccak -- "$(wget 'https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive vote - August 22%2C 2024.md' -q -O - 2>/dev/null)"
```

记录下 hash 值，之后会记录在 spell 合约的 constant description 变量中。

### 1-2. 编写 spell 合约

最新的官网，有一个 Spell 合约的模板例子。

老模板：https://github.com/dapphub/ds-spell/blob/master/src/spell.sol 这个是 6 年前的老模板，现在已经有了一些变化。

在此链接中，你可以找到 Spell Address，在区块浏览器中，你可以看到这个合约的源码：

[https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024](https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024)

```solidity
contract DssExec {
    Changelog public constant log =
        Changelog(0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F);
    uint256 public eta;
    bytes public sig;
    bool public done;
    bytes32 public immutable tag;
    address public immutable action;
    uint256 public immutable expiration;
    PauseAbstract public immutable pause;

    // Provides a descriptive tag for bot consumption
    // This should be modified weekly to provide a summary of the actions
    // Hash: seth keccak -- "$(wget https://<executive-vote-canonical-post> -q -O - 2>/dev/null)"
    function description() external view returns (string memory) {
        return SpellAction(action).description();
    }

    function officeHours() external view returns (bool) {
        return SpellAction(action).officeHours();
    }

    function nextCastTime() external view returns (uint256 castTime) {
        return SpellAction(action).nextCastTime(eta);
    }

    // @param _description  A string description of the spell
    // @param _expiration   The timestamp this spell will expire. (Ex. block.timestamp + 30 days)
    // @param _spellAction  The address of the spell action
    constructor(uint256 _expiration, address _spellAction) {
        pause = PauseAbstract(log.getAddress("MCD_PAUSE"));
        expiration = _expiration;
        action = _spellAction;

        sig = abi.encodeWithSignature("execute()");
        bytes32 _tag; // Required for assembly access
        address _action = _spellAction; // Required for assembly access
        assembly {
            _tag := extcodehash(_action)
        }
        tag = _tag;
    }

    function schedule() public {
        require(block.timestamp <= expiration, "This contract has expired");
        require(eta == 0, "This spell has already been scheduled");
        eta = block.timestamp + PauseAbstract(pause).delay();
        pause.plot(action, tag, sig, eta);
    }

    function cast() public {
        require(!done, "spell-already-cast");
        done = true;
        pause.exec(action, tag, sig, eta);
    }
}

.....

contract DssSpell is DssExec {
    constructor()
        DssExec(block.timestamp + 30 days, address(new DssSpellAction()))
    {}
}
```

DssSpellAction 合约放到下面再讲，现在只要知道 action 合约代表了你要执行的具体内容。

首先，构建了一个 DssSpell，有效期 30 天的投票。这个合约最主要的两个方法 schedule，cast，对应了图中从 Spell 进来及出去的两根线。

schedule 就是执行 pause 合约的 plot 方法，也就是把 action 放到即将执行的队列。能否真正成功放到待执行队列，还需要看 chief 合约的判断（主要看投票结果及时间）。chief 合约会在下面讲到。

pause 方法有个 delay 的设置，也就是说这个投票至少要经过多长时间，才能进入待执行队列。

eta 这个设置，最小就是 block.timestamp + delay，当然提案发起者可以设置成更长的审核时间。

[https://docs.makerdao.com/smart-contract-modules/governance-module/pause-detailed-documentation](https://docs.makerdao.com/smart-contract-modules/governance-module/pause-detailed-documentation) : The configurable delay attribute sets the minimum wait time that will be used during the governance of the system.

cast 就是执行这个投票 action 了。也是调用 pause 的 exec 方法。在 pause 合约中，只要在待执行队列，并且满足审核时间约束就可以被执行成功。任何人可以调用。

### 1-3 SpellAction 合约

```solidity
contract DssSpellAction is DssAction {
    // Provides a descriptive tag for bot consumption
    // This should be modified weekly to provide a summary of the actions
    // Hash: cast keccak -- "$(wget 'https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive%20vote%20-%20August%2022%2C%202024.md' -q -O - 2>/dev/null)"
    string public constant override description =
        "2024-08-22 MakerDAO Executive Spell | Hash: 0xe3794c8152d2a1de72080b1fc7d8429a979015b3f41cbe2c26f755724c70951d";
	  ....
	   function actions() public override {
        // ----- Update PSM state variable in the conduit contracts to MCD_LITE_PSM_USDC_A -----
        // Forum: https://forum.makerdao.com/t/lite-psm-usdc-a-phase-2-major-migration-proposed-parameters/24839
        // Poll: https://vote.makerdao.com/polling/QmU7XJ6X

        // RWA014_A_INPUT_CONDUIT_URN
        DssExecLib.setContract(
            RWA014_A_INPUT_CONDUIT_URN,
            "psm",
            MCD_LITE_PSM_USDC_A
        );

        // RWA014_A_INPUT_CONDUIT_JAR
        DssExecLib.setContract(
            RWA014_A_INPUT_CONDUIT_JAR,
            "psm",
            MCD_LITE_PSM_USDC_A
        );
       
       ....
	  
	  function canCast(uint40 _ts, bool _officeHours) public pure returns (bool) {
        if (_officeHours) {
            uint256 day = (_ts / 1 days + 3) % 7;
            if (day >= 5) {
                return false;
            } // Can only be cast on a weekday
            uint256 hour = (_ts / 1 hours) % 24;
            if (hour < 14 || hour >= 21) {
                return false;
            } // Outside office hours
        }
        return true;
    }
	  
  }
```

actions 方法里面执行你需要的配置。需要注意的是会有 canCast 的限制，只有工作时间才可以执行 spell 的 cast，也就是 actions。

actions 里面的合约，例如 RWA014_A_INPUT_CONDUIT_URN，他的 auth 是 pauseproxy。

具体 actions 调用了哪些合约，请看结尾补充。

接下来就是部署这个 Spell 合约，得到 Spell Address。结合描述文件，在前端展示一个投票，用户就是为 Spell Address 投票。

> note: 官方的所有的投票合约都是更新到这个项目 https://github.com/makerdao/spells-mainnet，你可以在这个项目 main 分支找到历史提交的 Spell，包括这次 8-22 的。这个项目是通过创建 pull request 方式更新的。

## 2. 民意投票

图中的 VoteProxy，只是简单的封装了一下 chief 合约的方法

```solidity
function lock(uint256 wad) public auth {
    gov.pull(cold, wad);   // mkr from cold
    chief.lock(wad);       // mkr out, ious in
}

function free(uint256 wad) public auth {
    chief.free(wad);       // ious out, mkr in
	  gov.push(cold, wad);   // mkr to cold
}

function freeAll() public auth {
    chief.free(chief.deposits(address(this)));
    gov.push(cold, gov.balanceOf(address(this)));
}

function vote(address[] memory yays) public auth returns (bytes32) {
    return chief.vote(yays);
}

function vote(bytes32 slate) public auth {
    chief.vote(slate);
}
```

接下来，我会详细介绍 chief 合约。

MakerDAO chief 合约地址: 0x0a3f6849f78076aefaDf113F5BED87720274dDC0

### 2-1 兑换投票权重

```solidity
function lock(uint wad) public note {
    GOV.pull(msg.sender, wad);
    IOU.mint(msg.sender, wad);
    deposits[msg.sender] = add(deposits[msg.sender], wad);
    addWeight(wad, votes[msg.sender]);
}

function free(uint wad) public note {
    deposits[msg.sender] = sub(deposits[msg.sender], wad);
    subWeight(wad, votes[msg.sender]);
    IOU.burn(msg.sender, wad);
    GOV.push(msg.sender, wad);
}
```

lock 就是拿 MKR 兑换成 IOU 代币，free 相反。addWeight，subWeight 就是增加权重及减少权重。

需要注意的是，IOU 并不代表你的投票权重，至于 IOU 代币有什么作用，官方的注释是：

> non-voting representation of a token, for e.g. secondary voting mechanisms。

其实并没有实际功能。只是为了追踪 MKR 代币。

IOU 地址：[https://etherscan.io/address/0xA618E54de493ec29432EbD2CA7f14eFbF6Ac17F7](https://etherscan.io/address/0xA618E54de493ec29432EbD2CA7f14eFbF6Ac17F7)

### 2-2 投票提案

```solidity
function vote(
  address[] memory yays
) public returns (bytes32) // note  both sub-calls note
{
    bytes32 slate = etch(yays);
    vote(slate);
    return slate;
}

function vote(bytes32 slate) public note {
    require(
        slates[slate].length > 0 ||
            slate ==
            0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470,
        "ds-chief-invalid-slate"
    );
    uint weight = deposits[msg.sender];
    subWeight(weight, votes[msg.sender]);
    votes[msg.sender] = slate;
	  addWeight(weight, votes[msg.sender]);
}
```

这里有两种投票方式：

- **数组方式**：你可以同时支持多个 spell，但是请注意，spell 地址需要按照从小到大排列。
- **slate 方式**：也就是 spell 数组算出的 hash 值。

投票数最多的就会成为 chief 合约的 hat，也就是这个 spell 成为 hat。

这个概念很重要。但是要注意，hat 是要人为调用 lift 的，并不是自动成为 hat 的。

```solidity
function lift(address whom) public note {
  require(approvals[whom] > approvals[hat]);
	hat = whom;
}
```

```solidity
contract DSChief is DSRoles, DSChiefApprovals
```

现在我们需要注意一下，chief 是个什么合约了，其实是个 DSRoles 合约。

```solidity

function isUserRoot(address who) public view returns (bool) {
		return (who == hat);
}
....
function canCall(
    address caller,
    address code,
    bytes4 sig
) public view returns (bool) {
    if (isUserRoot(caller) || isCapabilityPublic(code, sig)) {
        return true;
    } else {
        bytes32 has_roles = getUserRoles(caller);
        bytes32 needs_one_of = getCapabilityRoles(code, sig);
        return bytes32(0) != has_roles & needs_one_of;
    }
}
```

这个就在 pause 的 plot 方法中体现了，plot 方法用 auth 修饰符，也就是 canCall。

此时 free 已经不影响投票结果和后面的执行。这也是最佳解锁 IOU 的时间点。

当然你可以不选择 free，把 IOU 作为下次投票使用，每次新的投票会把之前旧的投票权重减少，再增加到新的投票上。

> note: 由于 chief 是 MakerDAO 很多年前部署，用的仍然是 0.4 版本。以至于没有用 virtual, override。

## 3. 执行提案

其实只要 pause 合约的 plot 方法，把提案（Spell）放入到待执行列表中，过了审核时间（eta），谁都可以调用 spell 的 cast 方法执行提案。

spell 的 cast 方法又调用 pause.exec。第一步 spell 合约中已有体现。

```solidity
contract DSPause is DSAuth, DSNote {
	function exec(
      address usr,
      bytes32 tag,
      bytes memory fax,
      uint eta
  ) public note returns (bytes memory out) {
      require(plans[hash(usr, tag, fax, eta)], "ds-pause-unplotted-plan");
      require(soul(usr) == tag, "ds-pause-wrong-codehash");
      require(now >= eta, "ds-pause-premature-exec");

      plans[hash(usr, tag, fax, eta)] = false;

      out = proxy.exec(usr, fax);
      require(
          proxy.owner() == address(this),
          "ds-pause-illegal-storage-change"
      );
  }
  ....
}

contract DSPauseProxy {
	function exec(
	    address usr,
      bytes memory fax
  ) public auth returns (bytes memory out) {
	    bool ok;
      (ok, out) = usr.delegatecall(fax);
      require(ok, "ds-pause-delegatecall-error");
  }
  ....
}
```

需要注意的是，这里用到的 delegatecall，也就是在目标合约看来，msg.sender 仍然是 pauseproxy，这样就完成了闭环。

## 4. 废弃提案（异常）

如果管理者发现这个提案不合适，则应发起一个新提案，重新走完投票过程。最终调用 pause 的 drop 方法。

```solidity
function drop(address usr, bytes32 tag, bytes memory fax, uint eta) public note auth {
      plans[hash(usr, tag, fax, eta)] = false;
}
```

由于 drop 方法没有时间限制，所以在提案审核期内，是可以通过投票流程迅速废弃该提案的。

MakerDAO Pause: [https://etherscan.io/address/0xbe286431454714f511008713973d3b053a2d38f3](https://etherscan.io/address/0xbe286431454714f511008713973d3b053a2d38f3)

## 非执行投票

> 这是一个修改部分文档的提案，不需要合约代码参与修改。

非执行投票会多一个 POOL ID，并且没有 Spell Address，这个我们会后续讲解。

### 1. GitHub 中创建提案信息

详见：[Multiple Scope Bootstrapping Edits - August 12, 2024](https://github.com/makerdao/community/blob/master/governance/polls/Multiple%20Scope%20Bootstrapping%20Edits%20-%20August%2012%2C%202024.md#review)

### 2. 提案审核

社区管理者如果觉得提案通过，则 merge pull，并且为它分配一个唯一 Pool Id，这个 Id 的分配应该是服务器端或者某种人为机制。并不是通过合约。

### 3. 投票阶段

投票阶段并不涉及任何 MKR 资产的操作，只是抛出 Vote 事件，至于投票比例，都是后端统计，应该是统计他的 balanceOf MKR。

这个链接是投票 tx：

[https://arbiscan.io/tx/0x459cd6954dc7ff0318ed07c23bc084d1d1e2c7c85aac4f4f499320ae5f6edbf5](https://arbiscan.io/tx/0x459cd6954dc7ff0318ed07c23bc084d1d1e2c7c85aac4f4f499320ae5f6edbf5)

这个是投票合约：

[https://arbiscan.io/address/0x4f4e551b4920a5417f8d4e7f8f099660dadadcec#code](https://arbiscan.io/address/0x4f4e551b4920a5417f8d4e7f8f099660dadadcec#code)

```solidity
function vote(uint256[] calldata pollIds, uint256[] calldata optionIds)
      external
{
      require(pollIds.length == optionIds.length, "non-matching-length");
      for (uint i = 0; i < pollIds.length; i++) {
          emit Voted(msg.sender, pollIds[i], optionIds[i]);
    }
    
// 委托人投票, 跟上面一样
function vote(address voter, uint256 nonce, uint256 expiry, uint256[] calldata pollIds, uint256[] calldata optionIds, uint8 v, bytes32 r, bytes32 s)
        external
  ......
```

总的来说，非执行投票还是比较简单的，投票者只要愿意出上链手续费，并用手中持有的 MKR 做票据即可。并且 MakerDAO 为了省投票者手续费，在 L1, L2 (ARB) 都部署了合约。

## Actions 补充

ChainLog: [https://chainlog.makerdao.com/api/mainnet/active.json](https://chainlog.makerdao.com/api/mainnet/active.json)

actions 操作的合约: RWA014_A_INPUT_CONDUIT_URN

地址: [https://etherscan.io/address/0x6B86bA08Bd7796464cEa758061Ac173D0268cf49#code](https://etherscan.io/address/0x6B86bA08Bd7796464cEa758061Ac173D0268cf49#code)

```solidity
function file(bytes32 what, address data) external auth {
    if (what == "quitTo") {
        quitTo = data;
    } else if (what == "to") {
        to = data;
    } else if (what == "psm") {
        require(PsmAbstract(data).dai() == address(dai), "RwaSwapInputConduit2/wrong-dai-for-psm");
        require(
            GemJoinAbstract(PsmAbstract(data).gemJoin()).gem() == address(gem),
            "RwaSwapInputConduit2/wrong-gem-for-psm"
        );

        // Revoke approval for the old PSM gemjoin
        gem.approve(address(psm.gemJoin()), 0);
        // Give unlimited approval to the new PSM gemjoin
        gem.approve(address(PsmAbstract(data).gemJoin()), type(uint256).max);

        psm = PsmAbstract(data);
    } else {
        revert("RwaSwapInputConduit2/unrecognised-param");
    }

    emit File(what, data);
}

```