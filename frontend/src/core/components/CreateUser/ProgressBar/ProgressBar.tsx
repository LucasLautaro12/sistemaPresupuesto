import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
    currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    return (
        <div className="progress-bar">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
        </div>
    );
};

export default ProgressBar;
