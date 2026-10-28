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
    content: 'Agreement #AG-8912 has an active principal of ₹75,00,000 at 14.50% annual yield. Payout frequency is Monthly, payable on the 1st business day of each calendar month. The upcoming payout is scheduled for 01 November 2026 with a gross interest of ₹90,625 and net payout of ₹81,563 after 10% TDS deduction.',
    keywords: ['payout', 'next interest', 'ag-8912', 'when is my next', 'interest cycle', 'november'],
  },
  {
    id: 'rag-02',
    category: 'TAX_POLICY',
    title: 'Tax Deducted at Source (TDS) u/s 194A',
    clause: 'Clause 9.1 (Statutory Tax Withholding)',
    source: 'Income Tax Act 1961 Section 194A & KTWPL Tax Memo 2025-26',
    content: 'All interest disbursements from KTWPL Capital Management are subject to statutory TDS under Section 194A at the standard rate of 10% for Resident Individuals with verified PAN (or 20% in absence of PAN). Form 16A TDS certificates are generated and filed quarterly with TRACES and made available in the Digital Agreement Vault within 15 days of quarter end.',
    keywords: ['tax', 'tds', 'tax implication', 'quarterly payouts', 'form 16a', '194a', 'withholding'],
  },
  {
    id: 'rag-03',
    category: 'AGREEMENT_TERMS',
    title: 'Early Liquidation & Lock-in Restrictions',
    clause: 'Clause 7.1 (Lock-in & Premature Redemption)',
    source: 'KTWPL Master Capital Agreement Terms & Conditions 2024',
    content: 'Capital deployments carry a mandatory minimum lock-in period of 6 months from deployment effective date. Withdrawals prior to completion of 6 months are strictly prohibited except under exceptional medical/statutory circumstances requiring Board approval. For withdrawals after 6 months but prior to tenor maturity, an early redemption fee of 1.5% to 2.0% applies on the redeemed principal tranche.',
    keywords: ['withdraw', '50%', 'lock-in', 'before 6-month', 'early withdrawal', 'penalty', 'premature'],
  },
  {
    id: 'rag-04',
    category: 'LIQUIDITY_REPORT',
    title: 'Maker-Checker Queue: High-Value Withdrawal Demands',
    clause: 'Treasury Memo #TR-2026-10-W4',
    source: 'KTWPL Back-Office Maker-Checker Queue',
    content: 'Current pending withdrawal requests exceeding ₹10 Lakhs: Request #WR-1049 by client Arjun Singhania (PAN: AAACS8912P) under Agreement #AG-8912 for ₹15,00,000. Status: PENDING_CHECKER approval. Verified by Maker Priyanka Sen with clean 18-month seasoned principal.',
    keywords: ['pending withdrawal', 'over 10 lakhs', 'pending requests', 'withdrawal queue', 'wr-1049'],
  },
  {
    id: 'rag-05',
    category: 'LIQUIDITY_REPORT',
    title: 'Treasury Outflow & Cash Runway Forecast',
    clause: 'Weekly Liquidity Projection W1 & W2',
    source: 'Treasury Risk & Liquidity Outflow Matrix 2026-Q4',
    content: 'Total liquidity outflows projected for upcoming Week 1 (Oct 28 - Nov 03) stand at ₹19,85,000, comprising ₹4,85,000 in scheduled monthly interest disbursements across 12 mandates and ₹15,00,000 for pending withdrawal request #WR-1049. Escrow surplus stands at ₹8.42 Crores, maintaining a 424% liquidity coverage ratio.',
    keywords: ['liquidity', 'outflows', 'next week', 'cash outflows', 'treasury', 'forecast'],
  },
  {
    id: 'rag-06',
    category: 'SEBI_REGULATIONS',
    title: 'SEBI Brokerage & Capital Deployment Compliance',
    clause: 'SEBI Circular SEBI/HO/MIRSD/DOP/CIR/P/2023/141',
    source: 'SEBI Enhanced Supervision & Client Fund Segregation Mandate',
    content: 'In strict compliance with SEBI circulars, all client funds are maintained in segregated scheduled commercial bank escrow accounts with real-time end-of-day bank balance reporting to clearing corporations. Client collateral is never re-hypothecated, and quarterly CKYC / AML screening is mandatory for tier-1 active investors.',
    keywords: ['sebi', 'regulations', 'compliance', 'escrow', 'segregation', 'ckyc'],
  },
  {
    id: 'rag-07',
    category: 'LEDGER_AUDIT',
    title: 'General Ledger #GL-109 Audit Trail',
    clause: 'Ledger Audit Record #GL-109',
    source: 'Sourced from General Ledger #GL-109 & AWS ap-south-1 Ledger Seal',
    content: 'Most recent settled transaction: ₹90,625 interest credited on 2026-10-01 under reference INV-2026-10-8912 with simultaneous TDS deduction of ₹9,062 under reference TDS-2026-Q3-8912. Verified against HDFC Bank Escrow batch payment voucher #PV-88910.',
    keywords: ['gl-109', 'gl-4421', 'ledger', 'last transaction', 'interest credited', 'october payout'],
  },
];

export function queryRag(queryText: string, userRole: string, activeSimulatorAmount?: number): {
  answer: string;
  citations: Array<{ label: string; source: string; clause?: string }>;
  quickActions: Array<{ label: string; actionType: any; payload?: any }>;
} {
  const query = queryText.toLowerCase().trim();

  // 1. Next interest payout for AG-8912
  if (query.includes('next interest') || query.includes('ag-8912') || query.includes('when is my next')) {
    return {
      answer: `Your next monthly interest payout for **Agreement #AG-8912** is scheduled for **01 November 2026** (in 4 days).\n\n- **Gross Interest Due:** ₹90,625\n- **TDS Deduction (10% u/s 194A):** -₹9,062\n- **Net Payout to Bank:** **₹81,563**\n- **Designated Account:** HDFC Bank Nariman Point (\`••••8492\`)\n\nThis payment will be directly credited to your registered bank account via NEFT/RTGS with automated SMS & email advice.`,
      citations: [
        {
          label: 'Agreement Clause 4.2',
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

  // 2. Tax implication on quarterly payouts
  if (query.includes('tax') || query.includes('tds') || query.includes('194a')) {
    return {
      answer: `Interest payouts are treated as *Income from Other Sources* under the Indian Income Tax Act 1961.\n\n- **Statutory Withholding:** Under **Section 194A**, TDS is deducted at **10.0%** at the time of credit or payment.\n- **Form 16A Issuance:** KTWPL issues digitally signed Form 16A certificates quarterly within 15 days of the filing due date.\n- **26AS / AIS Synchronization:** All TDS credits reflect automatically in your Annual Information Statement (AIS) and Form 26AS linked to PAN \`AAACS8912P\`.\n- **Exemption:** Investors eligible for nil deduction can submit valid **Form 15G / 15H** at the commencement of each financial year.`,
      citations: [
        {
          label: 'Tax Withholding Policy',
          clause: 'Clause 9.1 (Statutory Tax Withholding)',
          source: 'Income Tax Act 1961 Section 194A & KTWPL Tax Advisory',
        },
      ],
      quickActions: [
        { label: 'Open Digital Vault', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
        { label: 'Simulate Post-Tax Yield', actionType: 'SIMULATE', payload: { principal: 5000000, tenor: 24 } },
      ],
    };
  }

  // 3. Early withdrawal before 6 months
  if (query.includes('withdraw') || query.includes('50%') || query.includes('lock-in') || query.includes('premature')) {
    return {
      answer: `Under KTWPL master agreement terms:\n\n- **Lock-in Mandate:** Deployments have a mandatory **6-month lock-in period** from effective deposit.\n- **Eligibility Check:** For your Agreement **#AG-8912** (started 15 Apr 2024), **18 months have elapsed**, so your funds have **cleared the lock-in** and you are eligible to request partial or full redemption.\n- **Premature Fee:** If redeeming before the 24-month maturity, an early redemption exit fee of **1.5%** applies on the liquidated principal amount.\n- **Processing Window:** Standard RTGS settlement is completed within **T+2 business days** upon Maker-Checker approval.`,
      citations: [
        {
          label: 'Master Terms & Conditions',
          clause: 'Clause 7.1 (Lock-in & Premature Redemption)',
          source: 'KTWPL Master Capital Agreement Terms 2024',
        },
      ],
      quickActions: [
        { label: 'Initiate Withdrawal Request', actionType: 'OPEN_WITHDRAWAL' },
        { label: 'Review Agreement Terms', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
      ],
    };
  }

  // 4. Admin: Pending withdrawal requests over 10 lakhs
  if (query.includes('pending withdrawal') || query.includes('over') || query.includes('10 lakh')) {
    return {
      answer: `Back-Office Review Alert: There is currently **1 pending withdrawal request exceeding ₹10,00,000** in the Maker-Checker pipeline:\n\n- **Request ID:** \`#WR-1049\`\n- **Client:** Arjun Singhania (\`AAACS8912P\`)\n- **Agreement:** #AG-8912 (Active Principal: ₹75.0 Lakhs)\n- **Requested Amount:** **₹15,00,000** (Partial Redemption)\n- **Reason:** Real estate bridge deployment\n- **Current Stage:** **Pending Checker Final Sign-off** (Maker verification cleared by Priyanka Sen)\n- **Escrow Liquidity:** Readily available in HDFC Bank Escrow account.`,
      citations: [
        {
          label: 'Back-Office Queue',
          clause: 'Queue ID #WR-1049',
          source: 'KTWPL Back-Office Maker-Checker Engine',
        },
      ],
      quickActions: [
        { label: 'Open Maker-Checker Queue', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // 5. Admin: Summarize liquidity outflows for next week
  if (query.includes('outflows') || query.includes('liquidity') || query.includes('next week') || query.includes('treasury')) {
    return {
      answer: `Here is the Treasury Liquidity Summary for **Next Week (Week 1: Oct 28 - Nov 03)**:\n\n- **Total Projected Outflows:** **₹19,85,000**\n  - Scheduled Monthly Interest: **₹4,85,000** across 12 client mandates\n  - Pending Redemption Claim: **₹15,00,000** (#WR-1049)\n- **Available Liquidity Reserves:** **₹8.42 Crores** (HDFC Escrow + Liquid Overnight Funds)\n- **Coverage Ratio:** **424%** (Well above SEBI requirement of 120% minimum liquidity buffer).\n\nNo treasury stress is detected for the rolling 90-day horizon.`,
      citations: [
        {
          label: 'Treasury Risk Model',
          clause: 'Section 3.1 Liquidity Forecast',
          source: 'KTWPL Treasury Risk & Outflow Matrix 2026-Q4',
        },
      ],
      quickActions: [
        { label: 'View 90-Day Liquidity Forecast', actionType: 'NAVIGATE', payload: 'admin' },
      ],
    };
  }

  // Fallback answer with contextual intelligence
  const simNote = activeSimulatorAmount 
    ? `\n\n*(Note: I noticed your current active simulation parameter is set to ₹${(activeSimulatorAmount/100000).toFixed(1)} Lakhs. You can ask me to calculate exact tax yields or compare compounding on this amount.)*`
    : '';

  return {
    answer: `I have analyzed your query across KTWPL's digitized master agreements, SEBI regulatory circulars, and the General Ledger database.\n\nCould you please specify if you would like details regarding **Agreement #AG-8912**, **tax withholding rules (TDS u/s 194A)**, **Maker-Checker approvals**, or **custom wealth simulation projections**?${simNote}`,
    citations: [
      {
        label: 'KTWPL Knowledge Base',
        source: 'Master Agreement Repository & Regulatory Matrix',
      },
    ],
    quickActions: [
      { label: 'Check Next Payout', actionType: 'OPEN_AGREEMENT', payload: 'AG-8912' },
      { label: 'Launch Wealth Simulator', actionType: 'SIMULATE' },
      { label: 'View General Ledger', actionType: 'VIEW_LEDGER' },
    ],
  };
}

