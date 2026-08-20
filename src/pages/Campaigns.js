import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/api';
import '../styles/Campaigns.css';

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    type: 'email',
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignService.getCampaigns();
      setCampaigns(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await campaignService.createCampaign(formData.name, formData.content, formData.type);
      setFormData({ name: '', content: '', type: 'email' });
      setShowForm(false);
      loadCampaigns();
    } catch (err) {
      setError('Failed to create campaign');
    }
  };

  const handleSendCampaign = async (campaignId) => {
    try {
      await campaignService.sendCampaign(campaignId, 'all');
      loadCampaigns();
    } catch (err) {
      setError('Failed to send campaign');
    }
  };

  return (
    <div className="campaigns-page">
      <div className="campaigns-header">
        <h1>Campaigns</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Campaign'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="campaign-form" onSubmit={handleCreateCampaign}>
          <input
            type="text"
            placeholder="Campaign Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="banner">Banner</option>
          </select>
          <textarea
            placeholder="Campaign Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <button type="submit">Create Campaign</button>
        </form>
      )}

      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <div className="campaigns-list">
          {campaigns.map((campaign) => (
            <div className="campaign-card" key={campaign.id}>
              <h3>{campaign.name}</h3>
              <p>Type: {campaign.type}</p>
              <p>Status: {campaign.status}</p>
              <p>{campaign.content.substring(0, 100)}...</p>
              {campaign.status === 'draft' && (
                <button
                  className="btn btn-small"
                  onClick={() => handleSendCampaign(campaign.id)}
                >
                  Send Campaign
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
