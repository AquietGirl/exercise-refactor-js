function getAmountByTypeAndAudience(performance) {
  let thisAmount = 0;
  switch (performance.play.type) {
    case "tragedy":
      thisAmount = 40000;
      if (performance.audience > 30) {
        thisAmount += 1000 * (performance.audience - 30);
      }
      break;
    case "comedy":
      thisAmount = 30000;
      if (performance.audience > 20) {
        thisAmount += 10000 + 500 * (performance.audience - 20);
      }
      thisAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${performance.play.type}`);
  }
  return thisAmount;
}

function updateVolumeCredits(performance, volumeCredits) {
  volumeCredits += Math.max(performance.audience - 30, 0);

  if ("comedy" === performance.play.type)
    volumeCredits += Math.floor(performance.audience / 5);

  return volumeCredits;
}

function renderResult(data) {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  let result = `Statement for ${data.customer}\n`;
  data.performances.forEach((e) => {
    console.log(e);
    result += ` ${e.play.name}: ${format(e.thisAmount / 100)} (${
      e.audience
    } seats)\n`;
  });

  result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
  result += `You earned ${data.volumeCredits} credits \n`;

  return result;
}

function statement(invoice, plays) {
  let data = {
    customer: invoice.customer,
    totalAmount: 0,
    volumeCredits: 0,
    performances: [],
  };

  for (let perf of invoice.performances) {
    perf.play = plays[perf.playID];
    perf.thisAmount = getAmountByTypeAndAudience(perf);

    data.volumeCredits = updateVolumeCredits(perf, data.volumeCredits);
    data.performances.push(perf);
    data.totalAmount += perf.thisAmount;
  }

  return renderResult(data);
}

module.exports = {
  statement,
};
