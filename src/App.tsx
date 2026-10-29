import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { LiveTicker } from './components/common/LiveTicker';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './components/auth/LoginPage';
import { InvestorDashboard } from './components/investor/InvestorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ComplianceDashboard } from './components/compliance/ComplianceDashboard';
import { KTWPLCopilot } from './components/copilot/KTWPLCopilot';
import { PWAStatusBanner } from './components/pwa/PWAStatusBanner';
import { Background3D } from './components/common/Background3D';
import { 
  initialAgreements, 
  initialLedgerEntries, 
  initialWithdrawalRequests, 
  initialInflowProposals, 
  initialKYCRecords, 
  initialAuditLogs,
  initialMeetings 
} from './data/mockData';
import { 
  Agreement, 
  LedgerEntry, 
  WithdrawalRequest, 
  InflowProposal, 
  AuditLog, 
  KYCRecord,
  MeetingRequest 
} from './types';
import { Sparkles, MessageSquare } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, isAuthenticated, switchRole } = useAuth();
  const { toast } = useToast();

  // Primary State Data
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(initialWithdrawalRequests);
  const [inflowProposals, setInflowProposals] = useState<InflowProposal[]>(initialInflowProposals);
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>(initialKYCRecords);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [meetings, setMeetings] = useState<MeetingRequest[]>(initialMeetings);

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [pendingCopilotPrompt, setPendingCopilotPrompt] = useState<string | null>(null);
  const [simulatorAmount, setSimulatorAmount] = useState<number>(5000000);

  // Sync activeTab when persona changes
  React.useEffect(() => {
    if (role === 'investor') setActiveTab('overview');
    if (role === 'admin') setActiveTab('maker-checker');
    if (role === 'compliance') setActiveTab('kyc-matrix');
  }, [role]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // --- Handlers for interactive Maker-Checker Actions ---
  const handleApproveInflow = (id: string, stage: 'MAKER' | 'CHECKER') => {
    setInflowProposals(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (stage === 'MAKER') {
            toast.info('Maker Review Recorded', `Inflow ${item.inflowNo} advanced to Checker review.`);
            return {
              ...item,
              status: 'PENDING_CHECKER',
              makerReviewer: 'Priyanka Sen (Maker Verified - Bank UTR Matched)',
            };
          } else {
            toast.success('Checker Authorization Granted', `Inflow ${item.inflowNo} executed. Mandate agreement created.`);
            const newAg: Agreement = {
              id: `ag-${Date.now()}`,
              agreementNo: `AG-${Math.floor(7000 + Math.random() * 2000)}`,
              clientName: item.clientName,
              clientPan: item.clientPan,
              principalAmount: item.principalAmount,
              interestRateAnnual: item.interestRateAnnual,
              periodicity: item.periodicity,
              tenorMonths: item.tenorMonths,
              startDate: new Date().toISOString().slice(0, 10),
              maturityDate: new Date(Date.now() + item.tenorMonths * 30 * 86400000).toISOString().slice(0, 10),
              nextPayoutDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
              accruedInterest: 0,
              totalInterestPaid: 0,
              status: 'ACTIVE',
              cryptoHash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
              digitalSignature: {
                signedBy: `${item.clientName} & Khosla Tradewise Authorized Signatory`,
                signedAt: new Date().toISOString(),
                certSerial: 'eMudhra-Aadhaar-DSC-AUTO',
                status: 'VERIFIED',
              },
              clauses: {
                lockInPeriodMonths: 6,
                earlyWithdrawalPenaltyPercent: 1.5,
                tdsRatePercent: 10.0,
              },
            };
            setAgreements(a => [newAg, ...a]);

            const newAudit: AuditLog = {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: 'Siddharth Khosla (Managing Partner)',
              actorRole: 'admin',
              action: 'CHECKER_MANDATE_EXECUTION',
              entityType: 'INFLOW',
              entityId: item.inflowNo,
              details: `Executed deployment of ₹${(item.principalAmount/100000).toFixed(1)}L under Agreement #${newAg.agreementNo}.`,
              ipAddress: '192.168.1.105',
              sha256Seal: newAg.cryptoHash,
            };
            setAuditLogs(logs => [newAudit, ...logs]);

            return {
              ...item,
              status: 'APPROVED',
              checkerReviewer: 'Siddharth Khosla (Managing Partner)',
            };
          }
        }
        return item;
      })
    );
  };

  const handleRejectInflow = (id: string) => {
    setInflowProposals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
    toast.error('Inflow Rejected', 'Proposal declined.');
  };

  const handleApproveWithdrawal = (id: string, stage: 'MAKER' | 'CHECKER') => {
    setWithdrawalRequests(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (stage === 'MAKER') {
            toast.info('Maker Verification Complete', `Withdrawal ${item.requestNo} verified against lock-in terms.`);
            return {
              ...item,
              status: 'PENDING_CHECKER',
              makerComment: 'Seasoning condition validated (6+ months elapsed). Cleared by Maker.',
            };
          } else {
            toast.success('Disbursement Executed', `Withdrawal ${item.requestNo} disbursed via RTGS.`);
            
            const newLedger: LedgerEntry = {
              id: `gl-${Date.now()}`,
              txHash: '0x' + Array.from({length: 12}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...',
              agreementNo: item.agreementNo,
              date: new Date().toISOString().slice(0, 10),
              description: `Principal Redemption Payout - ${item.requestNo}`,
              type: 'WITHDRAWAL_PAYOUT',
              debit: item.amount,
              credit: 0,
              balance: 23500000,
              referenceDocId: `RTGS-DISB-${item.requestNo}`,
              status: 'SETTLED',
            };
            setLedgerEntries(entries => [newLedger, ...entries]);

            const newAudit: AuditLog = {
              id: `aud-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: 'Siddharth Khosla (Managing Partner)',
              actorRole: 'admin',
              action: 'CHECKER_DISBURSEMENT_RTGS',
              entityType: 'WITHDRAWAL',
              entityId: item.requestNo,
              details: `Authorized RTGS transfer of ₹${(item.amount/100000).toFixed(1)}L to ${item.payoutBank}.`,
              ipAddress: '192.168.1.105',
              sha256Seal: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
            };
            setAuditLogs(logs => [newAudit, ...logs]);

            return {
              ...item,
              status: 'DISBURSED',
              checkerComment: 'Authorized and remitted via HDFC Bank Escrow RTGS.',
            };
          }
        }
        return item;
      })
    );
  };

  const handleRejectWithdrawal = (id: string) => {
    setWithdrawalRequests(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
    toast.error('Withdrawal Rejected', 'Redemption claim declined.');
  };

  const handleAddInflow = (newInflow: InflowProposal) => {
    setInflowProposals(prev => [newInflow, ...prev]);
  };

  const handleAddWithdrawalRequest = (newReq: Partial<WithdrawalRequest>) => {
    const fullReq: WithdrawalRequest = {
      id: `wr-${Date.now()}`,
      requestNo: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
      agreementNo: newReq.agreementNo || 'AG-8912',
      clientName: newReq.clientName || 'Arjun Singhania',
      clientPan: newReq.clientPan || 'AAACS8912P',
      amount: newReq.amount || 1000000,
      requestType: newReq.requestType || 'PARTIAL',
      reason: newReq.reason || 'Strategic capital reallocation',
      payoutBank: newReq.payoutBank || 'HDFC Bank - Nariman Point (••••8492)',
      accountEnding: '8492',
      tdsApplicable: 0,
      netPayout: newReq.amount || 1000000,
      requestedAt: new Date().toISOString(),
      status: 'PENDING_MAKER',
    };

    setWithdrawalRequests(prev => [fullReq, ...prev]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Arjun Singhania (Client)',
      actorRole: 'investor',
      action: 'CLIENT_WITHDRAWAL_INITIATED',
      entityType: 'WITHDRAWAL',
      entityId: fullReq.requestNo,
      details: `Client submitted redemption claim for ₹${(fullReq.amount/100000).toFixed(1)}L.`,
      ipAddress: '115.241.10.42 (Client Portal)',
      sha256Seal: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    };
    setAuditLogs(logs => [audit, ...logs]);
  };

  // --- Handlers for Meetings ---
  const handleRequestMeeting = (newReq: Partial<MeetingRequest>) => {
    const meetingNo = `MTG-${Math.floor(8000 + Math.random() * 2000)}`;
    const fullMeeting: MeetingRequest = {
      id: `mtg-${Date.now()}`,
      meetingNo,
      investorName: 'Arjun Singhania',
      investorPan: 'AAACS8912P',
      investorEmail: 'arjun.singhania@apexholding.in',
      title: newReq.title || 'Institutional Strategy Consultation',
      agenda: newReq.agenda || 'Portfolio review and yield alignment.',
      requestedDate: newReq.requestedDate || new Date().toISOString().slice(0, 10),
      timeSlot: newReq.timeSlot || '11:30 AM - 12:15 PM IST',
      agreementNo: newReq.agreementNo,
      status: 'PENDING_ADMIN',
      requestedAt: new Date().toISOString(),
    };

    setMeetings(prev => [fullMeeting, ...prev]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Arjun Singhania (Client)',
      actorRole: 'investor',
      action: 'MEETING_REQUEST_SUBMITTED',
      entityType: 'AGREEMENT',
      entityId: meetingNo,
      details: `Client scheduled meeting #${meetingNo} for ${fullMeeting.requestedDate} (${fullMeeting.timeSlot})${fullMeeting.agreementNo ? ` linked to Note #${fullMeeting.agreementNo}` : ''}.`,
      ipAddress: '115.241.10.42 (Client Portal)',
      sha256Seal: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    };
    setAuditLogs(logs => [audit, ...logs]);
    toast.success('Meeting Request Sent', `Your consultation #${meetingNo} has been queued for admin confirmation.`);
  };

  const handleAcceptMeeting = (id: string, meetingLink?: string, feedback?: string) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'CONFIRMED',
            meetingLink: meetingLink || `https://meet.ktwpl.com/inst-${m.meetingNo.toLowerCase()}`,
            adminFeedback: feedback || 'Meeting confirmed by Managing Partner. Video room assigned.',
            adminName: 'Siddharth Khosla (Managing Partner)',
          };
        }
        return m;
      })
    );

    const target = meetings.find(m => m.id === id);
    if (target) {
      const audit: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Siddharth Khosla (Managing Partner)',
        actorRole: 'admin',
        action: 'MEETING_CONFIRMED',
        entityType: 'AGREEMENT',
        entityId: target.meetingNo,
        details: `Confirmed meeting #${target.meetingNo} with client ${target.investorName}.`,
        ipAddress: '192.168.1.105',
        sha256Seal: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      };
      setAuditLogs(logs => [audit, ...logs]);
    }
  };

  const handleRejectMeeting = (id: string, reason?: string) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'REJECTED',
            adminFeedback: reason || 'Declined due to scheduling constraint.',
          };
        }
        return m;
      })
    );
  };

  const handleRescheduleMeeting = (id: string, newDate: string, newTimeSlot: string, note?: string) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'RESCHEDULED',
            rescheduledDate: newDate,
            rescheduledTimeSlot: newTimeSlot,
            adminFeedback: note || 'Alternative slot proposed by Admin desk.',
            adminName: 'Siddharth Khosla (Managing Partner)',
          };
        }
        return m;
      })
    );
  };

  const handleUpdateMeetingNotes = (id: string, notes: string) => {
    setMeetings(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            status: 'COMPLETED',
            meetingNotes: notes,
            adminName: m.adminName || 'Siddharth Khosla (Managing Partner)',
          };
        }
        return m;
      })
    );

    const target = meetings.find(m => m.id === id);
    if (target) {
      const audit: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'Siddharth Khosla (Managing Partner)',
        actorRole: 'admin',
        action: 'MEETING_MINUTES_PUBLISHED',
        entityType: 'AGREEMENT',
        entityId: target.meetingNo,
        details: `Published official discussion minutes for meeting #${target.meetingNo} (linked Note: ${target.agreementNo || 'General'}).`,
        ipAddress: '192.168.1.105',
        sha256Seal: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      };
      setAuditLogs(logs => [audit, ...logs]);
    }
  };

  // Open Copilot and immediately execute the user's prompt in the chat
  const handleOpenCopilotWithPrompt = (prompt: string) => {
    setPendingCopilotPrompt(prompt);
    setIsCopilotOpen(true);
  };

  const handleCopilotNavigation = (actionType: string, payload?: any) => {
    if (actionType === 'OPEN_AGREEMENT') {
      setActiveTab('agreements');
      setIsCopilotOpen(false);
    } else if (actionType === 'SIMULATE') {
      setActiveTab('simulator');
      setIsCopilotOpen(false);
    } else if (actionType === 'VIEW_LEDGER') {
      setActiveTab('ledger');
      setIsCopilotOpen(false);
    } else if (actionType === 'NAVIGATE') {
      if (payload === 'admin') switchRole('admin');
      if (payload === 'compliance') switchRole('compliance');
      setIsCopilotOpen(false);
    }
  };

  const pendingApprovalsCount = 
    inflowProposals.filter(i => i.status !== 'APPROVED' && i.status !== 'REJECTED').length +
    withdrawalRequests.filter(w => w.status !== 'DISBURSED' && w.status !== 'REJECTED').length;

  const pendingMeetingsCount = meetings.filter(m => m.status === 'PENDING_ADMIN').length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink-primary font-sans transition-colors relative selection:bg-gold-500/20">
      {/* Interactive 3D Ambient Background Element */}
      <Background3D />

      {/* PWA Banner */}
      <PWAStatusBanner />

      {/* Slim Low-Contrast Institutional Ticker */}
      <LiveTicker />

      {/* Header */}
      <Navbar
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onRefreshData={() => {
          toast.info('Reconciliation Sync', 'Ledgers verified with SEBI Clearing Corporation.');
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          pendingApprovalsCount={pendingApprovalsCount}
          pendingMeetingsCount={pendingMeetingsCount}
        />

        {/* Content Workspace with Proper Edge-to-Edge Desktop & Mobile-First Spacing */}
        <main className="flex-1 overflow-y-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[1600px] mx-auto w-full">
          {role === 'investor' && (
            <InvestorDashboard
              agreements={agreements}
              ledgerEntries={ledgerEntries}
              withdrawalRequests={withdrawalRequests}
              meetings={meetings}
              onAddWithdrawalRequest={handleAddWithdrawalRequest}
              onRequestMeeting={handleRequestMeeting}
              onSimulatorParamChange={(amt) => setSimulatorAmount(amt)}
              activeSubTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenCopilotWithPrompt={handleOpenCopilotWithPrompt}
            />
          )}

          {role === 'admin' && (
            <AdminDashboard
              inflows={inflowProposals}
              withdrawals={withdrawalRequests}
              meetings={meetings}
              onApproveInflow={handleApproveInflow}
              onRejectInflow={handleRejectInflow}
              onApproveWithdrawal={handleApproveWithdrawal}
              onRejectWithdrawal={handleRejectWithdrawal}
              onAddInflow={handleAddInflow}
              onAcceptMeeting={handleAcceptMeeting}
              onRejectMeeting={handleRejectMeeting}
              onRescheduleMeeting={handleRescheduleMeeting}
              onUpdateMeetingNotes={handleUpdateMeetingNotes}
              activeSubTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {role === 'compliance' && (
            <ComplianceDashboard
              kycRecords={kycRecords}
              auditLogs={auditLogs}
              activeSubTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Floating 3D AI Assistant Bubble */}
      <button
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        className="fixed bottom-16 md:bottom-7 right-7 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-[#080B12] floating-bubble-3d flex items-center justify-center transition-all cursor-pointer group border-2 border-white/20 select-none"
        aria-label="Open KTWPL AI Assistant"
        title="Open KTWPL AI Copilot"
      >
        <Sparkles className="w-6 h-6 text-[#080B12] transition-transform group-hover:scale-110" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-surface" />
      </button>

      {/* Assistant Drawer */}
      <KTWPLCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeSimulatorAmount={simulatorAmount}
        onNavigateAction={handleCopilotNavigation}
        pendingPrompt={pendingCopilotPrompt}
        onClearPendingPrompt={() => setPendingCopilotPrompt(null)}
      />

      {/* Enterprise Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
