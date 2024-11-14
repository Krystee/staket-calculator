import React, { useState } from "react";
import {
  Calculator,
  Clock,
  ArrowRight,
  X,
  Lock,
  TrendingUp,
  Award,
} from "lucide-react";
import "./styles.css";

// Helper function moved outside both components so it's accessible to both
function getUnlockDate(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Modal Component
const LockDurationModal = ({ isOpen, onClose, token, option }) => {
  if (!isOpen) return null;

  const durationOptions = [
    {
      months: 3,
      multiplier: 1,
      apy: option.apy,
      unlockDate: getUnlockDate(3),
      pointsBoost: "1x points",
    },
    {
      months: 6,
      multiplier: 1.5,
      apy: option.apy * 1.2,
      unlockDate: getUnlockDate(6),
      pointsBoost: "1.5x points",
    },
    {
      months: 9,
      multiplier: 2,
      apy: option.apy * 1.35,
      unlockDate: getUnlockDate(9),
      pointsBoost: "2x points",
    },
    {
      months: 12,
      multiplier: 2.5,
      apy: option.apy * 1.5,
      unlockDate: getUnlockDate(12),
      pointsBoost: "2.5x points",
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Select Lock Duration</h3>
            <p className="modal-subtitle">
              {token} via {option.protocol}
            </p>
          </div>
          <button onClick={onClose} className="modal-close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-content">
          {durationOptions.map((duration) => (
            <div key={duration.months} className="duration-option">
              <div className="duration-header">
                <div className="duration-time">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">
                    {duration.months} Months
                  </span>
                </div>
                <div className="duration-reward">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span>{duration.pointsBoost}</span>
                </div>
              </div>

              <div className="duration-details">
                <div className="detail-item">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">APY</span>
                  <span className="font-medium text-blue-500">
                    {duration.apy.toFixed(1)}%
                  </span>
                </div>
                <div className="detail-item">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Unlocks</span>
                  <span className="font-medium">{duration.unlockDate}</span>
                </div>
              </div>

              <button className="duration-select-button">
                Lock for {duration.months} months
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <p className="text-sm text-gray-500">
            Longer lock periods earn higher rewards and point multipliers
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function StakingCalculator() {
  const [activeTab, setActiveTab] = useState("best");
  const [isCalculator, setIsCalculator] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("1.8");
  const [stakePeriod, setStakePeriod] = useState(6);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const maxStakeAmount = 1.8;

  const stakingOptions = {
    best: {
      basePointsPerEth: 1389,
      apy: 4.8,
      protocol: "Lido",
    },
    cheapest: {
      basePointsPerEth: 1000,
      apy: 3.9,
      protocol: "RocketPool",
    },
    fastest: {
      basePointsPerEth: 1222,
      apy: 4.2,
      protocol: "Coinbase",
    },
    highest: {
      basePointsPerEth: 1667,
      apy: 5.2,
      protocol: "Binance",
    },
  };

  const getTimeMultiplier = (months) => {
    if (months <= 3) return 1;
    if (months <= 6) return 1.5;
    if (months <= 9) return 2;
    return 2.5;
  };

  const calculatePoints = (amount, months) => {
    const basePoints =
      stakingOptions[activeTab].basePointsPerEth * parseFloat(amount);
    return Math.floor(basePoints * getTimeMultiplier(months));
  };

  const handleStakeInput = (value) => {
    value = value.replace(/[^\d.]/g, "");
    const decimals = value.split(".");
    if (decimals.length > 2) value = decimals[0] + "." + decimals[1];
    if (decimals[1]?.length > 4) {
      value = decimals[0] + "." + decimals[1].slice(0, 4);
    }
    if (parseFloat(value) > maxStakeAmount) {
      value = maxStakeAmount.toString();
    }
    setStakeAmount(value);
  };

  const quickStakeOptions = [
    { label: "25%", value: maxStakeAmount * 0.25 },
    { label: "50%", value: maxStakeAmount * 0.5 },
    { label: "75%", value: maxStakeAmount * 0.75 },
    { label: "MAX", value: maxStakeAmount },
  ];

  return (
    <div className="staking-calculator">
      <div className="staking-tabs">
        {[
          { id: "best", label: "Best Value" },
          { id: "cheapest", label: "Lowest Cost" },
          { id: "fastest", label: "Quickest" },
          { id: "highest", label: "Highest Return" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`staking-tab ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="staking-content">
        {/* Token Info */}
        <div className="token-info">
          <div className="token-header">
            <div>
              <h3 className="token-title">ETH</h3>
              <p className="token-protocol">
                via {stakingOptions[activeTab].protocol}
              </p>
            </div>
            <button
              onClick={() => setIsCalculator(!isCalculator)}
              className={`calc-toggle ${isCalculator ? "active" : ""}`}
            >
              <Calculator className="h-5 w-5" />
            </button>
          </div>

          {isCalculator ? (
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Amount to Stake</label>
                <div className="stake-input-container">
                  <input
                    type="text"
                    value={stakeAmount}
                    onChange={(e) => handleStakeInput(e.target.value)}
                    className="stake-input"
                    placeholder="0.0"
                  />
                  <span className="stake-denomination">ETH</span>
                </div>
              </div>
              <div className="quick-stake-grid">
                {quickStakeOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setStakeAmount(option.value.toFixed(4))}
                    className="quick-stake-button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="time-slider-container">
                <div className="slider-header">
                  <label className="text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Lock Period
                  </label>
                  <span className="text-blue">{stakePeriod} months</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={stakePeriod}
                  onChange={(e) => setStakePeriod(parseInt(e.target.value))}
                  className="time-slider"
                />
                <div className="flex-between text-sm text-gray">
                  <span>1 month</span>
                  <span>6 months</span>
                  <span>12 months</span>
                </div>
                <div className="text-sm text-gray flex-between">
                  <Clock className="h-4 w-4" />
                  Unlocks: {getUnlockDate(stakePeriod)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex-between">
                <span className="text-gray">Available to Stake</span>
                <span className="font-medium">{maxStakeAmount} ETH</span>
              </div>
              <div className="flex-between">
                <span className="text-gray">Value</span>
                <span className="font-medium">$3,420</span>
              </div>
            </div>
          )}
        </div>

        {/* Points Display */}
        <div className="points-display">
          <div className="points-value">
            {calculatePoints(stakeAmount, stakePeriod).toLocaleString()}
          </div>
          <div className="points-label">Points Earned</div>
          {isCalculator && (
            <div className="points-breakdown">
              <div>
                {stakingOptions[activeTab].basePointsPerEth} base points per ETH
              </div>
              <div>{getTimeMultiplier(stakePeriod)}x time multiplier</div>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="action-section">
          <div className="apy-display">
            {stakingOptions[activeTab].apy}% APY
          </div>
          <button
            className="stake-button"
            onClick={() => setShowDurationModal(true)}
          >
            <span>Stake {stakeAmount} ETH</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          {isCalculator && (
            <div className="text-sm text-gray text-center">
              {stakePeriod} month lock period
            </div>
          )}
        </div>
      </div>

      {/* Duration Modal */}
      <LockDurationModal
        isOpen={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        token="ETH"
        option={stakingOptions[activeTab]}
      />
    </div>
  );
}
