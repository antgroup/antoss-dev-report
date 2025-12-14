import React from 'react';

import styles from './index.module.scss';

const AddressBar: React.FC = () => {
  return (
    <div className={styles.addressBar}>
      <span className={styles.search}>OPEN SOURCE</span>
      <span className={styles.icon}>{'</>'}</span>
    </div>
  );
};

export default AddressBar;
