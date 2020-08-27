function getAmountByTypeAndAudience(performance, play) {
  let thisAmount = 0;
  switch (play.type) {
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
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function updateVolumeCredits(performance, play) {
  let volumeCredits = 0;

  volumeCredits += Math.max(performance.audience - 30, 0);
  if ("comedy" === play.type)
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
    result += ` ${e.playName}: ${format(e.thisAmount / 100)} (${
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
    performances: [...(invoice.performances)],
  };

  data.performances = data.performances.map((perf) => {
    return {
      ...perf,
      playName: plays[perf.playID].name,
      thisAmount: getAmountByTypeAndAudience(perf, plays[perf.playID]),
      thisVolumeCredits: updateVolumeCredits(perf, plays[perf.playID])
    }
  })

  data.totalAmount = data.performances.reduce((total, perf) => total + perf.thisAmount, 0);
  data.volumeCredits = data.performances.reduce((total, perf) => total + perf.thisVolumeCredits, 0);
  
  return renderResult(data);
}

module.exports = {
  statement,
};
