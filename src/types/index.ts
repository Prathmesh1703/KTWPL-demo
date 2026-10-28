export type UserRole = 'investor' | 'admin' | 'compliance';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  role: UserRole;
  avatarUrl?: string;
  clientCode?: string;
  kycTier: 'CKYC_VERIFIED' | 'PENDING_DOCUMENTATION' | 'SEBI_ENHANCED';
  bankAccount: {
    bankName: string;
    accountNo: string;
    ifsc: string;
    pennyDropVerified: boolean;
  };
}

export type Periodicity = 'MONTHLY' | 'QUARTERLY' | 'MATURITY_COMPOUND';

export interface Agreement {
  id: string;
  agreementNo: string;
  clientName: string;
  clientPan: string;
  principalAmount: number;
  interestRateAnnual: number;
  periodicity: Periodicity;
  tenorMonths: number;
  startDate: string;
  maturityDate: string;
  nextPayoutDate: string;
  accruedInterest: number;
  totalInterestPaid: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'MATURED' | 'EARLY_LIQUIDATED';
  cryptoHash: string;
  digitalSignature: {
    signedBy: string;
    signedAt: string;
    certSerial: string;
    status: 'VERIFIED' | 'PENDING';
  };
  clauses: {
    lockInPeriodMonths: number;
    earlyWithdrawalPenaltyPercent: number;
    tdsRatePercent: number;
    specialNotes?: string;
  };
}

export interface LedgerEntry {
  id: string;
  txHash: string;
  agreementNo: string;
  date: string;
  description: string;
  type: 'INTEREST_CREDIT' | 'TDS_DEDUCTION' | 'CAPITAL_INFLOW' | 'WITHDRAWAL_PAYOUT' | 'PENALTY_LEVY';
  debit: number;
  credit: number;
  balance: number;
  referenceDocId: string;
  status: 'SETTLED' | 'PENDING_CLEARING';
}

export interface WithdrawalRequest {
  id: string;
  requestNo: string;
  agreementNo: string;
  clientName: string;
  clientPan: string;
  amount: number;
  requestType: 'PARTIAL' | 'FULL_REDEMPTION';
  reason: string;
  payoutBank: string;
  accountEnding: string;
  tdsApplicable: number;
  netPayout: number;
  requestedAt: string;
  status: 'PENDING_MAKER' | 'PENDING_CHECKER' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  makerComment?: string;
  checkerComment?: string;
}

export interface InflowProposal {
  id: string;
  inflowNo: string;
  clientName: string;
  clientPan: string;
  clientPhone: string;
  principalAmount: number;
  tenorMonths: number;
  interestRateAnnual: number;
  periodicity: Periodicity;
  utrNumber: string;
  bankSource: string;
  submittedAt: string;
  status: 'PENDING_MAKER' | 'PENDING_CHECKER' | 'APPROVED' | 'REJECTED';
  makerReviewer?: string;
  checkerReviewer?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  entityType: 'AGREEMENT' | 'WITHDRAWAL' | 'INFLOW' | 'KYC' | 'SEBI_REPORT';
  entityId: string;
  details: string;
  ipAddress: string;
  sha256Seal: string;
}

export interface KYCRecord {
  id: string;
  clientName: string;
  clientPan: string;
  ckycNumber: string;
  panAadhaarLinked: boolean;
  pennyDropStatus: 'SUCCESS' | 'MISMATCH' | 'PENDING';
  riskCategory: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK_PEP';
  lastVerifiedAt: string;
  complianceFlag: 'CLEAR' | 'UNDER_REVIEW' | 'FLAGGED';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: {
    label: string;
    source: string;
    clause?: string;
  }[];
  quickActions?: {
    label: string;
    actionType: 'SIMULATE' | 'OPEN_AGREEMENT' | 'OPEN_WITHDRAWAL' | 'VIEW_LEDGER' | 'NAVIGATE' | 'PROMPT';
    payload?: any;
  }[];
}

