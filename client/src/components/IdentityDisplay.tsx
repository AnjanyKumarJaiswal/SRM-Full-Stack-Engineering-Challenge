import React from 'react';
import styles from './IdentityDisplay.module.css';

interface IdentityDisplayProps {
  userId: string;
  emailId: string;
  collegeRollNumber: string;
}

export const IdentityDisplay: React.FC<IdentityDisplayProps> = ({
  userId,
  emailId,
  collegeRollNumber,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scanStatus}>
        <span className={styles.pulse}></span>
        ACTIVE SYSTEM SCAN
      </div>
      <div className={styles.card}>
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>
            {userId.substring(0, 2).toUpperCase()}
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.label}>OPERATOR IDENTITY</div>
          <div className={styles.value}>{userId}</div>
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>EMAIL</span>
              <span className={styles.detailValue}>{emailId}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>ROLL NO</span>
              <span className={styles.detailValue}>{collegeRollNumber}</span>
            </div>
          </div>
        </div>
        <div className={styles.systemTag}>
          SRM-SYSTEMS-V2.0
        </div>
      </div>
    </div>
  );
};