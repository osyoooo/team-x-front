'use client';

import styles from './Tabs.module.css';

const Tabs = ({ tabs, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : styles.inactive}`}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;