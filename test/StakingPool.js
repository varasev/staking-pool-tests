const StakingPool = artifacts.require('StakingPool');

const ERROR_MSG = 'VM Exception while processing transaction: revert';
const BN = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bn')(BN))
  .should();

contract('StakingPool', async accounts => {
  let stakingPool;

  beforeEach(async () => {
    stakingPool = await StakingPool.new();
  });

  describe('withdrawal', async () => {
    let balanceBefore;
    let balanceAfter;
    let amountWithdrawn;

    beforeEach(async () => {
      // three participants deposit to the contract
      await stakingPool.deposit({from: accounts[1], value: 100}).should.be.fulfilled;
      await stakingPool.deposit({from: accounts[2], value: 50}).should.be.fulfilled;
      await stakingPool.deposit({from: accounts[3], value: 20}).should.be.fulfilled;

      // reward is accrued
      await stakingPool.send(1000, {from: accounts[0]}).should.be.fulfilled;
    });

    it('transfers correct values to the three participants right after reward', async () => {
      // first participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(100, {from: accounts[1]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(688));

      // second participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(50, {from: accounts[2]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(344));

      // third participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(20, {from: accounts[3]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(138));
    });

    it('transfers correct values to all participants after reward and deposit from fourth participant', async () => {
      // fourth participant deposits to the contract after pool rewarding
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(170);
      await stakingPool.deposit({from: accounts[4], value: 30}).should.be.fulfilled;
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(174);
      (await stakingPool.shares.call(accounts[4])).toNumber().should.be.equal(4);
      (await web3.eth.getBalance(stakingPool.address)).should.be.equal('1200');

      // fourth participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(4, {from: accounts[4]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(27));

      // first participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(100, {from: accounts[1]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(690));

      // second participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(50, {from: accounts[2]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(345));

      // third participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(20, {from: accounts[3]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(138));
    });

    it('transfers correct values to all participants after reward, deposit from fourth participant, and reward again', async () => {
      // fourth participant deposits to the contract after pool rewarding
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(170);
      await stakingPool.deposit({from: accounts[4], value: 30}).should.be.fulfilled;
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(174);
      (await stakingPool.shares.call(accounts[4])).toNumber().should.be.equal(4);
      (await web3.eth.getBalance(stakingPool.address)).should.be.equal('1200');

      // reward is accrued
      await stakingPool.send(1000, {from: accounts[0]}).should.be.fulfilled;
      (await web3.eth.getBalance(stakingPool.address)).should.be.equal('2200');

      // fourth participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(4, {from: accounts[4]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(50));

      // first participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(100, {from: accounts[1]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(1264));

      // second participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(50, {from: accounts[2]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(632));

      // third participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(20, {from: accounts[3]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(254));
    });

    it('transfers correct values to all participants after multiple reward, deposit from fourth participant, and reward again', async () => {
      // reward is accrued several times
      for (let i = 0; i < 10; i++) {
        await stakingPool.send(1000, {from: accounts[0]}).should.be.fulfilled;
      }
      (await web3.eth.getBalance(stakingPool.address)).should.be.equal('11170');

      // fourth participant deposits to the contract after pool rewarding
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(170);
      await stakingPool.deposit({from: accounts[4], value: 400}).should.be.fulfilled;
      (await stakingPool.totalShares.call()).toNumber().should.be.equal(176);

      // reward is accrued
      await stakingPool.send(1000, {from: accounts[0]}).should.be.fulfilled;
      (await web3.eth.getBalance(stakingPool.address)).should.be.equal('12570');

      // fourth participant withdraws their share
      balanceBefore = new BN(await web3.eth.getBalance(stakingPool.address));
      await stakingPool.withdrawal(6, {from: accounts[4]}).should.be.fulfilled;
      balanceAfter = new BN(await web3.eth.getBalance(stakingPool.address));
      amountWithdrawn = balanceBefore.sub(balanceAfter);
      amountWithdrawn.should.be.bignumber.equal(new BN(428));
    });
  });
});
