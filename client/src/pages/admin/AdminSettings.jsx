import React, { useEffect, useState } from 'react';
import { Settings, CreditCard, Building, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function AdminSettings() {
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    api.get('/payments/config/account-details')
      .then((res) => {
        if (res.data.success) {
          setAccountDetails(res.data.data);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Gym & Payment Infrastructure Settings</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Configured deposit accounts, mobile wallet merchant profiles, and club parameters
        </p>
      </div>

      {/* Payment Configuration Display */}
      <div className="space-y-6">
        <Card title="Online Payment Account Details" subtitle="Displayed to members during manual transfer submissions">
          {accountDetails ? (
            <div className="space-y-6 text-xs">
              {/* Bank Details */}
              <div className="p-4 rounded-xl bg-gym-bg border border-gym-border space-y-3">
                <div className="flex items-center gap-2 text-gym-primary font-bold text-sm">
                  <Building className="w-4 h-4" />
                  <span>Primary Gym Bank Account (Meezan Bank / SCB)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-gym-muted block">Bank Name:</span>
                    <span className="font-semibold text-gym-text">{accountDetails.bank.name}</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Account Title:</span>
                    <span className="font-semibold text-gym-text">{accountDetails.bank.title}</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Account Number:</span>
                    <span className="font-mono text-gym-text font-bold">{accountDetails.bank.number}</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">IBAN:</span>
                    <span className="font-mono text-gym-text font-bold">{accountDetails.bank.iban}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Wallets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gym-bg border border-gym-border space-y-2">
                  <div className="flex items-center gap-2 text-gym-primary font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>JazzCash Merchant Account</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Till / Mobile #:</span>
                    <span className="font-mono font-bold text-gym-text">{accountDetails.jazzcash.number}</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Merchant Title:</span>
                    <span className="text-gym-text font-medium">{accountDetails.jazzcash.title}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gym-bg border border-gym-border space-y-2">
                  <div className="flex items-center gap-2 text-gym-primary font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>Easypaisa Merchant Account</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Mobile / Till #:</span>
                    <span className="font-mono font-bold text-gym-text">{accountDetails.easypaisa.number}</span>
                  </div>
                  <div>
                    <span className="text-gym-muted block">Merchant Title:</span>
                    <span className="text-gym-text font-medium">{accountDetails.easypaisa.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gym-muted">Loading account configuration...</p>
          )}
        </Card>

        {/* Operating Environment Information */}
        <Card title="System & Environment Specifications" subtitle="Production deployment variables">
          <div className="space-y-3 text-xs text-gym-muted">
            <div className="flex justify-between py-1.5 border-b border-gym-border">
              <span>Platform Version</span>
              <span className="font-mono text-gym-text font-semibold">FitTrack Pro v1.0.0 (Production)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gym-border">
              <span>Backend Architecture</span>
              <span className="text-gym-text font-medium">Node.js Express + Mongoose + JWT + Helmet</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gym-border">
              <span>Database Engine</span>
              <span className="text-gym-text font-medium">MongoDB (Atlas / Docker Containerized)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gym-border">
              <span>Frontend Stack</span>
              <span className="text-gym-text font-medium">React 18 + Vite + Tailwind CSS + Lucide + Recharts</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Role-Based Security Model</span>
              <span className="text-gym-primary font-semibold">Strict Backend RBAC & Token Ownership Verification</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
