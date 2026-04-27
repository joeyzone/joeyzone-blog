# Exploring DAO Governance

## Overview

Official docs: [MakerDAO Governance Module](https://docs.makerdao.com/smart-contract-modules/governance-module)

This article focuses on **Executive Voting**. Non-executive voting will be covered in the last section. Note that official docs don't explain non-executive voting.

### Quick Governance Flow

1. **Initiate Vote** → Write Spell contract + description file
2. **MKR Voting** → Users lock MKR tokens for voting power
3. **Execute** → Highest vote proposal enters execution queue after review period

![governance-flow](/content/img/makerdao/gov_dao.png)

The official docs divide governance into 3 parts corresponding to 3 smart contracts (the 3 green sections in the diagram above).

> ⚠️ The official templates are 6 years old and differ from the current flow. I'll explain based on the latest process.

We'll use the Aug 22, 2024 governance process as example: [Executive Vote](https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024)

---

## 1. Initiating a Vote

### 1-1. Description File

The description is a Markdown file on GitHub. Example:

[Executive vote - August 22, 2024](https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive%20vote%20-%20August%2022%2C%202024.md)

Generate the hash using forge + cast:

```bash
cast keccak -- "$(wget 'https://raw.githubusercontent.com/makerdao/community/8d95eaf1c9eb6722008172504df88bc27f91ed3c/governance/votes/Executive%20vote%20-%20August%202024.md' -q -O - 2>/dev/null)"
```

This hash will be stored in the Spell contract's `description` variable.

### 1-2. Spell Contract

The Spell contract template is available on the official site.

> 📝 Old template (6 years old): [ds-spell](https://github.com/dapphub/ds-spell/blob/master/src/spell.sol)

Find the Spell address and source code on [Etherscan](https://vote.makerdao.com/executive/template-executive-vote-lite-psm-usdc-a-phase-2-setup-august-22-2024).

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

    function description() external view returns (string memory) {
        return SpellAction(action).description();
    }

    function officeHours() external view returns (bool) {
        return SpellAction(action).officeHours();
    }

    function nextCastTime() external view returns (uint256 castTime) {
        return SpellAction(action).nextCastTime(eta);
    }

    constructor(uint256 _expiration, address _spellAction) {
        pause = PauseAbstract(log.getAddress("MCD_PAUSE"));
        expiration = _expiration;
        action = _spellAction;

        sig = abi.encodeWithSignature("execute()");
        bytes32 _tag;
        address _action = _spellAction;
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

contract DssSpell is DssExec {
    constructor()
        DssExec(block.timestamp + 30 days, address(new DssSpellAction()))
    {}
}
```

Key points:
- **DssSpell** = 30-day valid vote
- **schedule()** → calls `pause.plot()` to add to execution queue
- **cast()** → calls `pause.exec()` to execute the spell

> ⚠️ The `pause` has a `delay` setting - minimum time before entering execution queue.
> `eta` = `block.timestamp + delay` (can be longer if set by proposer)

### 1-3. SpellAction Contract

```solidity
contract DssSpellAction is DssAction {
    string public constant override description =
        "2024-08-22 MakerDAO Executive Spell | Hash: 0xe3794c...";

    function actions() public override {
        // Update PSM state
        DssExecLib.setContract(RWA014_A_INPUT_CONDUIT_URN, "psm", MCD_LITE_PSM_USDC_A);
        DssExecLib.setContract(RWA014_A_INPUT_CONDUIT_JAR, "psm", MCD_LITE_PSM_USDC_A);
        // ... more actions
    }

    function canCast(uint40 _ts, bool _officeHours) public pure returns (bool) {
        if (_officeHours) {
            uint256 day = (_ts / 1 days + 3) % 7;
            if (day >= 5) return false;  // Weekend
            uint256 hour = (_ts / 1 hours) % 24;
            if (hour < 14 || hour >= 21) return false;  // Outside office hours
        }
        return true;
    }
}
```

The `actions()` method contains all configuration changes. Note the `canCast` restriction - execution only during business hours.

> 📝 All official spell contracts are in [spells-mainnet](https://github.com/makerdao/spells-mainnet) repo.

---

## 2. MKR Voting

VoteProxy simply wraps the chief contract methods:

```solidity
function lock(uint256 wad) public auth {
    gov.pull(cold, wad);   // MKR from cold wallet
    chief.lock(wad);       // MKR out, IOU in
}

function free(uint256 wad) public auth {
    chief.free(wad);       // IOU out, MKR in
    gov.push(cold, wad);   // MKR to cold wallet
}

function vote(address[] memory yays) public auth returns (bytes32) {
    return chief.vote(yays);
}
```

### 2-1. Convert to Voting Weight

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

- **lock** → MKR → IOU (voting weight)
- **free** → IOU → MKR

> 📌 IOU is not the voting weight itself, just a tracking token for MKR.

Chief contract: [0x0a3f6849f78076aefaDf113F5BED87720274dDC0](https://etherscan.io/address/0x0a3f6849f78076aefaDf113F5BED87720274dDC0)

### 2-2. Voting

```solidity
function vote(address[] memory yays) public returns (bytes32) {
    bytes32 slate = etch(yays);
    vote(slate);
    return slate;
}

function vote(bytes32 slate) public note {
    // slate = hash of spell array or empty hash
    uint weight = deposits[msg.sender];
    subWeight(weight, votes[msg.sender]);
    votes[msg.sender] = slate;
    addWeight(weight, votes[msg.sender]);
}
```

Two voting methods:
- **Array**: support multiple spells (addresses must be ascending)
- **Slate**: hash of spell array

The spell with most votes becomes `hat`. But `hat` requires manual `lift()` - not automatic.

```solidity
function lift(address whom) public note {
    require(approvals[whom] > approvals[hat]);
    hat = whom;
}
```

> ⚠️ chief uses Solidity 0.4 - no `virtual`/`override`.

Now free won't affect voting. Best time to unlock MKR.

---

## 3. Execute Proposal

Once `pause.plot()` adds the Spell to execution queue and `eta` passes, anyone can call `spell.cast()`.

```solidity
contract DSPause is DSAuth, DSNote {
    function exec(address usr, bytes32 tag, bytes memory fax, uint eta)
        public note returns (bytes memory out)
    {
        require(plans[hash(usr, tag, fax, eta)], "ds-pause-unplotted-plan");
        require(soul(usr) == tag, "ds-pause-wrong-codehash");
        require(now >= eta, "ds-pause-premature-exec");

        plans[hash(usr, tag, fax, eta)] = false;
        out = proxy.exec(usr, fax);
        require(proxy.owner() == address(this), "ds-pause-illegal-storage-change");
    }
}

contract DSPauseProxy {
    function exec(address usr, bytes memory fax) public auth returns (bytes memory out) {
        bool ok;
        (ok, out) = usr.delegatecall(fax);
        require(ok, "ds-pause-delegatecall-error");
    }
}
```

> 🔗 `delegatecall` preserves `msg.sender` as pauseproxy, completing the execution闭环.

---

## 4. Kill Spell (Emergency)

If a proposal is inappropriate, create a new vote and call `pause.drop()`:

```solidity
function drop(address usr, bytes32 tag, bytes memory fax, uint eta) public note auth {
    plans[hash(usr, tag, fax, eta)] = false;
}
```

No time limit - can quickly kill during review period.

Pause contract: [0xbe286431454714f511008713973d3b053a2d38f3](https://etherscan.io/address/0xbe286431454714f511008713973d3b053a2d38f3)

---

## Non-Executive Voting

Used for document changes without smart contract modifications.

### Flow

1. Create proposal in GitHub
2. Community managers merge + assign Pool ID
3. Vote with MKR balance (no token locking)

> 📌 No Spell contract, has Pool ID instead.

Example: [Multiple Scope Bootstrapping Edits - August 12, 2024](https://vote.makerdao.com/polling/QmaDkRuh#vote-breakdown)

Voting emits `Vote` events - backend counts MKR balance for results.

- L1 and L2 (ARB) contracts deployed to save gas

---

## Appendix: Actions Contracts

ChainLog: [makerdao.com/api/mainnet/active.json](https://chainlog.makerdao.com/api/mainnet/active.json)

Example action contract: [RWA014_A_INPUT_CONDUIT_URN](https://etherscan.io/address/0x6B86bA08Bd7796464cEa758061Ac173D0268cf49#code)

```solidity
function file(bytes32 what, address data) external auth {
    if (what == "quitTo") {
        quitTo = data;
    } else if (what == "to") {
        to = data;
    } else if (what == "psm") {
        require(PsmAbstract(data).dai() == address(dai), "...");
        require(GemJoinAbstract(PsmAbstract(data).gemJoin()).gem() == address(gem), "...");
        gem.approve(address(psm.gemJoin()), 0);
        gem.approve(address(PsmAbstract(data).gemJoin()), type(uint256).max);
        psm = PsmAbstract(data);
    }
}
```