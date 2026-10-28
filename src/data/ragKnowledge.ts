export interface RagDocument {
  id: string;
  category: 'AGREEMENT_TERMS' | 'TAX_POLICY' | 'LIQUIDITY_REPORT' | 'SEBI_REGULATIONS' | 'LEDGER_AUDIT';
  title: string;
  clause?: string;
  source: string;
  content: string;
  keywords: string[];
}

export const ragKnowledgeBase: RagDocument[] = [
  {
    id: 'rag-01',
    category: 'AGREEMENT_TERMS',
    title: 'Agreement #AG-8912 - Payout Cycle & Schedule',
    clause: 'Clause 4.2 (Interest Payout Mandate)',
    source: 'Digitized Agreement #AG-8912 / eMudhra DSC-9941092837',
    content: 'Agreement #AG-8912 has an active principal of ₹50,00,000 at 11% annual interest rate. Payout frequency is Monthly. Next scheduled payout is on 15 November 2026 with estimated monthly interest of ₹45,833.33 before applicable deductions.',
    keywords: ['payout', 'next interest', 'ag-8912', 'when is my next', 'interest payout', 'november'],
  },
  {
    id: 'rag-02',
    category: 'LEDGER_AUDIT',
    title: 'Cumulative Interest Accrual Register',
    clause: 'Ledger Summary #GL-4421',
    source: 'KTWPL Escrow Double-Entry Ledger & Bank Clearing Feeds',
    content: 'Total interest accrued across active investments stands at ₹2,48,500 as of 28 October 2026. Interest already credited: ₹1,90,000. Interest accrued but not yet credited: ₹58,500. TDS deducted to date: ₹19,000.',
    keywords: ['earned so far', 'interest earned', 'how much interest', 'accrued', 'earned', 'tds deducted'],
  },
  {
    id: 'rag-03',
    category: 'AGREEMENT_TERMS',
    title: 'Standard 12-Month Capital Growth Engine',
    clause: 'Product Specification Note #KTW-12M',
    source: 'KTWPL Yield & Fixed Maturity Disclosure',
    content: 'For an illustrative deployment of ₹10,00,000 over 12 months at 10% per annum simple interest: estimated simple interest is ₹1,00,000 and estimated maturity value is ₹11,00,000 before applicable deductions.',
    keywords: ['invest 10 lakh', '10 lakh for 12 months', 'what will i receive', '10 lakh', 'returns'],
  },
  {
    id: 'rag-04',
    category: 'AGREEMENT_TERMS',
    title: 'Seasoning & Lock-in Restrictions',
    clause: 'Clause 7.1 (Lock-in & Premature Redemption)',
    source: 'KTWPL Master Capital Agreement Terms 2024',
    content: 'Agreement AG-8912 includes a six-month lock-in period. Early withdrawal of 50% or any portion of principal before the lock-in ends may be restricted or subject to specific conditions.',
    keywords: ['withdraw 50%', 'lock-in', 'before lock-in', '50% of my principal', 'lock-in ends', 'early withdrawal'],
  },
  {
    id: 'rag-05',
    category: 'AGREEMENT_TERMS',
    title: 'Agreement Status & Electronic Execution',
    clause: 'Digital Vault Record #AG-8912',
    source: 'eMudhra DSC-9941092837 / SHA-256 Validated',
    content: 'Agreement AG-8912 is currently marked Active in the system. Principal: ₹50,00,000. Digital signature: Completed. Activation date: 15 May 2026. Maturity date: 15 May 2027.',
    keywords: ['agreement approved', 'is my agreement approved', 'is my investment agreement approved', 'active agreement', 'ag-8912 status'],
  },
  {
    id: 'rag-06',
    category: 'LEDGER_AUDIT',
    title: 'Discrepancy & TDS Withholding Audit',
    clause: 'Reconciliation Memo #REC-4583',
    source: 'Sourced from General Ledger #GL-109 & TRACES Filing',
    content: 'The interest difference of ₹4,583 is under review across ledger entries to verify whether it relates to TDS withholding (Section 194A), a partial-period calculation, a rate adjustment or another recorded transaction.',
    keywords: ['lower than expected', 'credited interest lower', 'why is my interest lower', 'difference', '4583'],
  },
  {
    id: 'rag-07',
    category: 'LIQUIDITY_REPORT',
    title: 'High-Value Redemption Pipeline (> ₹10L)',
    clause: 'Maker-Checker Queue Filter: > ₹10,00,000',
    source: 'KTWPL Back-Office Maker-Checker Engine',
    content: 'There are 3 pending withdrawal requests above ₹10 lakh in the illustrative dataset totalling ₹52,00,000: WR-7781 (₹25,00,000 - Checker approval), WR-7788 (₹17,00,000 - Operations review), WR-7792 (₹10,00,000 - Checker approval).',
    keywords: ['pending withdrawal', 'above 10 lakh', 'above 10l', 'over 10 lakh', 'pending requests above', '10 lakh'],
  },
  {
    id: 'rag-08',
    category: 'LIQUIDITY_REPORT',
    title: 'Weekly Liquidity Outflow Forecast',
    clause: 'Treasury Risk & Liquidity Projection W1',
    source: 'KTWPL Treasury Risk Model (29 Oct - 04 Nov 2026)',
    content: 'Projected outflows for 29 October–4 November 2026 are ₹1.85 crore: Interest payouts ₹65 lakh, Maturities ₹80 lakh, Withdrawals ₹40 lakh.',
    keywords: ['liquidity outflows', 'outflows for next week', 'next week', 'summarize liquidity', 'outflows next week'],
  },
  {
    id: 'rag-09',
    category: 'LIQUIDITY_REPORT',
    title: 'Intraday Capital Inflows Reconciled',
    clause: 'Daily Capital Intake Feed #IN-2026-10-28',
    source: 'HDFC Escrow Clearing & Banking Feeds',
    content: "Today's illustrative fund inflows total ₹3.25 crore across 8 transactions: Approved and reconciled ₹2.10 crore, Awaiting checker approval ₹85 lakh, Receipt reconciliation pending ₹30 lakh.",
    keywords: ['new capital came in today', 'capital came in today', 'new capital today', 'inflows today', 'today capital'],
  },
  {
    id: 'rag-10',
    category: 'SEBI_REGULATIONS',
    title: 'SEBI CKYC & PMLA Compliance Register',
    clause: 'PMLA Audit Register 2026-Q3',
    source: 'SEBI KYC Registry & Karvy KRA Verification Gateway',
    content: 'The illustrative compliance register contains 86 investors with pending verification and 35 with failed or flagged checks. Recommended steps include reviewing pending CKYC/PAN/bank cases, identifying failed checks, assigning follow-ups, and restricting actions per policy.',
    keywords: ['incomplete kyc', 'investors have incomplete kyc', 'which investors have incomplete', 'pending verification', 'failed checks'],
  },
  {
    id: 'rag-11',
    category: 'LIQUIDITY_REPORT',
    title: 'Workflow Audit: Ticket #WR-7781',
    clause: 'Queue Record #WR-7781',
    source: 'Maker-Checker Execution Log #MC-9021',
    content: 'Request WR-7781 is awaiting checker approval in the illustrative workflow. Requested amount: ₹25,00,000. Submission date: 27 October 2026. Current status: Pending checker approval. Next action: An authorized checker must review eligibility, available balance and supporting records.',
    keywords: ['why is a withdrawal request pending', 'withdrawal request pending', 'wr-7781', 'why is withdrawal pending'],
  },
  {
    id: 'rag-12',
    category: 'AGREEMENT_TERMS',
    title: '30-Day Contractual Maturity Horizon',
    clause: 'Escrow Depository Maturity Schedule',
    source: 'KTWPL Treasury & Client Mandate Registry',
    content: 'The illustrative maturity register identifies 12 agreements maturing within the next 30 days, with aggregate principal of ₹4.60 crore. Review maturity dates, final interest accruals, bank verification, renewals, and liquidity before disbursement.',
    keywords: ['agreements mature in the next 30 days', 'mature in the next 30 days', 'agreements mature', '30 days', 'upcoming maturities'],
  },
];

export function queryRag(queryText: string, userRole: string, activeSimulatorAmount?: number): {
  answer: string;
  citations: Array<{ label: string; source: string; clause?: string }>;
  quickActions: Array<{ label: string; actionType: any; payload?: any }>;
} {
  const q = queryText.toLowerCase().replace(/[?.,!#]/g, ' ').replace(/\s+/g, ' ').trim();

  // ==========================================
  // INVESTOR PORTAL QUESTIONS (from sampleQuestions.md)
  // ==========================================

  // Q1: When is my next interest payout for Agreement #AG-8912?
  if (
    q.includes('next interest') || 
    q.includes('ag 8912') || 
    (q.includes('next') && q.includes('payout')) ||
    (q.includes('when') && q.includes('interest'))
  ) {
    return {
      answer: `Your next interest payout for Agreement AG-8912 is scheduled for **15 November 2026**.\n\n• **Principal amount:** ₹50,00,000\n• **Interest rate:** 11% per annum\n• **Estimated monthly interest:** ₹45,833.33 before applicable deductions\n• **Expected payout:** Subject to the agreement terms and payment processing.`,
      citations: [
        {
          label: 'Agreement #AG-8912',
          clause: 'Clause 4.2 (Interest Payout Mandate)',
          source: 'Digitized Agreement #AG-8912 / eMudhra DSC-9941092837',
        },
        {
          label: 'General Ledger Audit',
          clause: 'Batch Voucher #PV-88910',
          source: 'Sourced from General Ledger #GL-109',
        },
      ],
      quickActions: [
        { label: 'View Agreement #AG-8912', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
        { label: 'View Ledger History', actionType: 'VIEW_LEDGER' },
      ],
    };
  }

  // Q2: How much interest have I earned so far?
  if (
    q.includes('earned so far') || 
    q.includes('how much interest') || 
    (q.includes('interest') && q.includes('earned')) ||
    q.includes('interest accrued')
  ) {
    return {
      answer: `Your total interest accrued across your active investments is **₹2,48,500** as of 28 October 2026.\n\n• **Interest already credited:** ₹1,90,000\n• **Interest accrued but not yet credited:** ₹58,500\n• **TDS deducted to date:** ₹19,000`,
      citations: [
        {
          label: 'General Ledger Records',
          clause: 'Cumulative Accrual Ledger',
          source: 'KTWPL Escrow Double-Entry Ledger #GL-4421',
        },
        {
          label: 'Tax Withholding Registry',
          clause: 'Form 26AS / AIS Reconciled',
          source: 'TRACES Tax Withholding Central Registry',
        },
      ],
      quickActions: [
        { label: 'View General Ledger', actionType: 'VIEW_LEDGER' },
        { label: 'Calculate Future Returns', actionType: 'SIMULATE' },
      ],
    };
  }

  // Q3: What will I receive if I invest ₹10 lakh for 12 months?
  if (
    (q.includes('10 lakh') && (q.includes('12 month') || q.includes('invest') || q.includes('receive'))) ||
    q.includes('invest 10 lakh') ||
    q.includes('what will i receive')
  ) {
    return {
      answer: `I can estimate your returns. Using an illustrative rate of 10% per annum:\n\n• **Initial investment:** ₹10,00,000\n• **Investment period:** 12 months\n• **Estimated simple interest:** ₹1,00,000\n• **Estimated maturity value:** ₹11,00,000 before applicable deductions.\n\n*This estimate assumes simple interest, a full 12-month period and no interim payouts or fees. Your actual return depends on the available product and its contractual terms.*`,
      citations: [
        {
          label: 'KTWPL Yield Engine',
          clause: 'Standard Fixed Maturity Schedule',
          source: 'KTWPL Product Disclosure Matrix 2026',
        },
      ],
      quickActions: [
        { label: 'Open Wealth and Payout', actionType: 'SIMULATE', payload: { principal: 1000000, tenor: 12 } },
        { label: 'View Investments', actionType: 'OPEN_AGREEMENT' },
      ],
    };
  }

  // Q4: Can I withdraw 50% of my principal before the lock-in ends?
  if (
    (q.includes('withdraw') && (q.includes('50%') || q.includes('50 percent') || q.includes('lock in') || q.includes('lock-in'))) ||
    q.includes('before the lock in') ||
    q.includes('before the lock-in')
  ) {
    return {
      answer: `Your agreement must be checked before confirming eligibility. If Agreement AG-8912 includes a six-month lock-in, an early withdrawal may be restricted or subject to specific conditions.`,
      citations: [
        {
          label: 'Master Mandate Terms',
          clause: 'Clause 7.1 (Lock-in & Premature Redemption)',
          source: 'KTWPL Master Capital Agreement Terms 2024',
        },
      ],
      quickActions: [
        { label: 'Review Agreement Terms', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
        { label: 'Initiate Withdrawal Request', actionType: 'OPEN_WITHDRAWAL' },
      ],
    };
  }

  // Q5: Is my investment agreement approved?
  if (
    (q.includes('agreement') && (q.includes('approved') || q.includes('status') || q.includes('active'))) ||
    q.includes('is my investment agreement approved')
  ) {
    return {
      answer: `Your agreement is currently marked **Active** in the system.\n\n• **Agreement ID:** AG-8912\n• **Principal:** ₹50,00,000\n• **Digital signature:** Completed\n• **Activation date:** 15 May 2026\n• **Maturity date:** 15 May 2027`,
      citations: [
        {
          label: 'Digital Vault Status',
          clause: 'Executed Mandate Record',
          source: 'eMudhra DSC-9941092837 / SHA-256 Validated',
        },
      ],
      quickActions: [
        { label: 'View Agreement #AG-8912', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
        { label: 'Download Digital Contract', actionType: 'OPEN_AGREEMENT' },
      ],
    };
  }

  // Q6: Why is my credited interest lower than expected?
  if (
    (q.includes('interest') && (q.includes('lower') || q.includes('less') || q.includes('difference') || q.includes('expected'))) ||
    q.includes('credited interest lower') ||
    q.includes('why is my credited interest')
  ) {
    return {
      answer: `The difference is **₹4,583**. I can review the relevant ledger entries to identify whether the difference relates to TDS, a partial-period calculation, a rate adjustment or another recorded transaction.\n\nI will compare the scheduled gross interest with the actual credit and associated deductions before identifying the reason.`,
      citations: [
        {
          label: 'Ledger Audit & Reconciliation',
          clause: 'TDS u/s 194A Withholding Check',
          source: 'General Ledger #GL-109 / HDFC Escrow Clearing',
        },
      ],
      quickActions: [
        { label: 'View General Ledger', actionType: 'VIEW_LEDGER' },
        { label: 'Review Active Agreement', actionType: 'OPEN_AGREEMENT' },
      ],
    };
  }

  // ==========================================
  // ADMIN PORTAL QUESTIONS (from sampleQuestions.md)
  // ==========================================

  // Admin Q1: Show all pending withdrawal requests above ₹10 lakh.
  if (
    (q.includes('pending withdrawal') && (q.includes('above') || q.includes('10 lakh') || q.includes('10l'))) ||
    (q.includes('withdrawal') && q.includes('above 10')) ||
    q.includes('show all pending withdrawal requests')
  ) {
    return {
      answer: `There are 3 pending withdrawal requests above ₹10 lakh in the illustrative dataset, totalling **₹52,00,000**.\n\n• **WR-7781:** ₹25,00,000 — *Pending with Checker approval*\n• **WR-7788:** ₹17,00,000 — *Pending with Operations review*\n• **WR-7792:** ₹10,00,000 — *Pending with Checker approval*`,
      citations: [
        {
          label: 'Maker-Checker Pipeline',
          clause: 'Queue Filter: Amount > ₹10,00,000',
          source: 'KTWPL Back-Office Maker-Checker Engine',
        },
      ],
      quickActions: [
        { label: 'Open Maker-Checker Queue', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // Admin Q2: Summarize liquidity outflows for next week.
  if (
    (q.includes('liquidity') && q.includes('outflows')) ||
    (q.includes('outflows') && q.includes('next week')) ||
    q.includes('summarize liquidity outflows')
  ) {
    return {
      answer: `Based on the illustrative forecast, expected outflows for **29 October–4 November 2026** are **₹1.85 crore**.\n\n• **Projected total outflow:** ₹1.85 Cr\n• **Interest payouts:** ₹65 lakh\n• **Maturities:** ₹80 lakh\n• **Withdrawals:** ₹40 lakh`,
      citations: [
        {
          label: 'Treasury Risk Model',
          clause: 'Section 3.1 Rolling 7-Day Outflow',
          source: 'KTWPL Treasury Risk & Liquidity Matrix 2026-Q4',
        },
      ],
      quickActions: [
        { label: 'View 90-Day Liquidity Forecast', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // Admin Q3: How much new capital came in today?
  if (
    (q.includes('capital') && (q.includes('today') || q.includes('came in'))) ||
    q.includes('inflows today') ||
    q.includes('how much new capital')
  ) {
    return {
      answer: `Today's illustrative fund inflows total **₹3.25 crore** across 8 transactions.\n\n• **Approved and reconciled:** ₹2.10 crore\n• **Awaiting checker approval:** ₹85 lakh\n• **Receipt reconciliation pending:** ₹30 lakh`,
      citations: [
        {
          label: 'Inflow Intake Register',
          clause: 'Daily Reconciled Batch #IN-2026-10-28',
          source: 'HDFC Capital Inward Clearing / RTGS Feeds',
        },
      ],
      quickActions: [
        { label: 'Open Inflow Intake Wizard', actionType: 'NAVIGATE', payload: 'admin' },
        { label: 'View Maker Queue', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // Admin Q4: Which investors have incomplete KYC?
  if (
    (q.includes('investor') || q.includes('which')) && (q.includes('incomplete kyc') || q.includes('kyc') || q.includes('pending verification')) ||
    q.includes('incomplete kyc')
  ) {
    return {
      answer: `The illustrative compliance register contains **86 investors with pending verification** and **35 with failed or flagged checks**.\n\n**Recommended next steps:**\n1. Review pending CKYC, PAN and bank verification cases.\n2. Identify failed checks requiring document correction or manual review.\n3. Assign follow-up tasks to authorized staff.\n4. Restrict actions where required by approved compliance policy.`,
      citations: [
        {
          label: 'SEBI Compliance Registry',
          clause: 'PMLA & CKYC Master Audit Table',
          source: 'SEBI KYC Registry & Karvy KRA API Gateway',
        },
      ],
      quickActions: [
        { label: 'Open KYC Matrix', actionType: 'NAVIGATE', payload: 'compliance' },
      ],
    };
  }

  // Admin Q5: Why is a withdrawal request pending?
  if (
    (q.includes('why') && q.includes('withdrawal') && q.includes('pending')) ||
    q.includes('wr 7781') ||
    q.includes('why is a withdrawal request pending')
  ) {
    return {
      answer: `Request **WR-7781** is awaiting checker approval in the illustrative workflow.\n\n• **Requested amount:** ₹25,00,000\n• **Submission date:** 27 October 2026\n• **Current status:** Pending checker approval\n• **Next action:** An authorized checker must review eligibility, available balance and supporting records.`,
      citations: [
        {
          label: 'Workflow Audit Trail',
          clause: 'Ticket #WR-7781 Seasoning Check',
          source: 'Maker-Checker Execution Log #MC-9021',
        },
      ],
      quickActions: [
        { label: 'Review Request WR-7781', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // Admin Q6: Which agreements mature in the next 30 days?
  if (
    (q.includes('agreements') || q.includes('mature')) && (q.includes('30 days') || q.includes('next 30')) ||
    q.includes('which agreements mature in the next 30 days') ||
    q.includes('upcoming maturities')
  ) {
    return {
      answer: `The illustrative maturity register identifies **12 agreements** maturing within the requested period, with aggregate principal of **₹4.60 crore**.\n\n**Before processing, review:**\n• Contractual maturity dates and principal amounts.\n• Final interest accruals and applicable deductions.\n• Investor bank-account verification.\n• Renewal instructions, if any.\n• Available liquidity and maker-checker approvals.`,
      citations: [
        {
          label: 'Maturity Ledger',
          clause: 'Schedule 30D Liquidity Allocation',
          source: 'KTWPL Escrow Depository Register',
        },
      ],
      quickActions: [
        { label: 'View Liquidity Forecast', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // General Tax / TDS query
  if (q.includes('tax') || q.includes('tds') || q.includes('194a')) {
    return {
      answer: `Interest payouts are subject to statutory withholding under **Section 194A** at **10.0%** for Resident Individuals with verified PAN.\n\n• Form 16A certificates are published quarterly in the Digital Agreement Vault.\n• Valid Form 15G / 15H can be submitted at the start of the financial year for nil withholding.`,
      citations: [
        {
          label: 'Tax Policy Document',
          clause: 'Section 194A IT Act',
          source: 'KTWPL Statutory Tax Advisory 2026',
        },
      ],
      quickActions: [
        { label: 'View Investments', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
        { label: 'View General Ledger', actionType: 'VIEW_LEDGER' },
      ],
    };
  }

  // Fallback response with contextual hints
  const simNote = activeSimulatorAmount 
    ? `\n\n*(Note: Your current investment calculation parameter is set to ₹${(activeSimulatorAmount/100000).toFixed(1)} Lakhs. You can ask me to calculate returns or compare tenors on this amount.)*`
    : '';

  return {
    answer: `I have analyzed your query across KTWPL's digitized master agreements, General Ledger records, and SEBI compliance databases.\n\nYou can ask any of our standard demo queries such as payout schedules for **Agreement #AG-8912**, cumulative accrued interest, 12-month return estimates, pending withdrawals above ₹10L, or liquidity forecasts.${simNote}`,
    citations: [
      {
        label: 'KTWPL Knowledge Base',
        source: 'Master Mandate Repository & Regulatory Directives',
      },
    ],
    quickActions: [
      { label: 'When is my next interest payout for Agreement #AG-8912?', actionType: 'PROMPT' },
      { label: 'How much interest have I earned so far?', actionType: 'PROMPT' },
      { label: 'Show all pending withdrawal requests above ₹10 lakh.', actionType: 'PROMPT' },
    ],
  };
}
