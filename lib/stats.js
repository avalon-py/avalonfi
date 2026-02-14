export function groupByDay(transactions) {
  const map = new Map();

  for (const t of transactions) {
    const date = t.createdAt.toDate().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!map.has(date)) {
      map.set(date, []);
    }

    map.get(date).push(t);
  }

  return map;
}

export function analyzeTransactions(txs) {
  let income = 0;
  let expense = 0;

  for (const t of txs) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }

  return {
    income,
    expense,
    net: income - expense,
  };
}

export function analyzeByDays(transactions) {
  const days = groupByDay(transactions);

  let totalIncome = 0;
  let totalExpense = 0;

  let cheapestDay = null;
  let mostExpensiveDay = null;

  for (const [date, txs] of days.entries()) {
    const { income, expense, net } = analyzeTransactions(txs);

    totalIncome += income;
    totalExpense += expense;

    if (!cheapestDay || expense < cheapestDay.expense) {
      cheapestDay = { date, expense };
    }

    if (!mostExpensiveDay || expense > mostExpensiveDay.expense) {
      mostExpensiveDay = { date, expense };
    }
  }

  const dayCount = days.size;

  return {
    dayCount,
    totalIncome,
    totalExpense,
    netTotal: totalIncome - totalExpense,
    dailyAverage: dayCount > 0 ? totalExpense / dayCount : 0,
    cheapestDay,
    mostExpensiveDay,
  };
}

export function analyzeDayTransactions(txs) {
  let totalIncome = 0;
  let totalExpense = 0;
  let biggestExpense = null;

  for (const t of txs) {
    if (t.type === "income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;

      if (!biggestExpense || t.amount > biggestExpense.amount) {
        biggestExpense = t;
      }
    }
  }

  return {
    totalIncome,
    totalExpense,
    netTotal: totalIncome - totalExpense,
    txCount: txs.length,
    biggestExpense,
  };
}

export function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));
}

export function startOfTomorrowUTC() {
  const d = startOfTodayUTC();
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

export function startOfMonthUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function startOfNextMonthUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}
