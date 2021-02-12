const SECONDS = 2;

const getIsaContribution = () => {
  const isaContributionHtml = document.querySelector(".funds-status .invested");

  if (isaContributionHtml) {
    saveIsaContribution(isaContributionHtml.innerText);

    return isaContributionHtml.innerText;
  } else {
    const isaContribution = localStorage.getItem("isaContribution");

    if (isaContribution) return isaContribution;
  }
}

const saveIsaContribution = (v) => {
  localStorage.setItem("isaContribution", v)
}

const updateDOM = (html, v) => {
  html.innerText = v;
}

const formatNumberWithCommas = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const round = (n) => parseFloat(n).toFixed(2);

const calcReturn = (currency, isa, current) => {
  const isaFormatted = isa.split(currency)[1].split(",").join("");
  const currentFormatted = current.split(",").join("");
  const gain = round(currentFormatted - isaFormatted);
  const percent = round((currentFormatted / isaFormatted) * 100);

  return (gain >= 0)
    ? {
      gain,
      percent,
      direction: "positive"
    } : {
      gain: gain.split("-")[1],
      percent,
      direction: "negative"
    };
}

const writeReturn = (currency, indicator, gain, percent) => {
  return `${indicator}${currency}${formatNumberWithCommas(gain)} (${percent}%)`;
}

const createCell = ({ classes, id, text }) => {
  const cell = document.createElement("div");
  cell.className = classes;
  cell.id = id;
  if (text) cell.innerText = text;

  return cell;
}

const createDOM = () => {
  const extensionRow = createCell({ classes: "portfolio-summary-row", id: "created-by-extension" });
  const investedCol = createCell({ classes: "portfolio-summary-column", id: "extension-invested-col" });
  const returnCol = createCell({ classes: "portfolio-summary-column", id: "extension-return-col" });
  const investedLabel = createCell({ classes: "label", id: "extension-invested-label", text: "ISA Invested" });
  const investedValue = createCell({ classes: "value", id: "extension-invested-value", text: "" });
  const returnLabel = createCell({ classes: "label", id: "extension-return-label", text: "True Return" });
  const returnValue = createCell({ classes: "value", id: "extension-return-value", text: "" });

  investedCol.appendChild(investedLabel);
  investedCol.appendChild(investedValue);

  returnCol.appendChild(returnLabel);
  returnCol.appendChild(returnValue);

  extensionRow.appendChild(investedCol);
  extensionRow.appendChild(returnCol);

  const target = document.querySelector(".portfolio-chart");

  target.parentNode.insertBefore(extensionRow, target);
}

const positiveReturn = () => document.getElementById("extension-return-value").className = "value positive";
const negativeReturn = () => document.getElementById("extension-return-value").className = "value negative";

const run = () => {
  const investedHtml = document.querySelector("[data-qa-portfolio-invested] .value");
  const returnHtml = document.querySelector("[data-qa-portfolio-return] .value");
  const isaContribution = getIsaContribution();

  const currency = document.querySelector(".formatted-price-part:nth-child(1)").innerText;
  const totalReturn = document.querySelector(".formatted-price-part:nth-child(2)").innerText;
  const totalReturnDecimal = document.querySelector(".formatted-price-part:nth-child(3)").innerText;

  if (investedHtml && isaContribution && returnHtml) {
    document.getElementById("created-by-extension") || createDOM();


    const { gain, percent, direction } = calcReturn(currency, isaContribution, totalReturn + totalReturnDecimal);

    let indicator;

    if (direction === "positive") {
      positiveReturn();
      indicator = "+";
    } else {
      negativeReturn();
      indicator = "-";
    }

    updateDOM(document.getElementById("extension-invested-value"), isaContribution);
    updateDOM(document.getElementById("extension-return-value"), writeReturn(currency, indicator, gain, percent));
  }
}

setInterval(run, SECONDS * 1000);
