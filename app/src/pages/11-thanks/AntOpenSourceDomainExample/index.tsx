import React from 'react';

import rightArrow from './right-arrow.svg';

import styles from './index.module.scss';

const AntOpenSourceDomainExample: React.FC<{
  domain: string;
  projectNames: string[];
}> = ({ domain, projectNames }) => {
  return (
    <div className={styles.antOpenSourceDomainExample}>
      <div className={styles.domain}>
        <img src={rightArrow} alt="right arrow" className={styles.rightArrow} />
        <span>{domain}</span>
      </div>
      <div className={styles.projectNames}>{projectNames.join('、')}</div>
    </div>
  );
};

export default AntOpenSourceDomainExample;
