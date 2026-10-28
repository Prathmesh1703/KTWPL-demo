import { Periodicity } from '../types';

export interface SimulationResult {
  principal: number;
  rateAnnual: number;
  tenorMonths: number;
  periodicity: Periodicity;
  grossInterestTotal: number;
  tdsTotal: number;
  netInterestTotal: number;
  maturityPayout: number;
  monthlyPayoutAverage: number;
  schedule: Array<{
    month: number;
    monthLabel: string;
    openingBalance: number;
    interestEarned: number;
    payoutDisbursed: number;
    cumulativeWealth: number;
    cumulativeInterest: number;
  }>;
}

export function calculateWealthSimulation(
  principal: number,
  tenorMonths: number,
  periodicity: Periodicity,
  customRate?: number
): SimulationResult {
  // Institutional tiered rate if customRate not provided
  let rate = customRate ?? 13.5;
  if (!customRate) {
    if (principal >= 10000000) { // >= 1 Crore
      rate = 15.25;
    } else if (principal >= 2500000) { // >= 25 Lakhs
      rate = 14.5;
    } else if (principal >= 1000000) { // >= 10 Lakhs
      rate = 13.75;
    } else {
      rate = 12.5;
    }

    // Tenor bonus
    if (tenorMonths >= 24) {
      rate += 0.75;
    } else if (tenorMonths >= 12) {
      rate += 0.5;
    }
  }

  const monthlyRate = rate / 12 / 100;
  const schedule: SimulationResult['schedule'] = [];

  let currentBalance = principal;
  let cumulativeInterest = 0;
  let grossInterestTotal = 0;
  let totalDisbursed = 0;

  const now = new Date();

  for (let m = 1; m <= tenorMonths; m++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const monthLabel = futureDate.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

    let interestEarned = 0;
    let payoutDisbursed = 0;

    if (periodicity === 'MONTHLY') {
      // Simple monthly interest paid out
      interestEarned = principal * monthlyRate;
      payoutDisbursed = interestEarned;
      grossInterestTotal += interestEarned;
      cumulativeInterest += interestEarned;
      currentBalance = principal; // balance remains principal as interest is paid out
    } else if (periodicity === 'QUARTERLY') {
      // Compounded quarterly or paid quarterly
      interestEarned = currentBalance * monthlyRate;
      grossInterestTotal += interestEarned;
      cumulativeInterest += interestEarned;

      if (m % 3 === 0 || m === tenorMonths) {
        // Disbursed quarterly
        payoutDisbursed = currentBalance * (rate / 4 / 100);
        currentBalance = principal;
      } else {
        currentBalance += interestEarned;
      }
    } else {
      // MATURITY_COMPOUND (Compounded monthly/quarterly and paid at maturity)
      interestEarned = currentBalance * monthlyRate;
      grossInterestTotal += interestEarned;
      cumulativeInterest += interestEarned;
      currentBalance += interestEarned;
      payoutDisbursed = 0;
    }

    schedule.push({
      month: m,
      monthLabel: `M${m} (${monthLabel})`,
      openingBalance: Math.round(m === 1 ? principal : schedule[m - 2].cumulativeWealth),
      interestEarned: Math.round(interestEarned),
      payoutDisbursed: Math.round(payoutDisbursed),
      cumulativeWealth: Math.round(periodicity === 'MATURITY_COMPOUND' ? currentBalance : principal + cumulativeInterest),
      cumulativeInterest: Math.round(cumulativeInterest),
    });
  }

  const tdsTotal = Math.round(grossInterestTotal * 0.10); // 10% TDS under Sec 194A
  const netInterestTotal = Math.round(grossInterestTotal - tdsTotal);
  const maturityPayout = periodicity === 'MATURITY_COMPOUND' 
    ? Math.round(principal + netInterestTotal)
    : principal;

  const monthlyPayoutAverage = periodicity === 'MONTHLY' 
    ? Math.round(grossInterestTotal / tenorMonths)
    : 0;

  return {
    principal,
    rateAnnual: rate,
    tenorMonths,
    periodicity,
    grossInterestTotal: Math.round(grossInterestTotal),
    tdsTotal,
    netInterestTotal,
    maturityPayout,
    monthlyPayoutAverage,
    schedule,
  };
}

