const price = 19.5;
const cid = [
  ['PENNY', 0.5],
  ['NICKEL', 0],
  ['DIME', 0],
  ['QUARTER', 0],
  ['ONE', 0],
  ['FIVE', 0],
  ['TEN', 0],
  ['TWENTY', 0],
  ['ONE HUNDRED', 0],
];

const cashInput = document.getElementById('cash');
const changeDueElement = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');

purchaseBtn.addEventListener('click', () => {
  const cashGiven = parseFloat(cashInput.value);
  if (Number.isNaN(cashGiven)) {
    // eslint-disable-next-line no-alert
    alert('Please enter a valid number');
    return;
  }

  if (cashGiven < price) {
    // eslint-disable-next-line no-alert
    alert('Customer does not have enough money to purchase the item');
    return;
  }

  const changeDue = cashGiven - price;
  if (changeDue === 0) {
    changeDueElement.textContent = 'No change due - customer paid with exact cash';
    return;
  }

  function calculateChange(changeDue, cid) {
    const denominations = [
      ['PENNY', 0.01],
      ['NICKEL', 0.05],
      ['DIME', 0.10],
      ['QUARTER', 0.25],
      ['ONE', 1.00],
      ['FIVE', 5.00],
      ['TEN', 10.00],
      ['TWENTY', 20.00],
      ['ONE HUNDRED', 100.00],
    ];

    const totalCid = cid.reduce((sum, [, amount]) => sum + amount, 0).toFixed(2);

    const change = [];
    let remainingChangeDue = changeDue;

    for (let i = denominations.length - 1; i >= 0; i -= 1) {
      const [denomination, value] = denominations[i];
      let amountInDrawer = cid.find((item) => item[0] === denomination)[1];

      let amountToReturn = 0;

      while (remainingChangeDue >= value && amountInDrawer > 0) {
        remainingChangeDue -= value;
        remainingChangeDue = Math.round(remainingChangeDue * 100) / 100;
        amountInDrawer -= value;
        amountToReturn += value;
      }

      if (amountToReturn > 0) {
        change.push([denomination, amountToReturn]);
      }
    }

    const totalChangeGiven = change.reduce((sum, [, amount]) => sum + amount, 0).toFixed(2);
    if (remainingChangeDue > 0) {
      return { status: 'INSUFFICIENT_FUNDS', change: [] };
    }

    if (totalCid === totalChangeGiven) {
      return {
        status: 'CLOSED',
        change: change.sort((a, b) => denominations.indexOf(b[0]) - denominations.indexOf(a[0])),
      };
    }

    return { status: 'OPEN', change: change.sort((a, b) => {
      const aIndex = denominations.findIndex(([name]) => name === a[0]);
      const bIndex = denominations.findIndex(([name]) => name === b[0]);
      return bIndex - aIndex;
    })};

  }

  const change = calculateChange(changeDue, cid);

  if (change.status === 'INSUFFICIENT_FUNDS') {
    changeDueElement.textContent = 'Status: INSUFFICIENT_FUNDS';
  } else if (change.status === 'CLOSED') {
    changeDueElement.innerHTML = `Status: CLOSED ${change.change.map((c) => `${c[0]}: $${c[1].toFixed(2)}`).join('<br>')}`;
  } else {
    changeDueElement.innerHTML = `Status: OPEN ${change.change.map((c) => `${c[0]}: $${c[1].toFixed(2)}`).join('<br>')}`;
  }
});