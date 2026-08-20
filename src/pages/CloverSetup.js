import React from 'react';
import '../styles/CloverSetup.css';

export const CloverSetup = () => {
  return (
    <div className="clover-setup">
      <h1>Clover Integration Setup</h1>
      <div className="setup-steps">
        <div className="step">
          <h3>Step 1: Get Clover Credentials</h3>
          <ol>
            <li>Go to <a href="https://merchant.clover.com" target="_blank" rel="noreferrer">Clover Merchant Dashboard</a></li>
            <li>Navigate to API Tokens or Settings</li>
            <li>Copy your Merchant ID and Access Token</li>
          </ol>
        </div>

        <div className="step">
          <h3>Step 2: Configure Backend</h3>
          <p>Add these to your backend `.env` file:</p>
          <pre>
{`CLOVER_CLIENT_ID=your_client_id
CLOVER_CLIENT_SECRET=your_client_secret`}
          </pre>
        </div>

        <div className="step">
          <h3>Step 3: Sync Products</h3>
          <p>Go to the Products page and click "Sync from Clover"</p>
          <p>Enter your Merchant ID and Access Token when prompted</p>
        </div>
      </div>
    </div>
  );
};
